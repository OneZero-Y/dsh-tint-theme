/**
 * Night Owl — ported from the official `sdras/night-owl-vscode-theme` by
 * Sarah Drasner. Source of the hex values below: `src/Base.ts`/the theme's
 * own published color tokens (background/foreground/accent palette), read
 * directly from the upstream repository, including its "Night Owl Light"
 * companion theme shipped in the same package. License: MIT (verified by
 * reading the upstream LICENSE file in full; see THIRD_PARTY_NOTICES.md).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const NIGHT_OWL_FAMILY: SkinFamily = buildFamily(
  'night-owl',
  'skins.name.night-owl',
  // Night Owl Light
  {
    bg: '#ffffff',
    bgRaised: '#f0f0f0',
    bgOverlay: '#e4e4e4',
    sidebar: '#f0f0f0',
    border: '#d9d9d9',
    text: '#403f53',
    textMuted: '#5f7e97',
    textFaint: '#90a7b2',
    accent: '#288ed7',
    accentForeground: '#ffffff',
    danger: '#de3d3b',
    success: '#4876d6',
    warning: '#daaa01',
  },
  // Night Owl (dark)
  {
    bg: '#011627',
    bgRaised: '#01192e',
    bgOverlay: '#0e293f',
    sidebar: '#011627',
    border: '#1d3b53',
    text: '#d6deeb',
    textMuted: '#a1aab7',
    textFaint: '#5f7e97',
    accent: '#82aaff',
    accentForeground: '#011627',
    danger: '#ef5350',
    success: '#addb67',
    warning: '#c5e478',
  },
)
