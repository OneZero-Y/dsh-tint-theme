/**
 * Cobalt2 — ported from the official `wesbos/cobalt2-vscode` theme by Wes
 * Bos. Source of the hex values below: `themes/cobalt2.json`'s own
 * `colors`/`tokenColors` tables, read directly from the upstream file.
 * License: MIT (verified by reading the upstream LICENSE file in full; see
 * THIRD_PARTY_NOTICES.md).
 *
 * Cobalt2 ships dark-only. The light companion below is this package's own
 * design (not a port), built by inverting the same lightness relationships
 * while keeping the signature cobalt blue background swapped for a warm
 * off-white and preserving the orange/yellow accent identity.
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const COBALT2_FAMILY: SkinFamily = buildFamily(
  'cobalt2',
  'skins.name.cobalt2',
  // Original light companion (own design — see file-level note above).
  {
    bg: '#f6f4ed',
    bgRaised: '#ece8db',
    bgOverlay: '#dfd9c6',
    sidebar: '#ece8db',
    border: '#cabf9f',
    text: '#193549',
    textMuted: '#33587a',
    textFaint: '#5d7a94',
    accent: '#0050a4',
    accentForeground: '#f6f4ed',
    danger: '#c34e00',
    success: '#3d7a1e',
    warning: '#a3720a',
  },
  // Official Cobalt2 dark palette.
  {
    bg: '#193549',
    bgRaised: '#122738',
    bgOverlay: '#15232d',
    sidebar: '#15232d',
    border: '#1f4662',
    text: '#ffffff',
    textMuted: '#e1efff',
    textFaint: '#0088ff',
    accent: '#ffc600',
    accentForeground: '#193549',
    danger: '#ff628c',
    success: '#3ad900',
    warning: '#ffc600',
  },
)
