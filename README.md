# dsh-tint-theme

[简体中文](README.zh.md)

An original theme plus an independent accent-color tint overlay for the DeepSeek Harness (DSH) Web GUI. The tint overlay works over whichever theme is currently active — this plugin's own theme, DSH's built-in light/dark, or a theme registered by another plugin.

## Requirements

- DeepSeek Harness with a working `dsh web` profile
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

A new row in **Settings > General**, right after the built-in Appearance row:

- **Tint Theme** — off / light / dark. Picking light or dark switches to this plugin's own "clay" theme (a warm, desaturated palette distinct from DSH's cooler default). "Off" defers back to whatever last set the active theme — the built-in Appearance row or another theme plugin.
- **Accent tint** — none, or one of six preset colors (ember, saffron, moss, lagoon, indigo, plum). This is independent of the row above: it applies over whichever theme is currently active, including DSH's own built-in light/dark or a third-party theme.

Both choices persist across reloads and are process-local when settings aren't available (e.g. a non-loopback remote browser).

## Uninstall

```sh
dsh plugin --profile <your-profile> remove @onezero-y/dsh-tint-theme
```

## How it works

This plugin has no host-side configuration — all behavior lives in the client half, activated through the `dsh.client` manifest field. It registers its theme and accent overlay through the official `ctx.theme` service (`register()` for the theme, `overrideTokens()` for the accent tint — the latter overrides only `--dsw-alias-brand-primary`, the one token DSH's own theme service documents as the primary brand accent) and its settings row through `ctx.slots`. Both preferences are stored in this plugin's own settings namespace, not the built-in theme/locale settings sections.

The clay palette and the six accent swatches are original work; only the DSH-defined `--dsw-alias-*` token names are shared public contract.

## License

[MIT](./LICENSE)
