import { Context } from '@deepseek-ai/cordis'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ThemeDefinition, ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client'
import { overridesForAccent } from '../src/client/accents.ts'
import { TINT_THEME_DARK_ID, TINT_THEME_LIGHT_ID } from '../src/client/palette.ts'
import { TINT_SETTINGS_NAMESPACE, type TintThemeSettings } from '../src/settings-namespace.ts'

// See tests/support/fake-runtime-client.ts: the real `/client` subpath is a
// loader-wrapped browser bundle that cannot run under plain Node.
vi.mock('@deepseek-ai/dsh-client-runtime/client', () => import('./support/fake-runtime-client.ts'))

const clientPlugin = await import('../src/client/index.ts')

/**
 * Per dsh-forge-verify: hand-mounting through a real `ctx.plugin(...)` call
 * is the right tool for testing BEHAVIOR (as opposed to testing the Loader's
 * export-unwrap path, which tests/client-index.spec.ts covers separately by
 * asserting the module's real exports). Every dependency this plugin
 * declares in `inject` is faked here rather than imported from the real
 * `@deepseek-ai/dsh-client-*` packages, so these tests exercise only this
 * plugin's own glue code — never the services' own internals (those already
 * have their own upstream test suites).
 */

/** Records every `register`/`setTheme`/`overrideTokens` call against a fake theme service. */
function createFakeTheme() {
  const registerDisposers: Array<ReturnType<typeof vi.fn>> = []
  const overrideDisposers: Array<ReturnType<typeof vi.fn>> = []
  const theme = {
    register: vi.fn((_definition: ThemeDefinition) => {
      const dispose = vi.fn()
      registerDisposers.push(dispose)
      return dispose
    }),
    setTheme: vi.fn((_id: string) => {}),
    overrideTokens: vi.fn((_source: string, _tokens: ThemeTokenOverrides) => {
      const dispose = vi.fn()
      overrideDisposers.push(dispose)
      return dispose
    }),
  }
  return { theme, registerDisposers, overrideDisposers }
}

/** Captures the `settings.general.item` registration this plugin makes. */
function createFakeSlots() {
  let capturedOptions: { inject?: (...args: never[]) => unknown } | undefined
  let capturedComponent: unknown
  const registerDispose = vi.fn()
  const slots = {
    inject: vi.fn((_key: string, callback: () => unknown) => {
      const result = callback()
      return typeof result === 'function' ? result : registerDispose
    }),
    register: vi.fn((options: typeof capturedOptions, component: unknown) => {
      capturedOptions = options
      capturedComponent = component
      return registerDispose
    }),
  }
  return {
    slots,
    registerDispose,
    getOptions: () => capturedOptions,
    getComponent: () => capturedComponent,
  }
}

/** Captures the dictionary this plugin registers into the locale service. */
function createFakeLocale() {
  const registerDispose = vi.fn()
  const calls: Array<{ ns: string; dicts: unknown }> = []
  const locale = {
    register: vi.fn((ns: string, dicts: unknown) => {
      calls.push({ ns, dicts })
      return registerDispose
    }),
  }
  return { locale, calls, registerDispose }
}

/**
 * In-memory settings-scope fake. `set`/`unset` are pure spies (no
 * auto-mutation): the direct-write path and the subscribe/adopt path are
 * two independently testable behaviors of this plugin's own code, and
 * conflating them here would test the fake's wiring instead of the plugin's.
 * `publish` simulates an externally driven snapshot change (a second
 * browser tab, or a Host-side edit) for the subscribe/adopt tests.
 */
function createFakeSettingsScope(initial: TintThemeSettings | undefined) {
  let value = initial
  let revision = 0
  const listeners = new Set<() => void>()
  const setSpy = vi.fn(async (_field: string, _val: unknown) => {})
  const unsetSpy = vi.fn(async (_field: string) => {})
  const scope = {
    getSnapshot: () => ({
      status: 'ready' as const,
      value,
      base: undefined,
      user: undefined,
      revision,
      writable: true,
      mode: 'host' as const,
    }),
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    set: setSpy,
    unset: unsetSpy,
  }
  const publish = (next: TintThemeSettings | undefined) => {
    value = next
    revision += 1
    listeners.forEach((listener) => listener())
  }
  return { scope, setSpy, unsetSpy, publish, listenerCount: () => listeners.size }
}

let ctx: Context
let theme: ReturnType<typeof createFakeTheme>
let slotsFake: ReturnType<typeof createFakeSlots>
let localeFake: ReturnType<typeof createFakeLocale>
let scopeFake: ReturnType<typeof createFakeSettingsScope>
let bindSpy: ReturnType<typeof vi.fn>

/** Mount the client plugin with every declared service faked. */
function mount(initialSettings?: TintThemeSettings) {
  scopeFake = createFakeSettingsScope(initialSettings)
  bindSpy = vi.fn((_spec: { namespace: string }) => scopeFake.scope)
  ctx.provide('theme', theme.theme as unknown as Context['theme'])
  ctx.provide('slots', slotsFake.slots as unknown as Context['slots'])
  ctx.provide('locale', localeFake.locale as unknown as Context['locale'])
  ctx.provide('settingsScope', { bind: bindSpy } as unknown as Context['settingsScope'])
  ctx.provide('connection', {})
  ctx.provide('remote', {})
  return ctx.plugin(clientPlugin)
}

beforeEach(() => {
  ctx = new Context()
  theme = createFakeTheme()
  slotsFake = createFakeSlots()
  localeFake = createFakeLocale()
})

