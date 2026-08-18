import { Context } from '@deepseek-ai/cordis'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ThemeDefinition, ThemeSnapshot } from '@deepseek-ai/dsh-client-ui-theme/client'
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

/** Mount the client plugin with every declared service faked. */
function mount(initialActiveId = 'light') {
  theme = createFakeTheme(initialActiveId)
  ctx.provide('theme', { ...theme.theme, on: undefined } as unknown as Context['theme'])
  ctx.provide('slots', slotsFake.slots as unknown as Context['slots'])
  ctx.provide('locale', localeFake.locale as unknown as Context['locale'])
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
