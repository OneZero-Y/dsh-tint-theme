/**
 * Loader-facing entry point for @onezero-y/dsh-tint-theme.
 *
 * Host-half plugin body. All real behavior lives in the client half
 * (src/client/index.ts); this host plugin exists only to carry the
 * `dsh.bundle.patch` manifest so `dsh plugin add` has a host-side package to
 * attach the bundle patch to — the same minimal-host pattern the official
 * `ui-theme`/`locale` packages themselves use for a client-driven feature
 * with no host-side state.
 *
 * This plugin has no settings namespace of its own: selection state is
 * driven entirely from the theme service's own live state (see
 * src/client/index.ts's module doc for why — the confirmed
 * `WEB_SETTINGS_NAMESPACES` allowlist in the official
 * `packages/host/apiproxy` means a third-party settings namespace is never
 * exposed to the browser regardless of whether the host half registers
 * one), so there is nothing for the host half to register.
 *
 * This is function-form (named exports, no default export) even though
 * `apply` is a no-op, so this package doesn't become an exception to the
 * rule the whole kit is built around: a default export alongside named
 * `name`/`inject`/`apply` exports makes DSH's real Loader discard the named
 * exports entirely (see "Plugin forms" in the `dsh-plugin-kit` submodule's
 * `docs/plugin-contract-reference.md`).
 * @module @onezero-y/dsh-tint-theme
 */

/** Stable Cordis plugin id. Keep this unchanged after the plugin is published. */
export const name = 'dsh-tint-theme'

/** No host-side service dependency: this plugin's behavior is entirely client-side. */
export const inject: string[] = []

/** Host plugin body — no host-side behavior. */
export function apply(): void {}
