/**
 * Raw settings-namespace string shared, unbundled, between the host half
 * (which brands it via `settingsNamespace()` from `@deepseek-ai/dsh-settings`
 * to register the durable schema) and the client half (which only ever
 * needs the plain string for `ctx.settingsScope.bind({ namespace })` —
 * binding does not require the branded type, only the host's `register`
 * does). Keeping this as a dependency-free constant, rather than
 * re-exporting the branded value from the host module, means the client
 * bundle never has to import anything from `@deepseek-ai/dsh-settings` — a
 * host-only package outside the client loader's shared module table (the
 * client bundle purity gate this repo's other client-half files already
 * document).
 */
export const TINT_SETTINGS_NAMESPACE = 'tint-theme'

/**
 * Durable section this plugin's own settings row persists, read and written
 * exclusively through the client half's `ctx.settingsScope` binding.
 *
 * This plugin owns its own durability rather than leaning on the stock
 * theme service's settings persistence: reading `dsh-client-ui-theme`'s
 * compiled client bundle shows `ThemeRuntime.setTheme` only writes back to
 * its OWN settings document when the id is one of the three built-in
 * preferences (`isThemePreference(id)` guards the write) — a third-party
 * registered theme id, like the ones this plugin registers, is switched to
 * live but never itself persisted there. Without this section, picking
 * this plugin's theme would not survive a reload.
 */
export interface TintThemeSettings {
  /**
   * One of this plugin's own registered theme ids (see client/palette.ts).
   * Absent (not stored yet, or explicitly cleared) defers to whichever
   * mechanism last set the active theme — the stock Appearance row, or
   * another plugin — exactly as `dsh-client-locale`'s own
   * `LocaleSettings.preference` (also schema-optional, no default) defers
   * to the browser-derived locale when absent.
   */
  themeId?: string
  /** One of ACCENT_SWATCHES' ids (see client/accents.ts). Absent means no tint layer. */
  accent?: string
}
