/**
 * Gruvbox — ported from the official `morhetz/gruvbox` Vim colorscheme.
 * Source of the hex values below: `colors/gruvbox.vim` in that repository
 * (the `s:gb.dark0`/`s:gb.light0` etc. palette table), read directly from
 * the upstream file, at commit `df3d3b7` on the `master` branch. License:
 * MIT/X11 (the upstream README's own "License" section names this exact
 * license; see THIRD_PARTY_NOTICES.md for the full text and attribution).
 * "Medium contrast" variant (gruvbox's own default contrast setting for
 * both dark and light modes).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const GRUVBOX_FAMILY: SkinFamily = buildFamily(
  'gruvbox',
  'skins.name.gruvbox',
  {
    bg: '#fbf1c7',
    bgRaised: '#ebdbb2',
    bgOverlay: '#d5c4a1',
    sidebar: '#ebdbb2',
    border: '#bdae93',
    text: '#3c3836',
    textMuted: '#504945',
    textFaint: '#7c6f64',
    accent: '#af3a03',
    accentForeground: '#fbf1c7',
    danger: '#9d0006',
    success: '#79740e',
    warning: '#b57614',
  },
  {
    bg: '#282828',
    bgRaised: '#3c3836',
    bgOverlay: '#504945',
    sidebar: '#3c3836',
    border: '#665c54',
    text: '#ebdbb2',
    textMuted: '#d5c4a1',
    textFaint: '#a89984',
    accent: '#fe8019',
    accentForeground: '#282828',
    danger: '#fb4934',
    success: '#b8bb26',
    warning: '#fabd2f',
  },
)
