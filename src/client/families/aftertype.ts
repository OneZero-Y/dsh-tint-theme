/**
 * Aftertype — an original palette, not a port of any commercial product.
 * Designed for this plugin; inspired by the general visual register of
 * dark, low-contrast, single-accent developer/AI-tool interfaces common
 * in 2024–2025 terminal and IDE products, but does not copy or reference
 * any specific product's published or reverse-engineered color values.
 * Cool grey-blue neutrals with a restrained cyan accent, aiming for a
 * quiet, low-glare feel suited to long reading sessions.
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const AFTERTYPE_FAMILY: SkinFamily = buildFamily(
  'aftertype',
  'skins.name.aftertype',
  {
    bg: '#f4f6f8',
    bgRaised: '#e8ecf0',
    bgOverlay: '#dde3e9',
    sidebar: '#e8ecf0',
    border: '#c7d0d9',
    text: '#232a32',
    textMuted: '#4d5a66',
    textFaint: '#7c8994',
    accent: '#0d7377',
    accentForeground: '#f4f6f8',
    danger: '#b3372c',
    success: '#3a7d44',
    warning: '#a06a12',
  },
  {
    bg: '#161b21',
    bgRaised: '#1d232b',
    bgOverlay: '#262d37',
    sidebar: '#12161b',
    border: '#333c47',
    text: '#dbe3ea',
    textMuted: '#a3aebb',
    textFaint: '#6c7684',
    accent: '#5fc2c6',
    accentForeground: '#161b21',
    danger: '#e0645a',
    success: '#7fc98a',
    warning: '#e0b45f',
  },
)
