/**
 * Loader-facing entry point for @onezero-y/dsh-tint-theme.
 *
 * Host-half plugin body. Most real behavior lives in the client half
 * (src/client/index.ts); this host plugin's only job is registering this
 * plugin's own settings namespace — the durable record of which skin family
 * the user picked — and carrying the `dsh.bundle.patch` manifest so
 * `dsh plugin add` has a host-side package to attach the bundle patch to.
 *
 * Persistence history: earlier revisions of this plugin could not persist a
 * selection of their own, because the official `deepseek-ai/deepseek-harness`
 * checkout's `packages/host/apiproxy` gated every third-party settings
 * namespace behind a hardcoded `WEB_SETTINGS_NAMESPACES` allowlist — a
 * namespace outside it answered `settings-not-exposed` regardless of
 * whether this host half registered it. That allowlist (and the error code)
 * was removed in the official repository's
 * `.agents/notes/implemented/architecture/2026-08-12-plugin-owned-settings-surface.md`
 * ("Registering is exposing"): registering a namespace here is now
 * sufficient for the client half's `ctx.settingsScope.bind()` to read and
 * write it. This plugin now requires `@deepseek-ai/dsh-client-ui-theme`
 * `^0.1.0-rc.7` or later (the first published version after that change).
 *
 * This is function-form (named exports, no default export) so this package
 * doesn't become an exception to the rule the whole kit is built around: a
 * default export alongside named `name`/`inject`/`apply` exports makes
 * DSH's real Loader discard the named exports entirely (see "Plugin forms"
 * in the `dsh-plugin-kit` submodule's `docs/plugin-contract-reference.md`).
 * @module @onezero-y/dsh-tint-theme
 */
import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { SkinSettingsSchema } from './skin-settings-schema.ts'
import { SKIN_SETTINGS_NAMESPACE } from './skin-settings.ts'

export { SKIN_SETTINGS_FIELD, SKIN_SETTINGS_NAMESPACE, type SkinSettings } from './skin-settings.ts'

/** Stable Cordis plugin id. Keep this unchanged after the plugin is published. */
export const name = 'dsh-tint-theme'

/**
 * `settings` is optional (`ctx.inject(['settings'], ...)` below): a deployment
 * without a settings provider composed still boots this plugin, it only
 * never gets a durable skin-family record. Concretely: the client half's
 * `bind()` scope picks `host` vs `memory` mode from whether the BROWSER
 * connection is loopback (`ConnectionHandle.isLoopback`), never from whether
 * this namespace is registered — so with no settings provider composed, the
 * scope still queries the Host in `host` mode, finds no `dsh-tint-theme`
 * entry in its `settings.describe()` answer, and its snapshot settles at
 * `unavailable` rather than `ready` (confirmed by reading the installed
 * `SettingsScopeController.read()`'s own "namespace not found" branch).
 * Either way the practical effect is identical to the official ui-theme
 * plugin's own optional-settings posture: no durable record, no crash.
 */
export const inject: string[] = []

/**
 * Host plugin body: register this plugin's own settings namespace when a
 * settings provider is composed. No other host-side behavior exists — the
 * skin catalog, the picker row, and the ThemeService registrations are all
 * client-only (src/client/index.ts).
 * @param ctx - host cordis context.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(settingsNamespace(SKIN_SETTINGS_NAMESPACE), SkinSettingsSchema)
  })
}
