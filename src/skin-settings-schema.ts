/**
 * The `SkinSettings` schemastery schema — host-only. Kept out of
 * skin-settings.ts (imported by both halves) so the client half never pulls
 * schemastery's runtime into its bundle; see that module's doc comment.
 */
import z from '@deepseek-ai/schemastery'
import { SKIN_SETTINGS_FIELD, type SkinSettings } from './skin-settings.ts'

/** Durable skin-selection schema; also the wire envelope the browser scope validates against. */
export const SkinSettingsSchema: z<SkinSettings> = z.object({
  [SKIN_SETTINGS_FIELD]: z.string(),
})
