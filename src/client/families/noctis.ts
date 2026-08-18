/**
 * Noctis — ported from the official `liviuschera/noctis` theme collection
 * (11 variants: 8 dark, 3 light). This family uses the collection's two
 * flagship variants: "Noctis" (dark) and "Noctis Lux" (light). Source of
 * the hex values below: `themes/noctis.json` and `themes/lux.json`'s own
 * `colors` tables (`editor.background`/`editor.foreground`,
 * `sideBar.background`, the cyan/teal accent identity), read directly from
 * the upstream files. License: MIT (verified by reading the upstream
 * LICENSE.md file in full; see THIRD_PARTY_NOTICES.md).
 *
 * Not present in ZeroZ-lab/dsh-web-skins' own catalog — this is this
 * package's own addition to the ported-theme roster.
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const NOCTIS_FAMILY: SkinFamily = buildFamily(
  'noctis',
  'skins.name.noctis',
  // Noctis Lux
  {
    bg: '#fef8ec',
    bgRaised: '#f9f1e1',
    bgOverlay: '#f2e7ca',
    sidebar: '#f9f1e1',
    border: '#ece2c6',
    text: '#005661',
    textMuted: '#6a7a7c',
    textFaint: '#87a7ab',
    accent: '#0099ad',
    accentForeground: '#fef8ec',
    danger: '#ff4000',
    success: '#009456',
    warning: '#e9a149',
  },
  // Noctis
  {
    bg: '#052529',
    bgRaised: '#041d20',
    bgOverlay: '#073940',
    sidebar: '#041d20',
    border: '#0e6671',
    text: '#b2cacd',
    textMuted: '#a5b5b5',
    textFaint: '#87a7ab',
    accent: '#40d4e7',
    accentForeground: '#052529',
    danger: '#e34e1c',
    success: '#16b673',
    warning: '#e4b781',
  },
)
