/**
 * Dracula — ported from the official `dracula/visual-studio-code` theme.
 * Source of the hex values below: `src/dracula.yml` in that repository (the
 * `COLOR0`-`COLOR15` ANSI palette plus `BG`/`FG`/`BGLight`/`BGDark` UI
 * variants), read directly from the upstream file. License: MIT (see
 * THIRD_PARTY_NOTICES.md for the full text).
 *
 * Dracula has no official light companion — the upstream project's own
 * README states plainly "Dracula can't stand the light." The light variant
 * below is this package's own design (not a port, not borrowed from any
 * third-party "Alucard"-style community fork), built by inverting the same
 * lightness relationships Dracula's own dark palette uses, while keeping
 * every accent hue identical to the official dark palette so the family
 * reads as one consistent color identity across the light/dark switch.
 */
import { buildFamily } from '../token-map.ts'
import type { SkinFamily } from '../skins.ts'

export const DRACULA_FAMILY: SkinFamily = buildFamily(
  'dracula',
  'skins.name.dracula',
  // Original light companion (own design — see file-level note above).
  {
    bg: '#f8f8f2',
    bgRaised: '#ebebe3',
    bgOverlay: '#dedcd3',
    sidebar: '#ebebe3',
    border: '#c9c6ba',
    text: '#282a36',
    textMuted: '#44475a',
    textFaint: '#6272a4',
    accent: '#8551d9',
    accentForeground: '#f8f8f2',
    danger: '#c0392b',
    success: '#4b7a1f',
    warning: '#a3720a',
  },
  // Official dark palette, ported from src/dracula.yml.
  {
    bg: '#282a36',
    bgRaised: '#343746',
    bgOverlay: '#424450',
    sidebar: '#21222c',
    border: '#6272a4',
    text: '#f8f8f2',
    textMuted: '#e2e2dc',
    textFaint: '#6272a4',
    accent: '#bd93f9',
    accentForeground: '#282a36',
    danger: '#ff5555',
    success: '#50fa7b',
    warning: '#f1fa8c',
  },
)
