import type { ActionsDecl, StoreSpec } from '@deepseek-ai/dsh-client-ui-slots'

/**
 * Minimal in-memory fake of `@deepseek-ai/dsh-client-runtime/client`'s
 * `defineStore`, used only to unblock importing this plugin's client half
 * under vitest's Node environment.
 *
 * The REAL `/client` subpath resolves to a loader-wrapped browser bundle
 * (`window.__ModuleLoader__.load(...)`) that throws `ReferenceError: window
 * is not defined` under plain Node — production never executes it directly
 * either; it's always resolved through the host's frozen module table (see
 * this repo's tsdown.config.ts `CLIENT_EXTERNALS`, which externalizes this
 * exact specifier for the same reason). A test importing this plugin's own
 * client module graph needs a stand-in for this one boundary, not the real
 * package — see tests/client-index.spec.ts and tests/client-behavior.spec.ts,
 * which `vi.mock` this module to this file.
 */
export function defineStore<T, A extends ActionsDecl<T>>(spec: StoreSpec<T, A>) {
  return {
    spec,
    create: () => {
      const state = spec.init()
      const listeners = new Set<() => void>()
      const actions = Object.fromEntries(
        Object.entries(spec.actions).map(([key, mutate]) => [
          key,
          (...params: unknown[]) => {
            ;(mutate as (draft: T, ...p: unknown[]) => void)(state, ...params)
            listeners.forEach((listener) => listener())
          },
        ]),
      ) as Record<string, (...params: unknown[]) => void>
      return {
        getSnapshot: () => state,
        subscribe: (listener: () => void) => {
          listeners.add(listener)
          return () => listeners.delete(listener)
        },
        actions,
        clearPersisted: () => {},
      }
    },
  }
}
