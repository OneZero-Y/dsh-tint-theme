/**
 * Preset accent swatches for the tint overlay — this plugin's second
 * capability, independent of which theme (this plugin's own, DSH's
 * built-in light/dark, or a third-party plugin's) is currently active.
 *
 * Scope decision (documented here per the design record's open item on
 * "exact token names the tint overlay writes to"): the overlay writes only
 * `--dsw-alias-brand-primary` — the one token the installed
 * `dsh-client-ui-theme` package's own `BUILTIN_INSPECT_TOKENS` describes as
 * "Primary brand accent" (read from its compiled `lib/client.js`). Reading
 * that same package's `design-platform.css`, `--dsw-alias-button-primary-fill`
 * is itself defined as `var(--dsw-alias-brand-primary)`, so overriding this
 * one token also re-colors every surface that already keys off the brand
 * color (the primary button fill, and anything else built the same way)
 * without this plugin needing to know or restate that CSS wiring itself —
 * overriding more tokens than this would mean guessing at coupling this
 * plugin has no visibility into and risks fighting the active theme's own
 * design rather than tinting it.
 *
 * Each swatch supplies one hex value reused for both `light` and `dark`
 * (the override-layer contract's explicit rule for a scheme-invariant
 * value, per `ThemeTokenModes`'s own doc comment) rather than two different
 * shades per mode: an accent color is a deliberate user choice, so keeping
 * it visually identical across the light/dark switch is the more legible
 * behavior for a *tint*, versus a whole *theme* which does get its own
 * distinct light/dark pair (see palette.ts).
 */
import type { ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client'

/** One selectable accent: id (persisted) plus its swatch color. */
export interface AccentSwatch {
  /** Accent id (persisted as `TintThemeSettings.accent`). */
  id: string
  /** Swatch hex value, shown in the picker and applied to both color schemes. */
  color: string
}

/**
 * Six original hues, none matched to a specific reference project's brand
 * palette — picked to space out clearly across the hue wheel so adjacent
 * swatches in the picker read as distinct choices rather than near-duplicates.
 */
export const ACCENT_SWATCHES: readonly AccentSwatch[] = [
  { id: 'ember', color: '#c1502e' },
  { id: 'saffron', color: '#c68a1c' },
  { id: 'moss', color: '#5c7a34' },
  { id: 'lagoon', color: '#1f8a7a' },
  { id: 'indigo', color: '#4a5fc1' },
  { id: 'plum', color: '#8b4a9c' },
]

/**
 * Build the single-token override layer for one accent id.
 * @param accentId - an {@link ACCENT_SWATCHES} id.
 * @returns the override map for `ctx.theme.overrideTokens`, or `undefined`
 * for an unknown id (caller treats this the same as "no tint").
 */
export function overridesForAccent(accentId: string): ThemeTokenOverrides | undefined {
  const swatch = ACCENT_SWATCHES.find((s) => s.id === accentId)
  if (swatch === undefined) return undefined
  return {
    '--dsw-alias-brand-primary': { light: swatch.color, dark: swatch.color },
  }
}
