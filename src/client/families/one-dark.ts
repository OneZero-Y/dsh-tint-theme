/**
 * One Dark / One Light — ported from Atom's official built-in syntax themes
 * `atom/one-dark-ui`-adjacent `one-dark-syntax`/`one-light-syntax` packages
 * (the pair Atom shipped as its own default light/dark editor themes).
 * Source of the hex values below: each package's `styles/colors.less`
 * variable table (`$mono-1`..`$mono-3`, `$hue-1`..`$hue-6`), read directly
 * from the upstream files. License: MIT (Atom/GitHub's own license for both
 * packages; see THIRD_PARTY_NOTICES.md for the full text).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const ONE_DARK_FAMILY: SkinFamily = buildFamily(
  'one-dark',
  'skins.name.one-dark',
  // one-light-syntax
  {
    bg: '#fafafa',
    bgRaised: '#f0f0f1',
    bgOverlay: '#e5e5e6',
    sidebar: '#f0f0f1',
    border: '#d3d3d4',
    text: '#383a42',
    textMuted: '#696c77',
    textFaint: '#a0a1a7',
    accent: '#4078f2',
    accentForeground: '#fafafa',
    danger: '#e45649',
    success: '#50a14f',
    warning: '#c18401',
  },
  // one-dark-syntax
  {
    bg: '#282c34',
    bgRaised: '#2c313a',
    bgOverlay: '#3a3f4b',
    sidebar: '#21252b',
    border: '#3a3f4b',
    text: '#abb2bf',
    textMuted: '#9da5b4',
    textFaint: '#5c6370',
    accent: '#61afef',
    accentForeground: '#282c34',
    danger: '#e06c75',
    success: '#98c379',
    warning: '#e5c07b',
  },
)
