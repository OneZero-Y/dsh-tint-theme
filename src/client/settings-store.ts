/**
 * Skin row slot store: a projection of the OFFICIAL `ThemeService`'s own
 * active-theme state onto the family the picker should show as selected.
 *
 * This deliberately does NOT read or write any settings namespace of this
 * plugin's own. Confirmed against the official `deepseek-ai/deepseek-harness`
 * checkout (`packages/host/apiproxy/src/api-proxy.ts`'s `WEB_SETTINGS_NAMESPACES`
 * allowlist, and its own doc comment: "a namespace absent from that list
 * answers `settings-not-exposed` ... even when its owner registered it"): a
 * third-party plugin's own settings namespace can never be exposed to the
 * browser, so a picker driven by that channel can never show a correct
 * selected state. The official `ThemeService`'s own live state (`ctx.theme`,
 * confirmed to be readable and to emit `theme/change`) is the only channel
 * this plugin has real read access to — so selection state is driven from
 * there, not from a settings write-back.
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
