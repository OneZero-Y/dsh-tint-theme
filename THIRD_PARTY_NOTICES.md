# Third-Party Notices

This plugin ships 25 skin families. 22 of them are ported from a named
upstream open-source editor theme, under that theme's own license; the
remaining 3 are original designs of this plugin's own, not ported from
anything (see "Original Skins" below). This document records, per ported
family: the upstream repository, the license, and the exact source file the
hex values were read from.

None of this plugin's own code (`src/client/skins.ts`, `token-map.ts`,
`settings-store.ts`, `SkinRow.tsx`, `adaptive.ts`, or any file in
`src/client/families/`) is copied from any upstream repository listed below,
or from any third-party DSH plugin. What is ported is the color VALUES only
— the palette each upstream project publishes — mapped into this plugin's
own token-mapping scheme (`token-map.ts`) through this plugin's own
`SkinFamily`/`SkinDefinition` data shapes (`skins.ts`).

Where an upstream theme ships no light (or no dark) companion, this plugin
supplies an original companion of its own design; those cases are called
out explicitly below and are NOT attributed to any upstream project.

---

## Gruvbox

- Upstream: [morhetz/gruvbox](https://github.com/morhetz/gruvbox)
- Author: Pavel Pertsev (morhetz)
- License: MIT/X11
- Source file: `colors/gruvbox.vim` (medium-contrast light and dark palette tables)

## Solarized

- Upstream: [altercation/solarized](https://github.com/altercation/solarized)
- Author: Ethan Schoonover
- License: published for open reuse; the project's README documents the
  precise hex/Lab values ("The Values" table) as the palette's public
  specification. No separate LICENSE file is present in the upstream
  repository; the README's own text is the attribution basis used here.
- Source file: `README.md` "The Values" table (`base03`–`base3`, plus the
  eight accent hues)

## Dracula

- Upstream: [dracula/visual-studio-code](https://github.com/dracula/visual-studio-code)
- Author: Zeno Rocha and the Dracula Theme contributors
- License: MIT
- Source file: `src/dracula.yml` (dark palette only — see note below)
- **Note**: Dracula ships no official light companion (the upstream
  project's own README states "Dracula can't stand the light"). This
  plugin's Dracula light skin is an original design, not a port of any
  third-party "Alucard"-style community fork.

## One Dark / One Light

- Upstream: [atom/one-dark-syntax](https://github.com/atom/one-dark-syntax),
  [atom/one-light-syntax](https://github.com/atom/one-light-syntax)
- Author: GitHub Inc. (Atom)
- License: MIT
- Source file: `styles/colors.less` in each repository

## Night Owl

- Upstream: [sdras/night-owl-vscode-theme](https://github.com/sdras/night-owl-vscode-theme)
- Author: Sarah Drasner
- License: MIT
- Source file: the theme's published color tokens, including its "Night Owl
  Light" companion shipped in the same package

## Nord

- Upstream: [nordtheme/nord](https://github.com/nordtheme/nord)
- Author: Sven Greb (arcticicestudio)
- License: MIT
- Source file: the official palette specification (`nord0`–`nord15`)
- **Note**: Nord ships no official light companion. This plugin's Nord
  light skin is an original design that re-maps Nord's own Frost/Aurora
  accent hues onto its Snow Storm shades as light backgrounds.

## Cobalt2

- Upstream: [wesbos/cobalt2-vscode](https://github.com/wesbos/cobalt2-vscode)
- Author: Wes Bos
- License: MIT
- Source file: `themes/cobalt2.json`
- **Note**: Cobalt2 ships dark-only. This plugin's Cobalt2 light skin is an
  original design.

## Material Palenight

- Upstream: the Material Theme project (material-theme.site)
- License: MIT
- Source file: the theme's published "Palenight" palette table
- **Note**: this plugin's Material Palenight light skin is an original
  design; the upstream project ships no light companion for this specific
  variant.

## Catppuccin

- Upstream: [catppuccin/catppuccin](https://github.com/catppuccin/catppuccin)
- License: MIT
- Source file: the project's published palette tables for the "Latte"
  (light) and "Mocha" (dark) flavors

## Tokyo Night

- Upstream: [tokyo-night/tokyo-night-vscode-theme](https://github.com/tokyo-night/tokyo-night-vscode-theme)
  (originally by Enkia)
- License: MIT
- Source file: `themes/tokyo-night-color-theme.json`,
  `themes/tokyo-night-light-color-theme.json`

## Rosé Pine

- Upstream: [rose-pine/vscode](https://github.com/rose-pine/vscode)
- License: MIT
- Source file: the project's published palette tables for "Rosé Pine Dawn"
  (light) and the base "Rosé Pine" (dark)

## Everforest

- Upstream: [sainnhe/everforest](https://github.com/sainnhe/everforest)
- Author: sainnhe
- License: MIT
- Source file: the project's published "Medium" contrast palette table,
  light and dark backgrounds

## Kanagawa

- Upstream: [rebelot/kanagawa.nvim](https://github.com/rebelot/kanagawa.nvim)
- Author: Tommaso Laurenzi
- License: MIT
- Source file: `lua/kanagawa/colors.lua` ("Wave"/dark, "Lotus"/light variants)

## Melange

- Upstream: [savq/melange-nvim](https://github.com/savq/melange-nvim)
- Author: Sergio Alejandro Vargas
- License: MIT
- Source file: `melange_light.json`, `melange_dark.json`

## Ayu

- Upstream: [ayu-theme/ayu-vim](https://github.com/ayu-theme/ayu-vim) /
  [ayu-theme/ayu-colors](https://github.com/ayu-theme/ayu-colors)
- Author: Konstantin Pschera (ayu-theme)
- License: MIT
- Source file: `colors/ayu.vim` (`s:palette` table, `dark`/`light` columns)

## Iceberg

- Upstream: [cocopon/iceberg.vim](https://github.com/cocopon/iceberg.vim)
- Author: cocopon
- License: MIT
- Source file: `colors/iceberg.vim` (`&background == 'light'`/dark `hi`
  blocks and the `terminal_color_*` table)

## Horizon

- Upstream: [jolaleye/horizon-theme-vscode](https://github.com/jolaleye/horizon-theme-vscode)
- Author: Jonathan Olaleye
- License: MIT
- Source file: `src/dark/globals.json`, `src/bright/globals.json` (the
  theme's own light companion is named "Horizon Bright")

## Nightfox / Dayfox

- Upstream: [EdenEast/nightfox.nvim](https://github.com/EdenEast/nightfox.nvim)
- Author: James Simpson (EdenEast)
- License: MIT
- Source file: `lua/nightfox/palette/nightfox.lua` (dark),
  `lua/nightfox/palette/dayfox.lua` (light)

## Flexoki

- Upstream: [kepano/flexoki](https://github.com/kepano/flexoki)
- Author: Steph Ango (kepano)
- License: MIT
- Source file: `css/flexoki.css` (`--flexoki-*` custom-property scale)

## Winter is Coming

- Upstream: [johnpapa/vscode-winteriscoming](https://github.com/johnpapa/vscode-winteriscoming)
- Author: John Papa
- License: MIT
- Source file: `themes/WinterIsComing-dark-blue-color-theme.json`,
  `themes/WinterIsComing-light-color-theme.json`

## Noctis

- Upstream: [liviuschera/noctis](https://github.com/liviuschera/noctis)
- Author: Liviu Schera
- License: MIT
- Source file: `themes/noctis.json` (dark), `themes/lux.json` (light,
  "Noctis Lux")
- **Note**: not present in ZeroZ-lab/dsh-web-skins' own catalog — this is
  this plugin's own addition to the ported-theme roster.

## Tomorrow

- Upstream: [chriskempson/tomorrow-theme](https://github.com/chriskempson/tomorrow-theme)
- Author: Chris Kempson
- License: MIT
- Source file: `vim/colors/Tomorrow.vim` (light),
  `vim/colors/Tomorrow-Night.vim` (dark)

---

## Original Skins (not ported)

These 3 families are original designs created for this plugin. They are
NOT ports of any upstream project, and are not attributed to any
third-party author. They are also not intended to reference, resemble, or
imply affiliation with any specific commercial product (editor, terminal,
or AI coding tool) — each family's own file header states this explicitly.

- **Aftertype** — `src/client/families/aftertype.ts`. Dark-first; cool
  grey-blue neutrals with a cyan accent.
- **Signalwave** — `src/client/families/signalwave.ts`. Dark-first; deep
  violet-black neutrals with a magenta accent. Deliberately avoids the
  retro CRT/scanline/glitch-art visual motifs associated with the
  unrelated "signalwave" music/aesthetic microgenre of the same name.
- **Quietloop** — `src/client/families/quietloop.ts`. Light-first; warm
  off-white neutrals with a deep green accent.

## MIT License (full text)

Every family marked "License: MIT" above is licensed under a copy of the
following text, with copyright held by the author named in that family's
entry (the specific copyright line varies per upstream repository's own
LICENSE file; see the linked repository for the exact notice):

```
MIT License

Copyright (c) <year> <copyright holder, per the linked repository's own LICENSE file>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
