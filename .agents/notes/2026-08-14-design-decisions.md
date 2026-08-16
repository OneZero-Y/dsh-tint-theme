# Design decisions: dsh-tint-theme

Produced by `dsh-forge-design`. Consumed by `dsh-forge-init` and `dsh-forge-build`.

## Observable objective

After installing this plugin into a DSH Web profile, the user can:
1. Select an original theme this plugin registers (in the same Appearance/theme surface DSH already exposes), and
2. Independently pick an accent color that tints the currently active theme — whichever theme that is (this plugin's own, DSH's built-in light/dark, or a theme registered by any other installed plugin) — with the tint reverting instantly if the plugin is disabled or uninstalled.

Target: new repository, `dsh-tint-theme`, public, `web` profile only (this plugin has no host-side behavior worth running under `headless`).

## Plugin form

**Function form**, host half. `name`, `inject: []`, no `Config` (see "Configuration" below), `apply(): void {}` — an empty loader entry. This is the mechanically minimal shape a client-only plugin needs on the host side (confirmed against the real `dsh.bundle.patch` requirement: `dsh plugin add` needs a host-half package to attach the bundle patch to, even when that package's `apply` does nothing). No default export, per the contract reference's core rule — kept function form even though `apply` is a no-op, so the same Loader-shape test in `dsh-forge-verify` still applies uniformly and this package doesn't become the one exception to the rule the whole kit is built around.

The client half (see below) is where all real behavior lives, and is a separate, lower-confidence area per the contract reference. It gets its own explicit validation pass in `dsh-forge-wire`, not just a checkbox here.

## Host-only vs. host-plus-client

**Host-plus-client, client-only in practice.** The host half exists only to carry the bundle manifest; every capability (theme registration, tint overlay, settings UI) runs in the client half via `ctx.slots`, `ctx.theme`. This is explicitly the area the contract reference flags as inferred/lower-confidence (`packages/client/AGENTS.md`, not a standalone-author tutorial) — this project is also the kit's first real test of that section, and findings get written back to `docs/plugin-contract-reference.md` in the submodule.

## Required and optional dependencies (client half)

Client-side `inject` (per the pattern in DSH's own `ui-theme`/`ui-web-skins`-shaped plugins — this is the required-services *mechanism*, not any specific plugin's chosen service list):

- **`theme`** — required. Both capabilities (`register()` for the bundled theme, `overrideTokens()` for the tint layer) are methods on this service; the plugin cannot function without it.
- **`slots`** — required. The settings-row UI (theme picker addition + tint control) mounts through `ctx.slots.register` into `settings.general.item`, same slot DSH's own Appearance row and third-party skin rows use.
- **`locale`** — required. Any UI copy needs a registered locale dictionary per the client-half contract (`ctx.locale.register`).

No optional services identified — nothing in this plugin's scope has a "use it if present, degrade if not" shape.

Host-half `inject`: `[]`. The host `apply()` touches no service.

## Configuration

**No `Config` schema on the host half.** The host plugin does nothing, so there is nothing for a host-side config field to parameterize.

User-facing settings (which accent color is selected, whether the tint is on, which theme is active) are **not** modeled as Cordis plugin `Config` — that mechanism configures the *plugin's own installed behavior* (deployment-time), not *end-user runtime preference* (which DSH's own `ui-theme` handles through its settings-scope/store pattern, not through `Config`). This mirrors how the official `ui-theme` plugin itself has no `Config` export either — user preference goes through `ctx.settingsScope` / a client store, confirmed by reading its real source (`packages/client/ui-theme/src/client/index.ts` in a `deepseek-harness` checkout), not assumed.

Decision to revisit in `dsh-forge-build` once the client store is written: whether tint persistence uses a settings-scope-backed store (durable across reloads, mirroring how `ui-theme` persists `preference`) or an in-memory-only store (resets each session). Leaning toward **durable** — a user picking a tint color expects it to survive a reload — but this is implementation-stage, not a host-config decision, so it does not block scaffolding.

## Capability shape

**Single package, single role.** Not a three-role split: this is not a swappable-backend capability (no "local vs. sandboxed" axis the way Bash execution has). "Provide a theme" and "provide a tint overlay" are two features of one client plugin, not two interchangeable implementations of one interface — splitting them into separate packages would add packaging overhead (two `cordis.patch.yml`, two npm packages to keep in version-lockstep) for no swap-ability anyone needs today.

## What still needs deciding in `dsh-forge-build` (implementation-stage, not blocking scaffolding)

- Exact `--dsw-alias-*` token names the tint overlay writes to (needs a fresh read of `packages/client/ui-theme/src/client/index.ts`'s `BUILTIN_INSPECT_TOKENS` against whatever DSH version is targeted at build time — token names are explicitly compatibility-risk per the contract reference).
- Accent color input: preset swatches, a free color picker, or both.
- Bundled theme count: one light/dark pair to start; more can be added later without a design-record change (this is a content decision, not a shape decision).
- Settings-row layout: one row with two controls (theme select + tint), or two adjacent rows.

## Package identity

- Package name: **`@onezero-y/dsh-tint-theme`**. User's GitHub handle is `OneZero-Y`; npm scopes must be lowercase, so the scope is `onezero-y`.
- Cordis plugin `id`: **`dsh-tint-theme`** (matches repository name and package name's unscoped part).
