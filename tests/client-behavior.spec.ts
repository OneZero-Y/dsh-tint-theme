import { Context } from '@deepseek-ai/cordis'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ThemeDefinition, ThemeSnapshot } from '@deepseek-ai/dsh-client-ui-theme/client'
// Type-only: pulls the `ctx.connection` / `ctx.remote` Context merges this
// spec's fakes are typed against (the plugin under test imports the same
// merges — see src/client/index.ts's own doc comment on that import).
import type {} from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import { SKIN_FAMILIES } from '../src/client/families/index.ts'

// See tests/support/fake-runtime-client.ts: the real `/client` subpath is a
// loader-wrapped browser bundle that cannot run under plain Node.
vi.mock('@deepseek-ai/dsh-client-runtime/client', () => import('./support/fake-runtime-client.ts'))

const clientPlugin = await import('../src/client/index.ts')

/**
 * Per dsh-forge-verify: hand-mounting through a real `ctx.plugin(...)` call
 * is the right tool for testing BEHAVIOR (as opposed to testing the
 * Loader's export-unwrap path, which tests/client-index.spec.ts covers
 * separately). Every dependency this plugin declares in `inject` is faked
 * here rather than imported from the real `@deepseek-ai/dsh-client-*`
 * packages, so these tests exercise only this plugin's own glue code.
 */

/** In-memory fake of the ThemeService surface this plugin depends on. */
function createFakeTheme(initialId: string) {
  const registerDisposers: Array<ReturnType<typeof vi.fn>> = []
  const registeredIds: string[] = []
  let activeId = initialId
  let revision = 0
  const listeners = new Set<(snapshot: ThemeSnapshot) => void>()
  const snapshotOf = (): ThemeSnapshot =>
    ({ active: { id: activeId, colorScheme: 'dark' }, revision }) as unknown as ThemeSnapshot
  const theme = {
    register: vi.fn((definition: ThemeDefinition) => {
      registeredIds.push(definition.id)
      const dispose = vi.fn()
      registerDisposers.push(dispose)
      return dispose
    }),
    getTheme: vi.fn(() => snapshotOf()),
    setTheme: vi.fn((id: string) => {
      activeId = id
      revision += 1
      listeners.forEach((listener) => listener(snapshotOf()))
    }),
  }
  return { theme, registerDisposers, registeredIds, on: (l: (s: ThemeSnapshot) => void) => listeners.add(l) }
}

/** In-memory fake of the `ctx.settingsScope.bind(...)` scope this plugin persists through. */
function createFakeSettingsScope(initialFamilyId?: string) {
  type Snapshot = { status: 'loading' | 'ready' | 'unavailable'; value: { familyId?: string } | undefined }
  let snapshot: Snapshot = { status: 'ready', value: initialFamilyId === undefined ? {} : { familyId: initialFamilyId } }
  const listeners = new Set<() => void>()
  const set = vi.fn(async (_field: string, value: unknown) => {
    snapshot = { status: 'ready', value: { familyId: value as string } }
    listeners.forEach((listener) => listener())
  })
  const unset = vi.fn(async (_field: string) => {
    snapshot = { status: 'ready', value: {} }
    listeners.forEach((listener) => listener())
  })
  const scope = {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    set,
    unset,
  }
  const settingsScope = { bind: vi.fn(() => scope) }
  return { settingsScope, scope, set, unset }
}

/** Captures the `settings.general.item` registration this plugin makes. */
function createFakeSlots() {
  let capturedOptions: { inject?: (...args: never[]) => unknown } | undefined
  const registerDispose = vi.fn()
  const slots = {
    inject: vi.fn((_key: string, callback: () => unknown) => {
      const result = callback()
      return typeof result === 'function' ? result : registerDispose
    }),
    register: vi.fn((options: typeof capturedOptions) => {
      capturedOptions = options
      return registerDispose
    }),
  }
  return { slots, registerDispose, getOptions: () => capturedOptions }
}

function createFakeLocale() {
  const registerDispose = vi.fn()
  const calls: Array<{ ns: string }> = []
  const locale = { register: vi.fn((ns: string) => { calls.push({ ns }); return registerDispose }) }
  return { locale, calls, registerDispose }
}

let ctx: Context
let theme: ReturnType<typeof createFakeTheme>
let slotsFake: ReturnType<typeof createFakeSlots>
let localeFake: ReturnType<typeof createFakeLocale>
let settingsScopeFake: ReturnType<typeof createFakeSettingsScope>

