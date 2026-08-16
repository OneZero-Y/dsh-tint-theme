/**
 * This plugin's own registered themes: an original light/dark pair, built
 * from a single hue decision independent of any third-party plugin's
 * concrete color values (see the design record's differentiation
 * requirement — official DSH mechanisms and the `--dsw-alias-*` token
 * NAMES are the shared public contract; the color values assigned to them
 * here are this plugin's own).
 *
 * Design note (own work, not sourced from any reference project): a single
 * warm-neutral "clay" base carries both palettes — a desaturated
 * orange-brown rather than the cooler blue-neutral base the stock DSH theme
 * uses (visible in the installed `dsh-client-ui-theme` package's own
 * `--dsw-static-neutral-bluish-*` scale) — so selecting this theme reads as
 * a genuinely different surface tone, not a retint of the built-in one.
 * Only the token NAMES are shared (the official `ThemeDefinition.tokens`
 * contract); every value below was chosen for this plugin.
 */
import type { ThemeDefinition, ThemeTokens } from '@deepseek-ai/dsh-client-ui-theme/client'

/** Warm-neutral "clay" base scale, light mode (background lightest to darkest). */
const CLAY_LIGHT: ThemeTokens = {
  '--dsw-alias-bg-base': '#faf6f2',
  '--dsw-alias-bg-layer-1': '#f3ece4',
  '--dsw-alias-bg-layer-2': '#ece2d6',
  '--dsw-alias-bg-overlay': '#e3d5c4',
  '--dsw-alias-border-l1': 'rgba(92, 66, 42, 0.08)',
  '--dsw-alias-border-l2': 'rgba(92, 66, 42, 0.16)',
  '--dsw-alias-label-primary': '#3a2c1e',
  '--dsw-alias-label-secondary': '#6b5844',
  '--dsw-alias-brand-primary': '#b5622c',
  '--dsw-specific-sidebar-fill': '#f3ece4',
}

/** Warm-neutral "clay" base scale, dark mode. */
const CLAY_DARK: ThemeTokens = {
  '--dsw-alias-bg-base': '#211a13',
  '--dsw-alias-bg-layer-1': '#2b2219',
  '--dsw-alias-bg-layer-2': '#382c20',
  '--dsw-alias-bg-overlay': '#493a29',
  '--dsw-alias-border-l1': 'rgba(255, 237, 213, 0.08)',
  '--dsw-alias-border-l2': 'rgba(255, 237, 213, 0.14)',
  '--dsw-alias-label-primary': '#f3ece4',
  '--dsw-alias-label-secondary': '#c9b8a3',
  '--dsw-alias-brand-primary': '#e08a4f',
  '--dsw-specific-sidebar-fill': '#2b2219',
}

/** This plugin's light-variant theme id, persisted as `TintThemeSettings.themeId`. */
export const TINT_THEME_LIGHT_ID = 'tint-theme-clay-light'
/** This plugin's dark-variant theme id, persisted as `TintThemeSettings.themeId`. */
export const TINT_THEME_DARK_ID = 'tint-theme-clay-dark'

/**
 * This plugin's own registered themes, in the shape `ctx.theme.register()`
 * expects. Registered with the fixed ids above so the settings section can
 * persist a stable `themeId` selection across a reload.
 */
export const REGISTERED_THEMES: readonly ThemeDefinition[] = [
  { id: TINT_THEME_LIGHT_ID, colorScheme: 'light', tokens: CLAY_LIGHT },
  { id: TINT_THEME_DARK_ID, colorScheme: 'dark', tokens: CLAY_DARK },
]
