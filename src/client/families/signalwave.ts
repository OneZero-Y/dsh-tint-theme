/**
 * Signalwave — an original palette, not a port of any commercial product.
 * Designed for this plugin; inspired by the general visual register of
 * dark, low-contrast, single-accent developer/AI-tool interfaces common
 * in 2024–2025 terminal and IDE products, but does not copy or reference
 * any specific product's published or reverse-engineered color values.
 * Deep violet-black neutrals with a magenta accent — deliberately kept
 * low-saturation and free of retro CRT/scanline/glitch-art motifs, so it
 * does not read as a reference to the unrelated "signalwave" music/visual
 * aesthetic of the same name.
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const SIGNALWAVE_FAMILY: SkinFamily = buildFamily(
  'signalwave',
  'skins.name.signalwave',
  {
    bg: '#f7f4f8',
    bgRaised: '#ece6f0',
    bgOverlay: '#ded5e6',
    sidebar: '#ece6f0',
    border: '#c9bdd4',
    text: '#2a2233',
    textMuted: '#5c4f6b',
    textFaint: '#8b7d99',
    accent: '#9c2d6e',
    accentForeground: '#f7f4f8',
    danger: '#af3a3a',
    success: '#3d7a52',
    warning: '#a3721a',
  },
  {
    bg: '#18131e',
    bgRaised: '#201a28',
    bgOverlay: '#2b2334',
    sidebar: '#140f19',
    border: '#3a3145',
    text: '#e7e0ee',
    textMuted: '#b3a4c2',
    textFaint: '#786986',
    accent: '#e0629f',
    accentForeground: '#18131e',
    danger: '#e2726c',
    success: '#8ccb9b',
    warning: '#e0b96a',
  },
)
