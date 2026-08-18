/**
 * Melange — ported from the official `savq/melange-nvim` colorscheme by
 * Sergio Alejandro Vargas. Source of the hex values below: the project's
 * own `melange_light.json`/`melange_dark.json` terminal palette exports
 * (bg/fg/black through yellow, both "bright" and "dark" variants), read
 * directly from the upstream files. License: MIT (verified by reading the
 * upstream LICENSE file in full; see THIRD_PARTY_NOTICES.md).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const MELANGE_FAMILY: SkinFamily = buildFamily(
  'melange',
  'skins.name.melange',
  // melange_light.json
  {
    bg: '#f1f1f1',
    bgRaised: '#e9e1db',
    bgOverlay: '#d9d3ce',
    sidebar: '#e9e1db',
    border: '#d9d3ce',
    text: '#54433a',
    textMuted: '#7d6658',
    textFaint: '#a98a78',
    accent: '#465aa4',
    accentForeground: '#f1f1f1',
    danger: '#bf0021',
    success: '#3a684a',
    warning: '#a06d00',
  },
  // melange_dark.json
  {
    bg: '#292522',
    bgRaised: '#34302c',
    bgOverlay: '#403a36',
    sidebar: '#292522',
    border: '#403a36',
    text: '#ece1d7',
    textMuted: '#c1a78e',
    textFaint: '#867462',
    accent: '#a3a9ce',
    accentForeground: '#292522',
    danger: '#d47766',
    success: '#85b695',
    warning: '#ebc06d',
  },
)
