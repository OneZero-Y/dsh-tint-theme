/**
 * Ayu — ported from the official `ayu-theme/ayu-vim` colorscheme (the
 * canonical ayu palette, mirrored across every ayu port). Source of the hex
 * values below: `colors/ayu.vim`'s own `s:palette` table, `dark`/`light`
 * columns, read directly from the upstream file. License: MIT (see
 * THIRD_PARTY_NOTICES.md for the full text).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const AYU_FAMILY: SkinFamily = buildFamily(
  'ayu',
  'skins.name.ayu',
  // Ayu Light
  {
    bg: '#fafafa',
    bgRaised: '#ffffff',
    bgOverlay: '#f0eee4',
    sidebar: '#ffffff',
    border: '#d9d8d7',
    text: '#5c6773',
    textMuted: '#828c99',
    textFaint: '#abb0b6',
    accent: '#ff6a00',
    accentForeground: '#fafafa',
    danger: '#ff3333',
    success: '#86b300',
    warning: '#f29718',
  },
  // Ayu Dark
  {
    bg: '#0f1419',
    bgRaised: '#14191f',
    bgOverlay: '#253340',
    sidebar: '#14191f',
    border: '#2d3640',
    text: '#e6e1cf',
    textMuted: '#e6e1cf',
    textFaint: '#3e4b59',
    accent: '#f29718',
    accentForeground: '#0f1419',
    danger: '#ff3333',
    success: '#b8cc52',
    warning: '#ffb454',
  },
)
