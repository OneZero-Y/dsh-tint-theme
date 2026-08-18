/**
 * Durable skin-family selection: namespace name, field name, and section
 * shape, shared by the host half (schema registration, src/index.ts) and the
 * client half (the scope binder, src/client/index.ts) — the same split the
 * official `ui-theme` plugin uses for its own `ThemeSettings`/
 * `THEME_SETTINGS_NAMESPACE`.
 *
 * Deliberately carries NO runtime import of `@deepseek-ai/schemastery`
 * (the schema value itself lives in src/skin-settings-schema.ts, a
 * host-only module): the client half imports this module for its plain
 * string/type exports only, and a value import here would pull
 * schemastery's runtime into the client bundle for a value the client
 * never uses (confirmed by a bundle-size regression: bundling it added
 * ~34 kB to lib/client.js).
 */

/**
 * Settings namespace owned by this plugin, as the plain lowercase-kebab-case
 * string the official `settingsNamespace()` brand validator accepts (the
 * host half re-validates and brands it — see src/index.ts). Kept as a plain
 * string here, rather than importing `settingsNamespace` from
 * `@deepseek-ai/dsh-settings`, so this shared module stays importable from
 * the client half without pulling a host-oriented package into the client
 * bundle purity gate's module graph.
 */
export const SKIN_SETTINGS_NAMESPACE = 'dsh-tint-theme'

/** Field carrying the selected family id, or absent while no family is active. */
export const SKIN_SETTINGS_FIELD = 'familyId'

/** Durable skin-selection section shared by the Host schema and the browser scope. */
export interface SkinSettings {
  /** Selected family id, or `undefined` to defer to the built-in Appearance row. */
  familyId?: string
}
