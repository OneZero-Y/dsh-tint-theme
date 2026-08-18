/**
 * Flexoki — ported from the official `kepano/flexoki` palette by Steph
 * Ango. Source of the hex values below: `css/flexoki.css`'s own
 * `--flexoki-*` custom-property scale (black/paper neutrals plus the
 * red/orange/yellow/green/cyan/blue/purple/magenta ramps), read directly
 * from the upstream file. License: MIT (verified by reading the upstream
 * LICENSE file in full; see THIRD_PARTY_NOTICES.md).
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const FLEXOKI_FAMILY: SkinFamily = buildFamily(
  'flexoki',
  'skins.name.flexoki',
  // Flexoki Light ("paper")
  {
    bg: '#fffcf0',
    bgRaised: '#f2f0e5',
    bgOverlay: '#e6e4d9',
    sidebar: '#f2f0e5',
    border: '#cecdc3',
    text: '#100f0f',
    textMuted: '#575653',
    textFaint: '#878580',
    accent: '#205ea6',
    accentForeground: '#fffcf0',
    danger: '#af3029',
    success: '#66800b',
    warning: '#ad8301',
  },
  // Flexoki Dark ("black")
  {
    bg: '#100f0f',
    bgRaised: '#1c1b1a',
    bgOverlay: '#282726',
    sidebar: '#1c1b1a',
    border: '#403e3c',
    text: '#cecdc3',
    textMuted: '#b7b5ac',
    textFaint: '#878580',
    accent: '#4385be',
    accentForeground: '#100f0f',
    danger: '#d14d41',
    success: '#879a39',
    warning: '#d0a215',
  },
)
