/**
 * Resolves a family choice to a concrete light/dark skin id, following the
 * browser's `prefers-color-scheme` media query, and keeps the active theme
 * in sync when the system preference flips while a family from this plugin
 * is active. This module owns no state of its own beyond the media-query
 * listener; the caller supplies every write/read operation.
 */
import { resolveFamilySkin } from './skins.ts'
import type { SkinFamily } from './skins.ts'

/** Minimal MediaQueryList surface this module depends on (keeps it testable without a real browser). */
export interface ColorSchemeMedia {
  readonly matches: boolean
  addEventListener?: (type: 'change', listener: () => void) => void
  removeEventListener?: (type: 'change', listener: () => void) => void
}

export interface AdaptiveResolverOptions {
  media: ColorSchemeMedia
  /** Read the ThemeService's current active-theme preference id. */
  getActiveId: () => string
  /** Write a new active theme id into the ThemeService. */
  setActiveId: (id: string) => void
  /** Resolve a family by its stable id. */
  findFamily: (id: string) => SkinFamily | undefined
  /** Resolve the family owning a concrete `ThemeService` skin id, if any. */
  findFamilyBySkinId: (skinId: string) => SkinFamily | undefined
}

export interface AdaptiveResolver {
  /** Activate a family, resolving to its light or dark skin per the current system preference. */
  selectFamily: (familyId: string) => void
  /** Stop listening for system color-scheme changes. */
  dispose: () => void
}

/**
 * Create the resolver and start listening for system color-scheme changes.
 * @param options - media query and ThemeService read/write operations.
 * @returns the resolver handle.
 */
export function createAdaptiveResolver(options: AdaptiveResolverOptions): AdaptiveResolver {
  const resync = (): void => {
    const activeFamily = options.findFamilyBySkinId(options.getActiveId())
    if (activeFamily === undefined) return
    const next = resolveFamilySkin(activeFamily, options.media.matches)
    if (next.id !== options.getActiveId()) options.setActiveId(next.id)
  }

  options.media.addEventListener?.('change', resync)

  return {
    selectFamily: (familyId) => {
      const family = options.findFamily(familyId)
      if (family === undefined) return
      options.setActiveId(resolveFamilySkin(family, options.media.matches).id)
    },
    dispose: () => {
      options.media.removeEventListener?.('change', resync)
    },
  }
}
