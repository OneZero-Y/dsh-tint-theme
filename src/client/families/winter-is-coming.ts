/**
 * Winter is Coming — ported from the official `johnpapa/vscode-winteriscoming`
 * theme by John Papa. Source of the hex values below:
 * `themes/WinterIsComing-dark-blue-color-theme.json` and
 * `themes/WinterIsComing-light-color-theme.json`'s own `colors` tables
 * (editor/sidebar/status-bar backgrounds and the blue accent identity),
 * read directly from the upstream files. License: MIT (verified by reading
 * the upstream LICENSE.md file in full; see THIRD_PARTY_NOTICES.md).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const WINTER_IS_COMING_FAMILY: SkinFamily = buildFamily(
  'winter-is-coming',
  'skins.name.winter-is-coming',
  // Winter is Coming (light, blue accent)
  {
    bg: '#ffffff',
    bgRaised: '#eeeeee',
    bgOverlay: '#dce9f5',
    sidebar: '#ffffff',
    border: '#219fd5',
    text: '#1857a4',
    textMuted: '#236ebf',
    textFaint: '#5f7e97',
    accent: '#2f86d2',
    accentForeground: '#ffffff',
    danger: '#de3d3b',
    success: '#08916a',
    warning: '#f7ecb5',
  },
  // Winter is Coming (dark, blue accent)
  {
    bg: '#011627',
    bgRaised: '#0b253a',
    bgOverlay: '#0e2c45',
    sidebar: '#011627',
    border: '#219fd5',
    text: '#d6deeb',
    textMuted: '#a7dbf7',
    textFaint: '#5f7e97',
    accent: '#219fd5',
    accentForeground: '#011627',
    danger: '#ef5350',
    success: '#addb67',
    warning: '#f7ecb5',
  },
)
