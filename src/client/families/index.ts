/**
 * The complete catalog of skin families this plugin ships. Add a new family
 * here after writing its module in this directory (see gruvbox.ts for the
 * documentation pattern every family file follows: cite the exact upstream
 * source file, commit/branch, and license).
 */
import { AFTERTYPE_FAMILY } from './aftertype.ts'
import { AYU_FAMILY } from './ayu.ts'
import { CATPPUCCIN_FAMILY } from './catppuccin.ts'
import { COBALT2_FAMILY } from './cobalt2.ts'
import { DRACULA_FAMILY } from './dracula.ts'
import { EVERFOREST_FAMILY } from './everforest.ts'
import { FLEXOKI_FAMILY } from './flexoki.ts'
import { GRUVBOX_FAMILY } from './gruvbox.ts'
import { HORIZON_FAMILY } from './horizon.ts'
import { ICEBERG_FAMILY } from './iceberg.ts'
import { KANAGAWA_FAMILY } from './kanagawa.ts'
import { MATERIAL_PALENIGHT_FAMILY } from './material-palenight.ts'
import { MELANGE_FAMILY } from './melange.ts'
import { NIGHTFOX_FAMILY } from './nightfox.ts'
import { NIGHT_OWL_FAMILY } from './night-owl.ts'
import { NOCTIS_FAMILY } from './noctis.ts'
import { NORD_FAMILY } from './nord.ts'
import { ONE_DARK_FAMILY } from './one-dark.ts'
import { QUIETLOOP_FAMILY } from './quietloop.ts'
import { ROSE_PINE_FAMILY } from './rose-pine.ts'
import { SIGNALWAVE_FAMILY } from './signalwave.ts'
import { SOLARIZED_FAMILY } from './solarized.ts'
import { TOKYO_NIGHT_FAMILY } from './tokyo-night.ts'
import { TOMORROW_FAMILY } from './tomorrow.ts'
import { WINTER_IS_COMING_FAMILY } from './winter-is-coming.ts'
import type { SkinFamily } from '../skins.ts'

export const SKIN_FAMILIES: readonly SkinFamily[] = [
  GRUVBOX_FAMILY,
  SOLARIZED_FAMILY,
  DRACULA_FAMILY,
  ONE_DARK_FAMILY,
  NIGHT_OWL_FAMILY,
  NORD_FAMILY,
  COBALT2_FAMILY,
  MATERIAL_PALENIGHT_FAMILY,
  CATPPUCCIN_FAMILY,
  TOKYO_NIGHT_FAMILY,
  ROSE_PINE_FAMILY,
  EVERFOREST_FAMILY,
  KANAGAWA_FAMILY,
  MELANGE_FAMILY,
  AYU_FAMILY,
  ICEBERG_FAMILY,
  HORIZON_FAMILY,
  NIGHTFOX_FAMILY,
  FLEXOKI_FAMILY,
  WINTER_IS_COMING_FAMILY,
  NOCTIS_FAMILY,
  TOMORROW_FAMILY,
  AFTERTYPE_FAMILY,
  SIGNALWAVE_FAMILY,
  QUIETLOOP_FAMILY,
]
