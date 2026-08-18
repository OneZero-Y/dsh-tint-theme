/**
 * Material Palenight — ported from the official `material-theme` project's
 * (`material-theme.site`, published by the Material Theme team) Palenight
 * variant. Source of the hex values below: the theme's own published
 * "Palenight" palette table (editor background/foreground and accent
 * hues), read directly from the upstream documentation. License: MIT (see
 * THIRD_PARTY_NOTICES.md for the full text).
 *
 * The Material Theme family ships several dark variants but no light
 * companion for Palenight specifically. The light companion below is this
 * package's own design (not a port), keeping the signature indigo/purple
 * accent identity while inverting the lightness relationships onto a warm
 * off-white surface.
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const MATERIAL_PALENIGHT_FAMILY: SkinFamily = buildFamily(
  'material-palenight',
  'skins.name.material-palenight',
  // Original light companion (own design — see file-level note above).
  {
    bg: '#f5f5f7',
    bgRaised: '#eaeaef',
    bgOverlay: '#dcdce3',
    sidebar: '#eaeaef',
    border: '#c7c7d4',
    text: '#232634',
    textMuted: '#43485a',
    textFaint: '#6b7089',
    accent: '#6673dd',
    accentForeground: '#f5f5f7',
    danger: '#d0483e',
    success: '#3e8a48',
    warning: '#a3720a',
  },
  // Official Material Palenight dark palette.
  {
    bg: '#292d3e',
    bgRaised: '#32374d',
    bgOverlay: '#3a3f58',
    sidebar: '#242837',
    border: '#3a3f58',
    text: '#a6accd',
    textMuted: '#959dcb',
    textFaint: '#676e95',
    accent: '#c792ea',
    accentForeground: '#292d3e',
    danger: '#f07178',
    success: '#c3e88d',
    warning: '#ffcb6b',
  },
)
