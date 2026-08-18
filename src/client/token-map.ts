/**
 * Semantic palette to `--dsw-*` token mapper. Every ported theme supplies a
 * small set of semantic roles (background layers, text, accent, diagnostic
 * colors); this function expands that into the full alias-token surface the
 * DSH theme runtime reads (confirmed against the installed
 * `@deepseek-ai/dsh-client-ui-theme` package's own `design-platform.css`,
 * which is the source of every `--dsw-alias-*`/`--dsw-specific-*` name used
 * below — the token NAMES are DSH's own public contract, read directly from
 * that stylesheet rather than assumed).
 *
 * This mapping function is this package's own implementation — a different
 * set of token assignments and helper shape than any third-party plugin's
 * equivalent mapper — built directly from the official CSS, not derived from
 * another plugin's mapping choices.
 */
import type { ThemeDefinition } from '@deepseek-ai/dsh-client-ui-theme/client'
import type { SkinDefinition, SkinFamily } from './skins.ts'

/** Minimal semantic roles every ported palette must supply. */
export interface SemanticPalette {
  /** Page canvas background (the base layer). */
  bg: string
  /** First elevated surface (cards, panels). */
  bgRaised: string
  /** Second elevated surface (menus, popovers). */
  bgOverlay: string
  /** Sidebar fill. */
  sidebar: string
  /** Hairline border/divider color. */
  border: string
  /** Primary body text. */
  text: string
  /** Secondary/muted text. */
  textMuted: string
  /** Placeholder/caption text. */
  textFaint: string
  /** Brand/accent color (links, primary buttons, active states). */
  accent: string
  /** Foreground color placed on top of a solid `accent` fill. */
  accentForeground: string
  /** Diagnostic red. */
  danger: string
  /** Diagnostic green. */
  success: string
  /** Diagnostic yellow/amber. */
  warning: string
}

/** Parse a `#rrggbb` hex string into a CSS `rgba(...)` string at the given alpha. */
function withAlpha(hex: string, alpha: number): string {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex)
  if (match === null) throw new Error(`withAlpha() expected a #rrggbb hex color, received "${hex}"`)
  const [, r = '00', g = '00', b = '00'] = match
  return `rgba(${Number.parseInt(r, 16)}, ${Number.parseInt(g, 16)}, ${Number.parseInt(b, 16)}, ${alpha})`
}

/**
 * Expand a semantic palette into the alias-token map `ThemeDefinition.tokens`
 * expects. Every key below is a token name read directly from the installed
 * `dsh-client-ui-theme` package's `design-platform.css`.
 * @param palette - this skin's semantic roles.
 * @returns the full `--dsw-*` token map.
 */
export function expandSemanticPalette(palette: SemanticPalette): ThemeDefinition['tokens'] {
  return {
    '--dsw-alias-bg-base': palette.bg,
    '--dsw-alias-bg-layer-1': palette.bgRaised,
    '--dsw-alias-bg-layer-2': palette.bgRaised,
    '--dsw-alias-bg-layer-3': palette.bgOverlay,
    '--dsw-alias-bg-module-platform': palette.bgOverlay,
    '--dsw-alias-bg-multi-select': palette.bgOverlay,
    '--dsw-alias-bg-overlay': palette.bgOverlay,
    '--dsw-alias-bg-skeleton': withAlpha(palette.text, 0.06),
    '--dsw-alias-border-l1': withAlpha(palette.border, 0.5),
    '--dsw-alias-border-l2': palette.border,
    '--dsw-alias-brand-primary': palette.accent,
    '--dsw-alias-brand-text': palette.text,
    '--dsw-alias-button-elevated-fill': palette.bgRaised,
    '--dsw-alias-button-primary-dimmed': palette.bgOverlay,
    '--dsw-alias-button-primary-fill': palette.accent,
    '--dsw-alias-button-primary-hover': withAlpha(palette.accent, 0.85),
    '--dsw-alias-interactive-bg-active': withAlpha(palette.accent, 0.2),
    '--dsw-alias-interactive-bg-hover': withAlpha(palette.text, 0.06),
    '--dsw-alias-label-primary': palette.text,
    '--dsw-alias-label-secondary': palette.textMuted,
    '--dsw-alias-label-tertiary': palette.textFaint,
    '--dsw-alias-markdown-code-block': palette.bgRaised,
    '--dsw-alias-markdown-inline-code': palette.bgOverlay,
    '--dsw-alias-scrollbar-bg-l1': withAlpha(palette.text, 0.16),
    '--dsw-alias-scrollbar-bg-l2': withAlpha(palette.text, 0.16),
    '--dsw-alias-scrollbar-hover-l1': withAlpha(palette.text, 0.28),
    '--dsw-alias-scrollbar-hover-l2': withAlpha(palette.text, 0.28),
    '--dsw-alias-state-business-primary': palette.accent,
    '--dsw-alias-state-error-primary': palette.danger,
    '--dsw-alias-state-error-secondary': palette.danger,
    '--dsw-alias-state-success-primary': palette.success,
    '--dsw-alias-state-success-secondary': palette.success,
    '--dsw-alias-state-warn-primary': palette.warning,
    '--dsw-alias-state-warn-secondary': palette.warning,
    '--dsw-alias-toast-bg': palette.bgOverlay,
    '--dsw-alias-tooltip-bg': palette.bgOverlay,
    '--dsw-specific-sidebar-fill': palette.sidebar,
    '--dsw-specific-menu': palette.bgOverlay,
    '--dsw-specific-selector': palette.bgOverlay,
  }
}

/** Build a two-stop diagonal gradient swatch from a skin's own bg/accent colors. */
function previewGradient(bg: string, accent: string): string {
  return `linear-gradient(135deg, ${bg} 0%, ${accent} 150%)`
}

/**
 * Build a complete `SkinFamily` (light + dark) from two semantic palettes.
 * @param id - family id (also used as the base for the two concrete skin ids: `${id}-light`/`${id}-dark`).
 * @param nameKey - locale key for the family's display name.
 * @param light - the light-mode semantic palette.
 * @param dark - the dark-mode semantic palette.
 * @returns the assembled family.
 */
export function buildFamily(id: string, nameKey: string, light: SemanticPalette, dark: SemanticPalette): SkinFamily {
  const lightSkin: SkinDefinition = {
    id: `${id}-light`,
    colorScheme: 'light',
    tokens: expandSemanticPalette(light),
    preview: previewGradient(light.bg, light.accent),
  }
  const darkSkin: SkinDefinition = {
    id: `${id}-dark`,
    colorScheme: 'dark',
    tokens: expandSemanticPalette(dark),
    preview: previewGradient(dark.bg, dark.accent),
  }
  return { id, nameKey, light: lightSkin, dark: darkSkin }
}
