# dsh-tint-theme

[简体中文](README.zh.md)

A skin picker for the DeepSeek Harness (DSH) Web GUI: 25 skin families. 22 are ported from well-known open-source editor color themes (Gruvbox, Solarized, Dracula, One Dark/Light, Nord, Catppuccin, Tokyo Night, and more — see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for the full list, upstream repositories, and licenses), and 3 (Aftertype, Signalwave, Quietloop) are original designs of this plugin's own — not ports of, and not affiliated with, any commercial editor or AI coding tool. Every family ships both a light and a dark skin; the plugin follows the system `prefers-color-scheme` to pick the matching one automatically when you switch.

## Requirements

- DeepSeek Harness with a working `dsh web` profile, `@deepseek-ai/dsh-client-ui-theme` `0.1.0-rc.7` or later (the version that first exposed third-party settings namespaces to the browser — see "How it works" below)
- Node.js >= 22.19 (only if installing from source / a git spec that needs to build)

## Install

```sh
dsh plugin --profile <your-profile> add github:OneZero-Y/dsh-tint-theme
```

Then restart the profile (e.g. `dsh web`) and refresh the browser.

> **First install from a git source may fail with a pnpm `allowBuilds` error.** This package declares a `prepare` script (it builds itself after install), and pnpm 10+ refuses to run a git dependency's build script until you explicitly allow it. The error names the exact package key — add it under `allowBuilds` in that profile's `pnpm-workspace.yaml`, then re-run the same `add` command unchanged. This is pnpm's supply-chain safety gate working as intended, not a broken package.

### From a local checkout

```sh
git clone https://github.com/OneZero-Y/dsh-tint-theme.git
cd dsh-tint-theme
npm install
npm run build
dsh plugin --profile <your-profile> add "$PWD"
```

## What you get

A new **Skins** entry in the Settings nav, alongside Models / Agent Presets / Plugins: a grid of tiles, one per skin family, plus a "Default" tile that hands control back to the built-in Appearance row. Picking a family activates its light or dark skin, matched to your current system color-scheme preference; if the system preference flips while a family is active, the plugin switches to that family's matching skin automatically.

## Uninstall

```sh
dsh plugin --profile <your-profile> remove @onezero-y/dsh-tint-theme
```

## How it works

Every family's light and dark skin is registered into the official `ThemeService` (`ctx.theme.register(...)`, the sanctioned third-party theme surface); the Skins page is registered as its own `settings.section` nav entry through `ctx.slots` — a peer of Models/Agent Presets/Plugins, not a row inside General, because 25+ skins read poorly as one more crowded row.

The picker's SELECTED TILE always mirrors the theme service's own live state (`ctx.theme.getTheme()` and the `theme/change` event) — it reflects whichever theme id is actually active, including one set by another plugin or the built-in Appearance row. Cross-reload persistence of the user's CHOICE goes through this plugin's own settings namespace (`ctx.settingsScope.bind(...)`, host-registered in `src/index.ts`): every explicit pick is written there, and the persisted family is applied back through `ctx.theme.setTheme` on boot.

This wasn't always possible. Earlier releases of this plugin (targeting `dsh-client-ui-theme` `rc.6` and earlier) could not persist a selection of their own: the official `deepseek-ai/deepseek-harness` host gated every third-party settings namespace behind a hardcoded allowlist, so a plugin-owned preference store could never be read back by the browser regardless of registration. That allowlist was removed upstream ("Registering is exposing" — see the official repository's `2026-08-12-plugin-owned-settings-surface` Agent Note), first shipping in `rc.7`, which this plugin now requires.

Every family's color values are ported from a named upstream open-source project; every mapping from that project's semantic palette to DSH's own `--dsw-alias-*`/`--dsw-specific-*` design tokens is this plugin's own implementation. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for attribution and license text per family.

## License

[MIT](./LICENSE)