describe('mounting', () => {
  it('registers both original themes and the settings-row dictionaries', async () => {
    await mount()
    expect(theme.theme.register).toHaveBeenCalledTimes(2)
    const ids = theme.theme.register.mock.calls.map(([definition]: [ThemeDefinition]) => definition.id)
    expect(ids).toEqual([TINT_THEME_LIGHT_ID, TINT_THEME_DARK_ID])

    expect(localeFake.calls).toHaveLength(1)
    expect(localeFake.calls[0]?.ns).toBe('settings.tint-theme')
  })

  it('binds its own settings namespace, not a shared one', async () => {
    await mount()
    expect(bindSpy).toHaveBeenCalledWith({ namespace: TINT_SETTINGS_NAMESPACE })
  })

  it('registers exactly one settings.general.item row, ordered after the stock Appearance row', async () => {
    await mount()
    expect(slotsFake.slots.inject).toHaveBeenCalledWith('settings.general.item', expect.any(Function))
    const options = slotsFake.getOptions()
    expect(options).toMatchObject({ name: 'settings.general.item', id: 'tint-theme', order: 20 })
    expect(slotsFake.getComponent()).toBeTypeOf('function')
  })

  it('applies no theme or override when no preference is persisted yet', async () => {
    await mount(undefined)
    expect(theme.theme.setTheme).not.toHaveBeenCalled()
    expect(theme.theme.overrideTokens).not.toHaveBeenCalled()
  })

  it('adopts a persisted preference immediately on mount', async () => {
    await mount({ themeId: TINT_THEME_DARK_ID, accent: 'ember' })
    expect(theme.theme.setTheme).toHaveBeenCalledWith(TINT_THEME_DARK_ID)
    expect(theme.theme.overrideTokens).toHaveBeenCalledWith(clientPlugin.name, overridesForAccent('ember'))
  })
})

describe('the tint-theme row actions', () => {
  /** Bind the row's injected actions the way the render machinery would. */
  function bindRowActions() {
    const options = slotsFake.getOptions()
    if (options?.inject === undefined) throw new Error('row was not registered')
    const sync = vi.fn()
    return options.inject({ sync } as never) as { setPalette: (c: 'off' | 'light' | 'dark') => void; setAccent: (c: string) => void }
  }

  it('setPalette writes the field and applies the theme directly, without waiting for the write to settle', async () => {
    await mount()
    const { setPalette } = bindRowActions()
    setPalette('light')
    expect(scopeFake.setSpy).toHaveBeenCalledWith('themeId', TINT_THEME_LIGHT_ID)
    expect(theme.theme.setTheme).toHaveBeenCalledWith(TINT_THEME_LIGHT_ID)
  })

  it("setPalette('off') clears the field and never calls setTheme itself", async () => {
    await mount()
    const { setPalette } = bindRowActions()
    setPalette('off')
    expect(scopeFake.unsetSpy).toHaveBeenCalledWith('themeId')
    expect(theme.theme.setTheme).not.toHaveBeenCalled()
  })

  it('setAccent writes the field and stacks exactly one override layer, replacing the previous one', async () => {
    await mount()
    const { setAccent } = bindRowActions()

    setAccent('ember')
    expect(scopeFake.setSpy).toHaveBeenCalledWith('accent', 'ember')
    expect(theme.theme.overrideTokens).toHaveBeenNthCalledWith(1, clientPlugin.name, overridesForAccent('ember'))
    const firstDispose = theme.overrideDisposers[0]

    setAccent('saffron')
    expect(firstDispose).toHaveBeenCalledTimes(1)
    expect(theme.theme.overrideTokens).toHaveBeenNthCalledWith(2, clientPlugin.name, overridesForAccent('saffron'))
    expect(theme.overrideDisposers).toHaveLength(2)
  })

  it("setAccent('none') clears the field and disposes the active layer without creating a new one", async () => {
    await mount()
    const { setAccent } = bindRowActions()
    setAccent('ember')
    const dispose = theme.overrideDisposers[0]

    setAccent('none')
    expect(scopeFake.unsetSpy).toHaveBeenCalledWith('accent')
    expect(dispose).toHaveBeenCalledTimes(1)
    expect(theme.theme.overrideTokens).toHaveBeenCalledTimes(1)
  })
})

describe('reacting to externally driven settings changes', () => {
  it('re-applies the theme and override when the settings scope publishes a new snapshot', async () => {
    await mount(undefined)
    scopeFake.publish({ themeId: TINT_THEME_LIGHT_ID, accent: 'moss' })
    expect(theme.theme.setTheme).toHaveBeenCalledWith(TINT_THEME_LIGHT_ID)
    expect(theme.theme.overrideTokens).toHaveBeenCalledWith(clientPlugin.name, overridesForAccent('moss'))
  })

  it("syncs the row's store from the published snapshot", async () => {
    await mount(undefined)
    const options = slotsFake.getOptions()
    if (options?.inject === undefined) throw new Error('row was not registered')
    const sync = vi.fn()
    options.inject({ sync } as never)
    sync.mockClear()

    scopeFake.publish({ themeId: TINT_THEME_DARK_ID, accent: 'plum' })
    expect(sync).toHaveBeenCalledWith(TINT_THEME_DARK_ID, 'plum', 1)
  })
})

describe('disposal', () => {
  it('unregisters both themes, the dictionaries, the active override, and the scope subscription', async () => {
    const fiber = await mount({ themeId: TINT_THEME_LIGHT_ID, accent: 'lagoon' })
    expect(scopeFake.listenerCount()).toBe(1)

    await fiber.dispose()

    expect(theme.registerDisposers).toHaveLength(2)
    for (const dispose of theme.registerDisposers) expect(dispose).toHaveBeenCalledTimes(1)
    expect(localeFake.registerDispose).toHaveBeenCalledTimes(1)
    expect(theme.overrideDisposers[0]).toHaveBeenCalledTimes(1)
    expect(scopeFake.listenerCount()).toBe(0)
  })
})