/** Mount the client plugin with every declared service faked. */
function mount(initialActiveId = 'light', initialPersistedFamilyId?: string) {
  theme = createFakeTheme(initialActiveId)
  settingsScopeFake = createFakeSettingsScope(initialPersistedFamilyId)
  ctx.provide('theme', { ...theme.theme, on: undefined } as unknown as Context['theme'])
  ctx.provide('slots', slotsFake.slots as unknown as Context['slots'])
  ctx.provide('locale', localeFake.locale as unknown as Context['locale'])
  ctx.provide('settingsScope', settingsScopeFake.settingsScope as unknown as Context['settingsScope'])
  // `connection` has no cordis Context declaration merge anywhere in the
  // official packages — every real consumer (including
  // `settingsScope.bind()` itself) reads it through `ctx.get('connection')`
  // and a manual cast, never through a typed `ctx.connection` property. This
  // fake only needs to exist for `ctx.get` to find at runtime.
  ctx.provide('connection' as never, {} as never)
  ctx.provide('remote', {} as Context['remote'])
  ctx.on('theme/change', (snapshot: unknown) => {
    /* the real ctx.on is used by the plugin itself; this no-op keeps provide() satisfied */
    void snapshot
  })
  return ctx.plugin(clientPlugin)
}

beforeEach(() => {
  ctx = new Context()
  slotsFake = createFakeSlots()
  localeFake = createFakeLocale()
})

describe('mounting', () => {
  it('registers a light and dark skin for every shipped family', async () => {
    await mount()
    expect(theme.theme.register).toHaveBeenCalledTimes(SKIN_FAMILIES.length * 2)
    for (const family of SKIN_FAMILIES) {
      expect(theme.registeredIds).toContain(family.light.id)
      expect(theme.registeredIds).toContain(family.dark.id)
    }
  })

  it('registers the settings row dictionaries under its own namespace', async () => {
    await mount()
    expect(localeFake.calls).toHaveLength(1)
    expect(localeFake.calls[0]?.ns).toBe('settings.dsh-tint-theme')
  })

  it('registers exactly one settings.general.item row, ordered after the stock Appearance row', async () => {
    await mount()
    expect(slotsFake.slots.inject).toHaveBeenCalledWith('settings.general.item', expect.any(Function))
    const options = slotsFake.getOptions()
    expect(options).toMatchObject({ name: 'settings.general.item', id: 'dsh-tint-theme', order: 20 })
  })
})

describe('disposal', () => {
  it('unregisters every skin and the settings row dictionaries', async () => {
    const fiber = await mount()
    await fiber.dispose()
    for (const dispose of theme.registerDisposers) expect(dispose).toHaveBeenCalledTimes(1)
    expect(localeFake.registerDispose).toHaveBeenCalledTimes(1)
  })
})

describe('durable selection', () => {
  it('applies a persisted family on boot through ctx.theme.setTheme', async () => {
    const persistedFamily = SKIN_FAMILIES[0]
    if (persistedFamily === undefined) throw new Error('no shipped families to test against')
    await mount('dark', persistedFamily.id)
    expect(theme.theme.setTheme).toHaveBeenCalledWith(persistedFamily.dark.id)
  })

  it('does not call setTheme when nothing is persisted', async () => {
    await mount('light', undefined)
    expect(theme.theme.setTheme).not.toHaveBeenCalled()
  })

  it('persists an explicit selectFamily call through the settings scope', async () => {
    await mount()
    const family = SKIN_FAMILIES[1]
    if (family === undefined) throw new Error('no second shipped family to test against')
    const options = slotsFake.getOptions()
    const fakeActions = { sync: vi.fn() }
    const injected = options?.inject?.(fakeActions as never) as { selectFamily: (id: string | undefined) => void } | undefined
    injected?.selectFamily(family.id)
    expect(settingsScopeFake.set).toHaveBeenCalledWith('familyId', family.id)
  })

  it('unsets the persisted selection when deferring to the built-in appearance row', async () => {
    await mount()
    const options = slotsFake.getOptions()
    const fakeActions = { sync: vi.fn() }
    const injected = options?.inject?.(fakeActions as never) as { selectFamily: (id: string | undefined) => void } | undefined
    injected?.selectFamily(undefined)
    expect(settingsScopeFake.unset).toHaveBeenCalledWith('familyId')
  })
})
