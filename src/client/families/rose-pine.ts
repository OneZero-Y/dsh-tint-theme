/**
 * Rosé Pine — ported from the official `rose-pine/rose-pine-vscode` theme.
 * Source of the hex values below: the project's own published palette
 * tables for "Rosé Pine Dawn" (light) and the base "Rosé Pine" (dark)
 * variants (base/surface/text/love/gold/rose/pine/foam/iris hues), read
 * directly from the upstream palette documentation. License: MIT (see
 * THIRD_PARTY_NOTICES.md for the full text).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const ROSE_PINE_FAMILY: SkinFamily = buildFamily(
  'rose-pine',
  'skins.name.rose-pine',
  // Rosé Pine Dawn
  {
    bg: '#faf4ed',
    bgRaised: '#fffaf3',
    bgOverlay: '#f2e9e1',
    sidebar: '#fffaf3',
    border: '#dfdad9',
    text: '#575279',
    textMuted: '#797593',
    textFaint: '#9893a5',
    accent: '#286983',
    accentForeground: '#faf4ed',
    danger: '#b4637a',
    success: '#56949f',
    warning: '#ea9d34',
  },
  // Rosé Pine (base, dark)
  {
    bg: '#191724',
    bgRaised: '#1f1d2e',
    bgOverlay: '#26233a',
    sidebar: '#1f1d2e',
    border: '#403d52',
    text: '#e0def4',
    textMuted: '#908caa',
    textFaint: '#6e6a86',
    accent: '#9ccfd8',
    accentForeground: '#191724',
    danger: '#eb6f92',
    success: '#31748f',
    warning: '#f6c177',
  },
)
