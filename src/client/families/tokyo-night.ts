/**
 * Tokyo Night — ported from the official `enkia/tokyo-night-vscode-theme`.
 * Source of the hex values below: `themes/tokyo-night-color-theme.json`
 * (dark) and `themes/tokyo-night-light-color-theme.json`'s own `colors`
 * tables, read directly from the upstream files. License: MIT (verified by
 * reading the upstream LICENSE file in full; see THIRD_PARTY_NOTICES.md).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const TOKYO_NIGHT_FAMILY: SkinFamily = buildFamily(
  'tokyo-night',
  'skins.name.tokyo-night',
  // Tokyo Night Light
  {
    bg: '#d5d6db',
    bgRaised: '#cbccd1',
    bgOverlay: '#a8aecb',
    sidebar: '#cbccd1',
    border: '#a8aecb',
    text: '#343b58',
    textMuted: '#565a6e',
    textFaint: '#9699a3',
    accent: '#34548a',
    accentForeground: '#d5d6db',
    danger: '#8c4351',
    success: '#485e30',
    warning: '#8f5e15',
  },
  // Tokyo Night (dark)
  {
    bg: '#1a1b26',
    bgRaised: '#16161e',
    bgOverlay: '#292e42',
    sidebar: '#16161e',
    border: '#292e42',
    text: '#a9b1d6',
    textMuted: '#787c99',
    textFaint: '#565f89',
    accent: '#7aa2f7',
    accentForeground: '#1a1b26',
    danger: '#f7768e',
    success: '#9ece6a',
    warning: '#e0af68',
  },
)
