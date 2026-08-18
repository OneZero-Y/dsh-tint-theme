/**
 * Iceberg — ported from the official `cocopon/iceberg.vim` colorscheme.
 * Source of the hex values below: `colors/iceberg.vim`'s own `&background
 * == 'light'`/dark `hi Normal`/`hi Constant`/etc. `gui*` values and the
 * `terminal_color_*` ANSI table, read directly from the upstream file.
 * License: MIT (verified by reading the upstream LICENSE.txt file in full;
 * see THIRD_PARTY_NOTICES.md).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const ICEBERG_FAMILY: SkinFamily = buildFamily(
  'iceberg',
  'skins.name.iceberg',
  // &background == 'light'
  {
    bg: '#e8e9ec',
    bgRaised: '#dcdfe7',
    bgOverlay: '#cad0de',
    sidebar: '#dcdfe7',
    border: '#cad0de',
    text: '#33374c',
    textMuted: '#8389a3',
    textFaint: '#9fa7bd',
    accent: '#2d539e',
    accentForeground: '#e8e9ec',
    danger: '#cc517a',
    success: '#668e3d',
    warning: '#c57339',
  },
  // &background == 'dark'
  {
    bg: '#161821',
    bgRaised: '#1e2132',
    bgOverlay: '#272c42',
    sidebar: '#1e2132',
    border: '#444b71',
    text: '#c6c8d1',
    textMuted: '#6b7089',
    textFaint: '#444b71',
    accent: '#84a0c6',
    accentForeground: '#161821',
    danger: '#e27878',
    success: '#b4be82',
    warning: '#e2a478',
  },
)
