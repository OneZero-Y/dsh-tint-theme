/**
 * Quietloop — an original palette, not a port of any commercial product.
 * Designed for this plugin; inspired by the general visual register of
 * clean, low-contrast light interfaces common in writing and review
 * tools, but does not copy or reference any specific product's published
 * or reverse-engineered color values. Unlike this plugin's other families
 * (where the light skin is the secondary companion to a dark original),
 * Quietloop is designed light-first: warm off-white neutrals with a deep
 * green accent, and a dark skin built as its companion.
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const QUIETLOOP_FAMILY: SkinFamily = buildFamily(
  'quietloop',
  'skins.name.quietloop',
  {
    bg: '#faf8f3',
    bgRaised: '#f1eee5',
    bgOverlay: '#e6e1d4',
    sidebar: '#f1eee5',
    border: '#d6d0c0',
    text: '#2c2a22',
    textMuted: '#5a5646',
    textFaint: '#8a8570',
    accent: '#2f6b4f',
    accentForeground: '#faf8f3',
    danger: '#a8402f',
    success: '#2f6b4f',
    warning: '#a17a1c',
  },
  {
    bg: '#1c1b16',
    bgRaised: '#242219',
    bgOverlay: '#2f2c1f',
    sidebar: '#17160f',
    border: '#3d3a2a',
    text: '#e8e4d6',
    textMuted: '#b3ac95',
    textFaint: '#7d7862',
    accent: '#6fbf94',
    accentForeground: '#1c1b16',
    danger: '#e0836f',
    success: '#6fbf94',
    warning: '#e0c06f',
  },
)
