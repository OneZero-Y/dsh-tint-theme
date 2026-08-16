/**
 * Host-only durable schema for this plugin's own settings section.
 *
 * Deliberately kept out of settings-namespace.ts (the client-safe module):
 * `@deepseek-ai/schemastery` is a value import here, and this file is never
 * reachable from the client bundle's entry graph (src/client/index.ts only
 * imports the namespace constant and the plain TypeScript interface from
 * settings-namespace.ts, both erased or dependency-free at runtime).
 */
import Schema from '@deepseek-ai/schemastery'
import type { TintThemeSettings } from './settings-namespace.ts'

/**
 * Both fields are optional strings with no schema default, mirroring the
 * pattern read in the installed `@deepseek-ai/dsh-client-locale` host
 * half's `LocaleSettingsSchema` (`Schema.union([...LOCALE_IDS]).required(false)`)
 * for a field whose absence means "no explicit selection, defer elsewhere"
 * rather than a concrete default value: an absent `themeId` defers to
 * whatever last set the active theme, and an absent `accent` means no tint
 * layer is applied.
 */
export const TintThemeSettingsSchema: Schema<TintThemeSettings> = Schema.object({
  themeId: Schema.string().required(false),
  accent: Schema.string().required(false),
})
