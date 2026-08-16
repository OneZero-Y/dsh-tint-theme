/**
 * Bundles both halves of this plugin:
 *  - the host half (lib/index.js), a thin ESM library tsc already typechecked
 *    into lib/types — same shape as any ordinary DSH plugin package.
 *  - the client half (lib/client.js), a self-contained browser bundle for the
 *    DSH Web GUI's loader.
 *
 * The client half's output shape (banner/footer calling
 * `window.__ModuleLoader__.load({ id, factory })`, externals resolved
 * through the injected `require`) reproduces the mechanism documented for
 * official client plugins in `deepseek-ai/deepseek-harness`'s
 * `packages/client/tsdown.client.ts` — that file is a monorepo-internal
 * shared preset with no package.json of its own, so it cannot be imported
 * by a third-party repository; this config re-derives the same output
 * contract independently rather than depending on unpublished internals.
 * Confirm this still matches the target DSH version's actual loader
 * contract before shipping (see "The client half" in dsh-plugin-kit's
 * docs/plugin-contract-reference.md — this is the lower-confidence area).
 */
import type { UserConfig } from 'tsdown'

const PLUGIN_ID = '@onezero-y/dsh-tint-theme'

/**
 * Specifiers this client bundle resolves through the host's frozen loader
 * module table (`require(...)` in the wrapped factory) rather than inlining.
 * Confirmed against the installed `@deepseek-ai/dsh-client-ui-theme` package's
 * own compiled `lib/client.js`, which requires exactly `react/jsx-runtime`
 * and `@deepseek-ai/dsh-client-runtime/client` (among others this plugin does
 * not need, like `-ui-primitives`, since this plugin renders no icons) rather
 * than bundling them:
 *  - `react/jsx-runtime`: the compiler's automatic JSX-transform import
 *    (`"jsx": "react-jsx"` in tsconfig.json) emitted by TintRow.tsx. Bundling
 *    a second copy here would duplicate the host page's own React runtime
 *    instead of sharing it.
 *  - `@deepseek-ai/dsh-client-runtime/client`: settings-store.ts's `defineStore`
 *    value import. The host's own runtime plugin is what actually provides
 *    this module; a bundled duplicate would not share the host's engine
 *    internals it may rely on (module-scoped state, `SlotCore` wiring, etc).
 */
const CLIENT_EXTERNALS: readonly string[] = ['react/jsx-runtime', '@deepseek-ai/dsh-client-runtime/client']

const hostLibrary: UserConfig = {
  name: PLUGIN_ID,
  entry: { index: 'lib/types/index.js' },
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  target: 'es2024',
  fixedExtension: false,
  dts: false,
  clean: false,
}

const clientBundle: UserConfig = {
  name: `${PLUGIN_ID}/client`,
  entry: { client: 'lib/types/client/index.js' },
  outDir: 'lib',
  // CJS is required here, not a legacy leftover: the loader contract wraps
  // the bundle in `factory: (require) => { ... return module.exports }`
  // (see banner/footer below), which only makes sense against CJS-shaped
  // require/module.exports semantics. tsdown's own "prefer ESM" warning is
  // about general library distribution, which doesn't apply to a bundle
  // that's synthesizing a specific runtime-loader shape, so it's suppressed
  // below rather than "fixed" by switching format (that would break the
  // wrapper).
  format: 'cjs',
  // NOTE: tsdown's CJS output always forces the `node` platform internally
  // regardless of what's set here — this is a documented tsdown limitation,
  // not a mistake in this config. `platform: 'browser'` is kept for
  // intent/documentation (and in case a future tsdown version honors it),
  // but currently has no effect while format is 'cjs'. This bundle has no
  // Node builtin imports, so the practical difference is negligible today;
  // re-check this if the client half ever needs a Node-only API polyfilled
  // away.
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: false,
  suppressWarnings: ['We recommend using the ESM format instead of CommonJS'],
  deps: {
    neverBundle: [...CLIENT_EXTERNALS],
    alwaysBundle: (id: string) => !CLIENT_EXTERNALS.includes(id),
  },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PLUGIN_ID)}, factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}

export default [hostLibrary, clientBundle]
