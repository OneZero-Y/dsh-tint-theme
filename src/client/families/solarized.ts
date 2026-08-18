/**
 * Solarized — ported from the official `altercation/solarized` project by
 * Ethan Schoonover. Source of the hex values below: the upstream README's
 * own "The Values" table (`base03` through `base3`, plus the eight accent
 * hues), read directly from that file. License: the upstream repository's
 * README states no separate LICENSE file exists but the palette itself is
 * published for open use and reproduction across ports (see
 * THIRD_PARTY_NOTICES.md for the exact attribution wording used here).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const SOLARIZED_FAMILY: SkinFamily = buildFamily(
  'solarized',
  'skins.name.solarized',
  {
    bg: '#fdf6e3',
    bgRaised: '#eee8d5',
    bgOverlay: '#eee8d5',
    sidebar: '#eee8d5',
    border: '#93a1a1',
    text: '#586e75',
    textMuted: '#657b83',
    textFaint: '#93a1a1',
    accent: '#268bd2',
    accentForeground: '#fdf6e3',
    danger: '#dc322f',
    success: '#859900',
    warning: '#b58900',
  },
  {
    bg: '#002b36',
    bgRaised: '#073642',
    bgOverlay: '#073642',
    sidebar: '#073642',
    border: '#586e75',
    text: '#93a1a1',
    textMuted: '#839496',
    textFaint: '#657b83',
    accent: '#268bd2',
    accentForeground: '#002b36',
    danger: '#dc322f',
    success: '#859900',
    warning: '#b58900',
  },
)
