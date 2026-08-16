/**
 * Client-half entry for @onezero-y/dsh-tint-theme, loaded by the DSH Web GUI
 * through the `dsh.client` manifest field in package.json.
 *
 * Two capabilities, one plugin (see the design record at
 * .agents/notes/2026-08-14-design-decisions.md for why they are not split):
 *  1. Registers this plugin's own original theme(s) into the official
 *     ThemeService, via `ctx.theme.register(...)` — the sanctioned
 *     third-party theme surface (see client/palette.ts for the original
 *     color values).
 *  2. Registers an accent-color tint overlay via `ctx.theme.overrideTokens(...)`
 *     — a token-layer stack that applies over whichever theme is currently
 *     active (this plugin's own, DSH's built-in light/dark, or a theme
 *     registered by any other installed plugin), independent of capability 1
 *     (see client/accents.ts for the scope decision on which token it writes).
 *
 * Both preferences persist through this plugin's OWN settings section
 * (`ctx.settingsScope.bind`, see ../settings-namespace.ts), read and written
 * exclusively here — not through the stock theme/locale services' own
 * settings sections, which this plugin has no write access to and which
 * (per the installed `dsh-client-ui-theme` package's own compiled
 * `ThemeRuntime.setTheme`) only ever persist their OWN three built-in
 * preference ids, never a third-party registered theme id like the ones
 * this plugin registers.
 *
 * IMPORTANT — client bundle purity gate: none of `@deepseek-ai/dsh-client-ui-theme`,
 * `-ui-slots`, `-locale`, or `-ui-settings` are in the host loader's frozen
 * module table (confirmed by reading `packages/client/tsdown.client.ts`'s
 * `CLIENT_EXTERNALS` in a `deepseek-ai/deepseek-harness` checkout), so this
 * module tree must never import a *value* from them — only types (erased at
 * build time). Every service instance below (`ctx.theme`, `ctx.slots`,
 * `ctx.locale`, `ctx.settingsScope`) is obtained exclusively through Cordis
 * service injection, never through a direct module import of a runtime class.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { BoundActions, HandleOf } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls in the ambient `ctx.theme` / `ctx.slots` / `ctx.locale` /
// `ctx.settingsScope` Context merges from these packages without importing
// any runtime value from them (erased at build time — see the purity-gate
// note above). Confirmed against the published packages (npm registry,
// 2026-08-14): dsh-client-ui-theme, dsh-client-locale, and
// dsh-client-ui-settings each export a "./client" subpath; dsh-client-ui-slots
// does not — its root export already carries the ambient `ctx.slots` merge,
// so only "." is imported for it (via the named-type import above).
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { overridesForAccent } from './accents.ts'
import { en, zh, type TintThemeKey } from './locales.ts'
import { REGISTERED_THEMES, TINT_THEME_DARK_ID, TINT_THEME_LIGHT_ID } from './palette.ts'
import { createTintRowStore } from './settings-store.ts'
import { TintRow, type TintRowInjected } from './TintRow.tsx'
import { TINT_SETTINGS_NAMESPACE, type TintThemeSettings } from '../settings-namespace.ts'

/** Stable Cordis plugin id for the client half. Also this plugin's `overrideTokens` layer source id. */
export const name = 'dsh-tint-theme-client'

/** Namespace owning this plugin's settings-row copy. */
const SETTINGS_NS = 'settings.tint-theme'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** This plugin's own settings-row copy (the tint-theme row). */
    'settings.tint-theme': TintThemeKey
  }
}

/**
 * Required client services: `theme` for both capabilities (register + tint),
 * `slots` for the settings-row UI, `locale` for its copy, and
 * `connection`/`remote`/`settingsScope` for this plugin's own durable
 * persistence — the same trio the installed `dsh-client-ui-theme` and
 * `dsh-client-locale` packages both declare (confirmed by reading their
 * compiled `client.js`) for the identical reason: `SettingsScopeBinder.bind`
 * documents that its CALLER must inject `connection` for the transport and
 * `remote` for the forwarded settings invalidation.
 */
export const inject = ['theme', 'slots', 'locale', 'connection', 'remote', 'settingsScope']

