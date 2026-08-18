/**
 * Catppuccin — ported from the official `catppuccin/catppuccin` palette
 * specification. Source of the hex values below: the project's own
 * published palette tables for the "Latte" (light) and "Mocha" (dark)
 * flavors (base/surface/text/accent hues), read directly from the upstream
 * palette port porting guide. License: MIT (see THIRD_PARTY_NOTICES.md for
 * the full text).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const CATPPUCCIN_FAMILY: SkinFamily = buildFamily(
  'catppuccin',
  'skins.name.catppuccin',
  // Latte
  {
    bg: '#eff1f5',
    bgRaised: '#e6e9ef',
    bgOverlay: '#dce0e8',
    sidebar: '#e6e9ef',
    border: '#ccd0da',
    text: '#4c4f69',
    textMuted: '#5c5f77',
    textFaint: '#8c8fa1',
    accent: '#1e66f5',
    accentForeground: '#eff1f5',
    danger: '#d20f39',
    success: '#40a02b',
    warning: '#df8e1d',
  },
  // Mocha
  {
    bg: '#1e1e2e',
    bgRaised: '#181825',
    bgOverlay: '#313244',
    sidebar: '#181825',
    border: '#45475a',
    text: '#cdd6f4',
    textMuted: '#bac2de',
    textFaint: '#6c7086',
    accent: '#89b4fa',
    accentForeground: '#1e1e2e',
    danger: '#f38ba8',
    success: '#a6e3a1',
    warning: '#f9e2af',
  },
)
