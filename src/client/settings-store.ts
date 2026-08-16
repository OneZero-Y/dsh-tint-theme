/**
 * Tint-theme row slot store: a mirror of this plugin's own settings-scope
 * snapshot (see settings-namespace.ts) — not of a shared service snapshot,
 * since this plugin owns its whole settings section itself. The plugin's
 * apply-world subscription to the settings scope is the only writer; the
 * row component reads via props.useStore. Structurally the same store shape
 * as the installed `dsh-client-ui-theme`/`dsh-client-locale` packages' own
 * `createAppearanceRowStore`/`createLanguageRowStore` (their compiled
 * `client.js` — the mirror-plus-monotonic-revision pattern is the shared
 * mechanism every settings-row store in this ecosystem follows, not
 * something copied from a third-party plugin).
 */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-runtime/client'

/** Store state mirrored from this plugin's settings-scope snapshot. */
export interface TintRowState {
  /** Selected registered theme id, or `undefined` while this plugin's palette control is off. */
  themeId: string | undefined
  /** Selected {@link import('./accents.ts').ACCENT_SWATCHES} id, or `undefined` for no tint. */
  accent: string | undefined
  /** Settings-scope revision; -1 until first sync so revision 0 lands as a change. */
  revision: number
}

/** Declared action shape giving the exported factory a stable return type. */
type TintRowActions = {
  sync: (draft: TintRowState, themeId: string | undefined, accent: string | undefined, revision: number) => void
}

/**
 * Declares the tint-theme row state and write surface.
 * @returns the store handle.
 */
export function createTintRowStore(): EngineStoreHandle<TintRowState, TintRowActions> {
  return defineStore({
    init: () => ({ themeId: undefined, accent: undefined, revision: -1 }),
    actions: {
      sync: (d, themeId, accent, revision) => {
        if (revision <= d.revision) return
        d.themeId = themeId
        d.accent = accent
        d.revision = revision
      },
    },
  })
}
