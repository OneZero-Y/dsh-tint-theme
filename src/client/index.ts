/**
 * Client-half entry for @onezero-y/dsh-tint-theme, loaded by the DSH Web GUI
 * through the `dsh.client` manifest field in package.json.
 *
 * Registers every shipped skin family into the official `ThemeService` (the
 * sanctioned third-party theme surface, `ctx.theme.register(...)`) and adds
 * a dedicated "Skins" page to the settings nav (`ctx.slots`, `settings.section`)
 * — a peer of Models/Agent Presets/Plugins, not a row inside General: 25+
 * skins read poorly as one more crowded row, and every other multi-item
 * settings surface in this ecosystem already gets its own page. The picker's
 * SELECTED TILE always mirrors the theme service's own live snapshot
 * (`ctx.theme.getTheme()` + the `theme/change` event), because that state
 * must reflect whichever theme id is actually active regardless of who set
 * it. Cross-reload persistence of the user's CHOICE is a separate concern,
 * handled through this plugin's own settings namespace, bound via
 * `ctx.settingsScope.bind(...)` and written on every explicit
 * `selectFamily` call; on boot, the persisted family (if any) is applied
 * back through `ctx.theme.setTheme` once the scope's first snapshot lands.
 *
 * Persistence history: earlier revisions of this plugin could not persist a
 * selection of their own — the official `deepseek-ai/deepseek-harness`
 * checkout's `packages/host/apiproxy` gated every third-party settings
 * namespace behind a hardcoded `WEB_SETTINGS_NAMESPACES` allowlist, so a
 * namespace outside it answered `settings-not-exposed` regardless of
 * registration. That allowlist was removed in the official repository's
 * `2026-08-12-plugin-owned-settings-surface` Agent Note ("Registering is
 * exposing"), first released in `@deepseek-ai/dsh-client-ui-theme`
 * `0.1.0-rc.7`, which this plugin now requires.
 *
 * IMPORTANT — client bundle purity gate: none of `@deepseek-ai/dsh-client-ui-theme`,
 * `-ui-slots`, `-ui-settings`, or `-locale` are in the host loader's frozen
 * module table, so this module tree must never import a *value* from them —
 * only types (erased at build time). Every service instance below
 * (`ctx.theme`, `ctx.slots`, `ctx.locale`, `ctx.settingsScope`) is obtained
 * exclusively through Cordis service injection.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { BoundActions } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls in the ambient `ctx.theme` / `ctx.locale` Context merges,
// and (critically) the `SlotMap` declaration-merge for every settings slot
// key ('settings.section' among them) that `dsh-client-ui-settings`
// contributes — without importing any runtime value from them (erased at
// build time).
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the `ctx.connection` / `ctx.remote` Context merges that
// `settingsScope.bind()` resolves through (see its own doc comment: "The
// caller injects `connection` for the transport and `remote` for the
// forwarded settings invalidation"). This plugin never imports a value from
// either package — both services are provided elsewhere in the composed
// bundle, reached here only through `inject` + declaration merging.
import type {} from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { ThemeSnapshot } from '@deepseek-ai/dsh-client-ui-theme/client'
import { createAdaptiveResolver, type AdaptiveResolver } from './adaptive.ts'
import { SKIN_FAMILIES } from './families/index.ts'
import { en, zh, type SkinKey } from './locales.ts'
import { createSkinRowStore } from './settings-store.ts'
import { findFamilyBySkinId, skinIdsOfFamily } from './skins.ts'
import { SkinRow, type SkinRowInjected } from './SkinRow.tsx'
// This plugin's own host-shared settings constants/types: no `dsh-client-*`
// value import here, so this stays clear of the client bundle purity gate.
import { SKIN_SETTINGS_FIELD, SKIN_SETTINGS_NAMESPACE, type SkinSettings } from '../skin-settings.ts'

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

/**
 * Required client services: theme (register + read/write active theme),
 * slots + locale (settings row), settingsScope (this plugin's own durable
 * selection), and connection + remote (the transport `settingsScope.bind()`
 * resolves through — the same pair the official ui-theme plugin injects for
 * the identical reason; see its own `inject` list).
 */
export const inject = ['theme', 'slots', 'locale', 'settingsScope', 'connection', 'remote']

/**
 * Client plugin body: register every shipped family into `ctx.theme`, keep
 * an adaptive resolver listening for system color-scheme flips, restore any
 * durably persisted selection on boot, and register the dedicated "Skins"
 * settings page.
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

  const scope = ctx.settingsScope.bind<SkinSettings>({ namespace: SKIN_SETTINGS_NAMESPACE })

  // Apply the persisted family exactly once, the first time the scope's
  // snapshot leaves `loading` (either `ready` with a stored choice, or
  // `unavailable`/`ready`-with-no-field, which leaves the built-in
  // Appearance row's own preference untouched). Later scope changes are this
  // plugin's own writes echoing back — re-applying them is a harmless no-op
  // (`ThemeRuntime.setTheme` already skips a write when the id is unchanged).
  let appliedInitialSelection = false
  const applyInitialSelection = (): void => {
    if (appliedInitialSelection) return
    const snapshot = scope.getSnapshot()
    if (snapshot.status === 'loading') return
    appliedInitialSelection = true
    const familyId = snapshot.value?.familyId
    if (familyId !== undefined && SKIN_FAMILIES.some((family) => family.id === familyId)) {
      adaptive?.selectFamily(familyId)
    }
  }
  ctx.effect(() => scope.subscribe(applyInitialSelection), 'dsh-tint-theme: apply persisted selection')
  applyInitialSelection()

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
          void scope.unset(SKIN_SETTINGS_FIELD)
          return
        }
        adaptive?.selectFamily(familyId)
        // Persist the explicit choice so a reload restores it (see
        // `applyInitialSelection` above) — the actual write-back this
        // plugin gained once the official settings-namespace allowlist was
        // removed (module doc, "Persistence history").
        void scope.set(SKIN_SETTINGS_FIELD, familyId)
      },
    }
  }

  // Nav label thunk, independent of any mounted component: the framework
  // re-evaluates it per read (see resolveSlotLabel), so it follows the
  // active locale without re-registration — the same pattern
  // ui-settings-general/ui-agent-preset use for their own nav rows.
  const t = ctx.locale.bind(SETTINGS_NS)

  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      {
        name: 'settings.section',
        // Ordered after the shipped nav rows (general: 0, models: 10,
        // plugins: 15, agent-presets: 20, per their own installed packages)
        // so this page reads as the newest addition, at the foot of the nav.
        id: 'dsh-tint-theme',
        order: 25,
        label: () => t('skins.title'),
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
