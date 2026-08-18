/**
 * Kanagawa — ported from the official `rebelot/kanagawa.nvim` colorscheme.
 * Source of the hex values below: `lua/kanagawa/colors.lua`'s own palette
 * table ("Wave"/dark and "Lotus"/light variants), read directly from the
 * upstream file. License: MIT (verified by reading the upstream LICENSE
 * file in full; see THIRD_PARTY_NOTICES.md for the full text).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const KANAGAWA_FAMILY: SkinFamily = buildFamily(
  'kanagawa',
  'skins.name.kanagawa',
  // Lotus (light)
  {
    bg: '#f2ecbc',
    bgRaised: '#e7dba0',
    bgOverlay: '#d3c6a5',
    sidebar: '#e7dba0',
    border: '#c9cbd1',
    text: '#545464',
    textMuted: '#716e61',
    textFaint: '#8a8980',
    accent: '#4d699b',
    accentForeground: '#f2ecbc',
    danger: '#c84053',
    success: '#6f894e',
    warning: '#77713f',
  },
  // Wave (dark)
  {
    bg: '#1f1f28',
    bgRaised: '#2a2a37',
    bgOverlay: '#363646',
    sidebar: '#16161d',
    border: '#54546d',
    text: '#dcd7ba',
    textMuted: '#c8c093',
    textFaint: '#727169',
    accent: '#7e9cd8',
    accentForeground: '#1f1f28',
    danger: '#e82424',
    success: '#98bb6c',
    warning: '#e6c384',
  },
)