/**
 * Client plugin body: register this plugin's theme(s) and settings-row
 * dictionaries, bind this plugin's own durable settings section, and wire
 * the two preferences (palette choice, accent tint) to their respective
 * `ctx.theme` calls — restoring the persisted choice on boot and reapplying
 * it whenever the settings scope changes (a second browser tab, or a
 * settings-document edit made elsewhere).
 * @param ctx - Client Cordis context, with the services above guaranteed present.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => {
    const disposers = REGISTERED_THEMES.map((definition) => ctx.theme.register(definition))
    return () => disposers.forEach((dispose) => dispose())
  }, 'dsh-tint-theme: register themes')

  ctx.effect(() => ctx.locale.register(SETTINGS_NS, { zh, en }), 'dsh-tint-theme: settings row dictionaries')

  const scope = ctx.settingsScope.bind<TintThemeSettings>({ namespace: TINT_SETTINGS_NAMESPACE })

  /**
   * Apply a persisted palette choice to the live theme. Deliberately a
   * one-way action, never a "restore" one: this only ever calls
   * `ctx.theme.setTheme` with one of THIS plugin's own registered ids, and
   * does nothing for an absent/"off" choice — it never calls
   * `setTheme('system')` on its own initiative. That keeps "off" a pure
   * persistence clear rather than a second theme-changing action, so
   * toggling this row off can never clobber a theme the user picked through
   * the stock Appearance row or another plugin after last picking one here.
   * @param themeId - one of this plugin's own registered ids, or undefined.
   */
  const applyPalette = (themeId: string | undefined): void => {
    if (themeId === TINT_THEME_LIGHT_ID || themeId === TINT_THEME_DARK_ID) {
      ctx.theme.setTheme(themeId)
    }
  }

  let disposeAccentOverride: (() => void) | undefined
  /**
   * Apply a persisted accent choice as a token override layer, replacing
   * whatever layer this plugin previously stacked (never adding a second one).
   * @param accent - one of ACCENT_SWATCHES' ids, or undefined for no tint.
   */
  const applyAccent = (accent: string | undefined): void => {
    disposeAccentOverride?.()
    disposeAccentOverride = undefined
    if (accent === undefined) return
    const overrides = overridesForAccent(accent)
    if (overrides === undefined) return
    disposeAccentOverride = ctx.theme.overrideTokens(name, overrides)
  }
  ctx.effect(() => () => disposeAccentOverride?.(), 'dsh-tint-theme: accent override teardown')

  const store = createTintRowStore()
  let bound: BoundActions<HandleOf<typeof store>> | undefined
  const sync = (value: TintThemeSettings | undefined): void => {
    bound?.sync(value?.themeId, value?.accent, scope.getSnapshot().revision ?? 0)
  }

  const adopt = (): void => {
    const value = scope.getSnapshot().value
    applyPalette(value?.themeId)
    applyAccent(value?.accent)
    sync(value)
  }
  ctx.effect(() => scope.subscribe(adopt), 'dsh-tint-theme: settings scope adoption')
  adopt()

  const injected = (actions: BoundActions<HandleOf<typeof store>>): TintRowInjected => {
    bound = actions
    sync(scope.getSnapshot().value)
    return {
      setPalette: (choice) => {
        if (choice === 'off') {
          void scope.unset('themeId')
          return
        }
        const themeId = choice === 'light' ? TINT_THEME_LIGHT_ID : TINT_THEME_DARK_ID
        void scope.set('themeId', themeId)
        applyPalette(themeId)
      },
      setAccent: (choice) => {
        if (choice === 'none') {
          void scope.unset('accent')
          applyAccent(undefined)
          return
        }
        void scope.set('accent', choice)
        applyAccent(choice)
      },
    }
  }

  ctx.slots.inject('settings.general.item', () =>
    ctx.slots.register(
      {
        name: 'settings.general.item',
        // Ordered after the stock Appearance row (order: 10, per the installed
        // dsh-client-ui-theme package) so this plugin's row reads as an
        // addition alongside it, not ahead of the built-in preference.
        id: 'tint-theme',
        order: 20,
        store,
        locale: SETTINGS_NS,
        inject: injected,
      },
      TintRow,
    ),
  )
}
