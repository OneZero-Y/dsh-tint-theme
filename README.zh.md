# dsh-tint-theme

[English](README.md)

为 DeepSeek Harness (DSH) Web GUI 提供一个皮肤选择器：25 套主题家族。其中 22 套移植自知名开源编辑器配色（Gruvbox、Solarized、Dracula、One Dark/Light、Nord、Catppuccin、Tokyo Night 等等——完整名单、上游仓库和许可证见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)），另外 3 套（Aftertype、Signalwave、Quietloop）是本插件自己的原创设计——不是移植自任何项目，也不指向或关联任何商业编辑器或 AI 编程工具。每套家族都有浅色和深色两个皮肤；切换系统的 `prefers-color-scheme` 时插件会自动跟着换成对应的那一个。

## 环境要求

- 已能正常运行 `dsh web` 的 DeepSeek Harness
- Node.js >= 22.19（仅从源码 / 需要构建的 git 源安装时需要）

## 安装

```sh
dsh plugin --profile <你的 profile> add github:OneZero-Y/dsh-tint-theme
```

装完重启该 profile（比如 `dsh web`），刷新浏览器即可。

> **从 git 源第一次安装可能会报 pnpm 的 `allowBuilds` 错误。** 本插件声明了 `prepare` 脚本（安装后会自己构建一次），pnpm 10+ 出于供应链安全考虑，会拒绝运行 git 依赖的构建脚本，除非你显式允许。报错信息里会给出具体的包名——把这个包名加进该 profile 的 `pnpm-workspace.yaml` 的 `allowBuilds` 里，然后重新执行同一条 `add` 命令即可。这是 pnpm 的安全机制在正常工作，不是插件坏了。

### 从本地源码安装

```sh
git clone https://github.com/OneZero-Y/dsh-tint-theme.git
cd dsh-tint-theme
npm install
npm run build
dsh plugin --profile <你的 profile> add "$PWD"
```

## 装完能用到什么

**设置 > 通用** 里会多出一行，紧跟在内置的"外观"行后面：一整排瓦片，每个瓦片对应一套主题家族，外加一个"默认"瓦片用来把控制权交还给内置的"外观"行。点选某个家族会激活它的浅色或深色皮肤，具体选哪个跟随你当前的系统深浅色偏好；如果某个家族处于激活状态时系统偏好发生切换，插件会自动换成该家族对应的另一个皮肤。

## 卸载

```sh
dsh plugin --profile <你的 profile> remove @onezero-y/dsh-tint-theme
```

## 原理

本插件没有宿主侧配置项——所有行为都在客户端半，通过 `package.json` 里的 `dsh.client` 字段激活。每个家族的浅色和深色皮肤都注册进官方的 `ThemeService`（`ctx.theme.register(...)`，第三方主题的官方合法入口）；设置行通过 `ctx.slots` 注册。

本插件不维护自己的持久化存储。DSH 自带的 settings 命名空间传输机制（`ctx.settingsScope`）在宿主侧有一份固定白名单，第三方插件的命名空间永远不会被加进去，所以插件自己的偏好存储在浏览器侧永远读不回正确的值。取而代之，本插件直接跟随主题服务自身的活动态（`ctx.theme.getTheme()` 和 `theme/change` 事件）——选择器里被选中的瓦片始终反映当前真正生效的主题 id，不管这个 id 是别的插件设置的，还是内置"外观"行设置的。选择本身跨刷新是否保留，取决于内置"外观"行自己的偏好存档机制对当前生效 id 的处理方式。

每个家族的配色数值都移植自具名的上游开源项目；从该项目语义化调色板到 DSH 自己的 `--dsw-alias-*`/`--dsw-specific-*` 设计 token 的映射，是本插件自己的实现。逐家族的署名和许可证全文见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

## License

[MIT](./LICENSE)
