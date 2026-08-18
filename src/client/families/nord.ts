/**
 * Nord — ported from the official nordtheme.com palette (`nord0`-`nord15`),
 * as published in the `arcticicestudio/nord` specification repository.
 * Source of the hex values below: the official palette table (Polar Night
 * nord0-3, Snow Storm nord4-6, Frost nord7-10, Aurora nord11-15), read
 * directly from the upstream spec. License: MIT (see THIRD_PARTY_NOTICES.md
 * for the full text).
 *
 * Nord has no official light variant — the project's palette is designed
 * as a single dark-first system. The light companion below is this
 * package's own design (not a port), built by re-mapping the same Frost/
 * Aurora accent hues (nord7-15) onto the Snow Storm shades (nord4-6) used
 * as light backgrounds, so the family reads as one consistent color
 * identity across the light/dark switch.
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const NORD_FAMILY: SkinFamily = buildFamily(
  'nord',
  'skins.name.nord',
  // Original light companion (own design — see file-level note above).
  {
    bg: '#eceff4',
    bgRaised: '#e5e9f0',
    bgOverlay: '#d8dee9',
    sidebar: '#e5e9f0',
    border: '#c6cede',
    text: '#2e3440',
    textMuted: '#3b4252',
    textFaint: '#4c566a',
    accent: '#5e81ac',
    accentForeground: '#eceff4',
    danger: '#bf616a',
    success: '#a3be8c',
    warning: '#d08770',
  },
  // Official Nord dark palette.
  {
    bg: '#2e3440',
    bgRaised: '#3b4252',
    bgOverlay: '#434c5e',
    sidebar: '#2e3440',
    border: '#4c566a',
    text: '#d8dee9',
    textMuted: '#e5e9f0',
    textFaint: '#4c566a',
    accent: '#88c0d0',
    accentForeground: '#2e3440',
    danger: '#bf616a',
    success: '#a3be8c',
    warning: '#ebcb8b',
  },
)
