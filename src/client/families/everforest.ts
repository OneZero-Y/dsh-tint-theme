/**
 * Everforest — ported from the official `sainnhe/everforest` Vim
 * colorscheme. Source of the hex values below: the project's own published
 * palette table ("Medium" contrast, both light and dark backgrounds, bg0-8
 * and the red/orange/yellow/green/aqua/blue/purple accent hues), read
 * directly from the upstream palette documentation. License: MIT (see
 * THIRD_PARTY_NOTICES.md for the full text).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const EVERFOREST_FAMILY: SkinFamily = buildFamily(
  'everforest',
  'skins.name.everforest',
  // Everforest Light, medium contrast
  {
    bg: '#fdf6e3',
    bgRaised: '#f4f0d9',
    bgOverlay: '#efebd4',
    sidebar: '#f4f0d9',
    border: '#e0dcc7',
    text: '#5c6a72',
    textMuted: '#829181',
    textFaint: '#a6b0a0',
    accent: '#3a94c5',
    accentForeground: '#fdf6e3',
    danger: '#f85552',
    success: '#8da101',
    warning: '#dfa000',
  },
  // Everforest Dark, medium contrast
  {
    bg: '#2d353b',
    bgRaised: '#343f44',
    bgOverlay: '#3d484d',
    sidebar: '#2d353b',
    border: '#4f585e',
    text: '#d3c6aa',
    textMuted: '#9da9a0',
    textFaint: '#859289',
    accent: '#7fbbb3',
    accentForeground: '#2d353b',
    danger: '#e67e80',
    success: '#a7c080',
    warning: '#dbbc7f',
  },
)
