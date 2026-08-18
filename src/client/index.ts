/**
 * Client-half entry for @onezero-y/dsh-tint-theme, loaded by the DSH Web GUI
 * through the `dsh.client` manifest field in package.json.
 *
 * Registers every shipped skin family into the official `ThemeService` (the
 * sanctioned third-party theme surface, `ctx.theme.register(...)`) and adds
 * a picker row to the settings General section (`ctx.slots`). Selection
 * state is driven entirely from the theme service's own live snapshot
 * (`ctx.theme.getTheme()` + the `theme/change` event) — this plugin does
 * NOT persist a preference of its own. That is a deliberate architecture
 * decision, not an oversight: confirmed against the official
 * `deepseek-ai/deepseek-harness` checkout, `packages/host/apiproxy`'s own
 * `WEB_SETTINGS_NAMESPACES` allowlist means a third-party plugin's own
 * settings namespace is never exposed to the browser
 * (`settings-not-exposed`, identical to an unregistered namespace), so a
 * picker driven by that channel can never reflect a correct selected state.
 * Cross-reload persistence of the *choice itself* rides whatever mechanism
 * the built-in Appearance row's own preference already uses (the theme
 * service's own settings document, for its own three built-in ids) when
 * the active id is one of this plugin's; for a third-party id specifically,
 * that document is not written back to (confirmed by reading the installed
 * `dsh-client-ui-theme` package's own compiled `ThemeRuntime.setTheme`), so
 * a reload currently returns to whatever the built-in Appearance row's own
 * persisted preference is. Adding this plugin's own localStorage-backed
 * persistence layer (the pattern several third-party skin plugins use to
 * work around the same allowlist boundary) is a candidate follow-up, not
 * implemented in this pass.
 *
 * IMPORTANT — client bundle purity gate: none of `@deepseek-ai/dsh-client-ui-theme`,
 * `-ui-slots`, or `-locale` are in the host loader's frozen module table, so
 * this module tree must never import a *value* from them — only types
 * (erased at build time). Every service instance below (`ctx.theme`,
 * `ctx.slots`, `ctx.locale`) is obtained exclusively through Cordis service
 * injection.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls in the ambient `ctx.theme` / `ctx.locale` Context merges,
// and (critically) the `SlotMap` declaration-merge for every settings slot
// key ('settings.general.item' among them) that `dsh-client-ui-settings`
// contributes — without importing any runtime value from them (erased at
// build time).
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { ThemeSnapshot } from '@deepseek-ai/dsh-client-ui-theme/client'
import { createAdaptiveResolver, type AdaptiveResolver } from './adaptive.ts'
import { SKIN_FAMILIES } from './families/index.ts'
import { en, zh, type SkinKey } from './locales.ts'
import { createSkinRowStore } from './settings-store.ts'
import { findFamilyBySkinId, skinIdsOfFamily } from './skins.ts'
import { SkinRow, type SkinRowInjected } from './SkinRow.tsx'

/** Stable Cordis plugin id for the client half. */
export const name = 'dsh-tint-theme-client'

/** Namespace owning this plugin's settings-row copy. */
const SETTINGS_NS = 'settings.dsh-tint-theme'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** This plugin's own settings-row copy (the skin picker row). */
    'settings.dsh-tint-theme': SkinKey
  }
}

/** Required client services: theme (register + read/write active theme), slots + locale (settings row). */
export const inject = ['theme', 'slots', 'locale']

/**
 * Client plugin body: register every shipped family into `ctx.theme`, keep
 * an adaptive resolver listening for system color-scheme flips, and
 * register the skin picker row into Settings > General.
 * @param ctx - Client Cordis context, with the services above guaranteed present.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    const disposers = SKIN_FAMILIES.flatMap((family) => [
      ctx.theme.register(family.light),
      ctx.theme.register(family.dark),
    ])
    return () => disposers.forEach((dispose) => dispose())
  }, 'dsh-tint-theme: register skin families')

  ctx.effect(() => ctx.locale.register(SETTINGS_NS, { zh, en }), 'dsh-tint-theme: settings row dictionaries')

  let adaptive: AdaptiveResolver | undefined
  ctx.effect(() => {
    const media =
      typeof globalThis.matchMedia === 'function'
        ? globalThis.matchMedia('(prefers-color-scheme: dark)')
        : { matches: ctx.theme.getTheme().active.colorScheme === 'dark' }
    adaptive = createAdaptiveResolver({
      media,
      getActiveId: () => ctx.theme.getTheme().active.id,
      setActiveId: (id) => ctx.theme.setTheme(id),
      findFamily: (id) => SKIN_FAMILIES.find((family) => family.id === id),
      findFamilyBySkinId: (skinId) => findFamilyBySkinId(SKIN_FAMILIES, skinId),
    })
    return () => {
      adaptive?.dispose()
      adaptive = undefined
    }
  }, 'dsh-tint-theme: adaptive family resolver')

  const store = createSkinRowStore()
  let bound: BoundActions<typeof store> | undefined
  const sync = (snapshot: ThemeSnapshot): void => {
    const family = findFamilyBySkinId(SKIN_FAMILIES, snapshot.active.id)
    bound?.sync(family?.id, snapshot.revision)
  }
  ctx.on('theme/change', sync)

  const injected = (actions: BoundActions<typeof store>): SkinRowInjected => {
    bound = actions
    // Re-sync from the getter so no event is lost between registration and
    // first render (the store's revision guard drops stale duplicates).
    sync(ctx.theme.getTheme())
    return {
      selectFamily: (familyId) => {
        if (familyId === undefined) {
          // Defer to the built-in appearance: this plugin never calls
          // setTheme('system') itself, it only ever clears its own claim by
          // switching away from any of its own registered ids. There is no
          // official "give control back" primitive; switching to the
          // runtime's currently-preferred builtin scheme is the closest
          // available approximation.
          const scheme = ctx.theme.getTheme().active.colorScheme
          ctx.theme.setTheme(scheme === 'dark' ? 'dark' : 'light')
          return
        }
        adaptive?.selectFamily(familyId)
      },
    }
  }

  ctx.slots.inject('settings.general.item', () =>
    ctx.slots.register(
      {
        name: 'settings.general.item',
        // Ordered after the stock Appearance row (order: 10, per the
        // installed dsh-client-ui-theme package) so this row reads as an
        // addition alongside it.
        id: 'dsh-tint-theme',
        order: 20,
        store,
        locale: SETTINGS_NS,
        inject: injected,
      },
      SkinRow,
    ),
  )
}

/** Every concrete skin id this plugin registers (exported for tests). */
export const ALL_SKIN_IDS: readonly string[] = SKIN_FAMILIES.flatMap(skinIdsOfFamily)
