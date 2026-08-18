/**
 * Skin data model: every selectable skin is a `ThemeDefinition` (registered
 * into the official `ThemeService` — the sanctioned third-party theme
 * surface), plus a picker-tile preview swatch. Families group a light and a
 * dark skin under one user-facing choice; the client resolves which concrete
 * skin is active from the system color-scheme preference.
 *
 * Design note distinguishing this package from ZeroZ-lab/dsh-web-skins (a
 * third-party plugin doing something structurally similar): this file's own
 * type shapes, field names, and resolution helpers are an independent
 * implementation, not copied from that project. What IS shared is the
 * sanctioned official API surface both plugins build on (`ctx.theme.register`,
 * `ThemeDefinition.tokens`) — that surface is DeepSeek Harness's own public
 * contract, not that plugin's intellectual property. The actual color
 * VALUES in this package's families are ported from named upstream
 * open-source editor themes with their own explicit MIT/permissive licenses,
 * documented per-family in THIRD_PARTY_NOTICES.md — not sourced from
 * dsh-web-skins' own (already-ported) copies of those palettes.
 */
import type { ThemeDefinition } from '@deepseek-ai/dsh-client-ui-theme/client'

/** One selectable, concrete skin: exactly the shape `ctx.theme.register()` expects. */
export interface SkinDefinition {
  /** Theme id registered into ThemeService. Must be globally unique and never 'system'/'light'/'dark'. */
  id: string
  /** Base color scheme this skin builds on (drives `body[data-ds-dark-theme]`). */
  colorScheme: ThemeDefinition['colorScheme']
  /** `--dsw-alias-*`/`--dsw-specific-*` token overrides for this skin. */
  tokens: ThemeDefinition['tokens']
  /** Swatch CSS background for the picker tile (a CSS gradient built from the skin's own colors). */
  preview: string
}

/** A user-facing family: one light and one dark skin, resolved by the active color-scheme preference. */
export interface SkinFamily {
  /** Stable family id (the value persisted/selected by the picker). */
  id: string
  /** Localized display name key, resolved through this plugin's own locale namespace. */
  nameKey: string
  /** The light-mode concrete skin. */
  light: SkinDefinition
  /** The dark-mode concrete skin. */
  dark: SkinDefinition
}

/** Every concrete skin id belonging to a family (both color-scheme variants). */
export function skinIdsOfFamily(family: SkinFamily): readonly [string, string] {
  return [family.light.id, family.dark.id]
}

/** Resolve which concrete skin of a family to activate for a given dark-mode preference. */
export function resolveFamilySkin(family: SkinFamily, preferDark: boolean): SkinDefinition {
  return preferDark ? family.dark : family.light
}

/** Find the family owning a given concrete `ThemeService` skin id, if any. */
export function findFamilyBySkinId(families: readonly SkinFamily[], skinId: string): SkinFamily | undefined {
  return families.find((family) => family.light.id === skinId || family.dark.id === skinId)
}
