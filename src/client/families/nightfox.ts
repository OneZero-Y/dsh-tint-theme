/**
 * Nightfox / Dayfox — ported from the official `EdenEast/nightfox.nvim`
 * colorscheme collection. Source of the hex values below:
 * `lua/nightfox/palette/nightfox.lua` (the collection's flagship dark
 * variant) and `lua/nightfox/palette/dayfox.lua` (its light counterpart)
 * own `palette`/`bg*`/`fg*` tables, read directly from the upstream files.
 * License: MIT (verified by reading the upstream LICENSE file in full; see
 * THIRD_PARTY_NOTICES.md).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const NIGHTFOX_FAMILY: SkinFamily = buildFamily(
  'nightfox',
  'skins.name.nightfox',
  // Dayfox
  {
    bg: '#f6f2ee',
    bgRaised: '#e4dcd4',
    bgOverlay: '#dbd1dd',
    sidebar: '#e4dcd4',
    border: '#aab0ad',
    text: '#3d2b5a',
    textMuted: '#643f61',
    textFaint: '#824d5b',
    accent: '#2848a9',
    accentForeground: '#f6f2ee',
    danger: '#a5222f',
    success: '#396847',
    warning: '#ac5402',
  },
  // Nightfox
  {
    bg: '#192330',
    bgRaised: '#131a24',
    bgOverlay: '#212e3f',
    sidebar: '#131a24',
    border: '#39506d',
    text: '#cdcecf',
    textMuted: '#aeafb0',
    textFaint: '#71839b',
    accent: '#719cd6',
    accentForeground: '#192330',
    danger: '#c94f6d',
    success: '#81b29a',
    warning: '#dbc074',
  },
)
