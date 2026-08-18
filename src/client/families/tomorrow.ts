/**
 * Tomorrow — ported from the official `chriskempson/tomorrow-theme` by
 * Chris Kempson (the original theme collection, later adapted for dozens of
 * editors). Source of the hex values below: `vim/colors/Tomorrow.vim`
 * (light) and `vim/colors/Tomorrow-Night.vim` (dark) own `s:foreground`/
 * `s:background`/`s:red`..`s:purple` variable table, read directly from the
 * upstream files. License: MIT (verified by reading the upstream
 * LICENSE.md file in full; see THIRD_PARTY_NOTICES.md).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const TOMORROW_FAMILY: SkinFamily = buildFamily(
  'tomorrow',
  'skins.name.tomorrow',
  // Tomorrow
  {
    bg: '#ffffff',
    bgRaised: '#efefef',
    bgOverlay: '#d6d6d6',
    sidebar: '#efefef',
    border: '#d6d6d6',
    text: '#4d4d4c',
    textMuted: '#8e908c',
    textFaint: '#8e908c',
    accent: '#4271ae',
    accentForeground: '#ffffff',
    danger: '#c82829',
    success: '#718c00',
    warning: '#eab700',
  },
  // Tomorrow Night
  {
    bg: '#1d1f21',
    bgRaised: '#282a2e',
    bgOverlay: '#373b41',
    sidebar: '#282a2e',
    border: '#373b41',
    text: '#c5c8c6',
    textMuted: '#969896',
    textFaint: '#969896',
    accent: '#81a2be',
    accentForeground: '#1d1f21',
    danger: '#cc6666',
    success: '#b5bd68',
    warning: '#f0c674',
  },
)
