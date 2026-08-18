/**
 * Horizon — ported from the official `jolaleye/horizon-theme-vscode` by
 * Jonathan Olaleye. Source of the hex values below: `src/dark/globals.json`
 * and `src/bright/globals.json`'s own `ui`/`ansi` tables, read directly
 * from the upstream files (the "bright" variant is the theme's own light
 * companion). License: MIT (verified by reading the upstream LICENSE file
 * in full; see THIRD_PARTY_NOTICES.md).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const HORIZON_FAMILY: SkinFamily = buildFamily(
  'horizon',
  'skins.name.horizon',
  // src/bright/globals.json ("Horizon Bright")
  {
    bg: '#fdf0ed',
    bgRaised: '#fadad1',
    bgOverlay: '#f9cbbe',
    sidebar: '#fadad1',
    border: '#f9cec3',
    text: '#06060c',
    textMuted: '#333333',
    textFaint: '#af5427',
    accent: '#e73665',
    accentForeground: '#fdf0ed',
    danger: '#f43e5c',
    success: '#1eb980',
    warning: '#f6661e',
  },
  // src/dark/globals.json ("Horizon")
  {
    bg: '#1c1e26',
    bgRaised: '#232530',
    bgOverlay: '#2e303e',
    sidebar: '#232530',
    border: '#2e303e',
    text: '#d5d8da',
    textMuted: '#6c6f93',
    textFaint: '#6c6f93',
    accent: '#e95378',
    accentForeground: '#1c1e26',
    danger: '#f43e5c',
    success: '#27d797',
    warning: '#fab38e',
  },
)
