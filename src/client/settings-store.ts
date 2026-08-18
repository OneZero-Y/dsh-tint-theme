/**
 * Skin row slot store: a projection of the OFFICIAL `ThemeService`'s own
 * active-theme state onto the family the picker should show as selected.
 *
 * The picker's SELECTED TILE is driven from `ThemeService`'s own live state
 * (`ctx.theme`, read here and kept in sync by the caller's `theme/change`
 * listener), not from this plugin's own settings namespace — the tile must
 * reflect whichever theme id is actually active, including one set by
 * another plugin or the built-in Appearance row, and the theme service is
 * the only channel that state is authoritatively published on. Durable
 * cross-reload persistence of the user's CHOICE is a separate concern,
 * handled by this plugin's own settings namespace scope (bound in
 * src/client/index.ts) — restoring that choice on boot still goes through
 * `ctx.theme.setTheme`, so it still ends up reflected here through the same
 * `theme/change` sync path.
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client'

/** Store state mirrored from the theme service's own active-theme snapshot. */
export interface SkinRowState {
  /** Selected family id, or `undefined` while the active theme is a builtin (not one of this plugin's skins). */
  familyId: string | undefined
  /** Theme-service revision; -1 until first sync so revision 0 lands as a change. */
  revision: number
}

/** Declared action shape giving the exported factory a stable return type. */
type SkinRowActions = {
  sync: (draft: SkinRowState, familyId: string | undefined, revision: number) => void
}

/**
 * Declares the skin row state and write surface.
 * @returns the store handle.
 */
export function createSkinRowStore(): EngineStoreHandle<SkinRowState, SkinRowActions> {
  return defineStore({
    init: () => ({ familyId: undefined, revision: -1 }),
    actions: {
      sync: (d, familyId, revision) => {
        if (revision <= d.revision) return
        d.familyId = familyId
        d.revision = revision
      },
    },
  })
}
