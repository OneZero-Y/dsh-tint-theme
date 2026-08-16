/**
 * Loader-facing entry point for @onezero-y/dsh-tint-theme.
 *
 * Host-half plugin body. Almost all real behavior for this plugin lives in
 * the client half (src/client/index.ts); this host plugin's primary reason
 * to exist is carrying the `dsh.bundle.patch` manifest so `dsh plugin add`
 * has a host-side package to attach the bundle patch to. It also registers
 * this plugin's own durable settings section — read and written exclusively
 * by the client half through `ctx.settingsScope` — the same optional-service
 * pattern read directly from the installed `@deepseek-ai/dsh-client-ui-theme`
 * host half (`lib/types/index.js`'s `apply`): `ctx.inject(['settings'], ...)`
 * so the section registers when a settings provider is composed and is
 * simply skipped otherwise (settings become process-local `memory` mode on
 * the client side in that case — see settings-namespace.ts).
 *
 * This is function-form (named exports, no default export) even though
 * there's no top-level `Config`: a default export alongside named
 * `name`/`inject`/`apply` exports makes DSH's real Loader discard the named
 * exports entirely (see "Plugin forms" in the `dsh-plugin-kit` submodule's
 * `docs/plugin-contract-reference.md`).
 * @module @onezero-y/dsh-tint-theme
 */
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import type { Context } from '@deepseek-ai/cordis'
import { TINT_SETTINGS_NAMESPACE } from './settings-namespace.ts'
import { TintThemeSettingsSchema } from './settings-schema.ts'

/** Stable Cordis plugin id. Keep this unchanged after the plugin is published. */
export const name = 'dsh-tint-theme'

/**
 * No hard host-side service dependency: the settings registration below is
 * itself optional (via `ctx.inject`, not this static list), so this plugin
 * loads immediately even when no settings provider is composed.
 */
export const inject: string[] = []

/**
 * Register this plugin's durable settings section when a settings provider
 * exists. No `Config` schema: this plugin has no deployment-time tunable
 * value (see the design record) — `TintThemeSettingsSchema` here is the
 * user-preference schema, a different concept, resolved through
 * `ctx.settings`, not through this plugin's own (absent) `Config`.
 * @param ctx - Host context that may acquire the optional settings service.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(settingsNamespace(TINT_SETTINGS_NAMESPACE), TintThemeSettingsSchema)
  })
}
