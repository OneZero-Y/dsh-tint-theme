# dsh-tint-theme

[English](README.md)

为 DeepSeek Harness (DSH) Web GUI 提供一套原创主题，外加一个独立的强调色叠加层。强调色叠加不挑主题——不管当前用的是本插件自带的主题、DSH 内置的浅色/深色，还是其他插件注册的主题，都能生效。

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

**设置 > 通用** 里会多出一行，紧跟在内置的"外观"行后面：

- **色调主题**：关闭 / 浅色 / 深色。选浅色或深色会切换到本插件自带的"clay"主题（暖灰橙调，跟 DSH 默认的冷色调明显不同）。选"关闭"会让出主题控制权，回退到最后一个生效的选择——可能是内置的"外观"行，也可能是别的主题插件。
- **强调色**：无，或者六个预设色块之一（ember 赭红 / saffron 藏红花黄 / moss 苔绿 / lagoon 青绿 / indigo 靛蓝 / plum 紫红）。这一项跟上面那一项无关：它会叠加在当前生效的任何主题上，包括 DSH 内置的浅色/深色，或者第三方主题。

两项选择都会跨刷新持久化；在无法访问 settings 服务时（比如非本机的远程浏览器），选择只在当前进程内生效。

## 卸载

```sh
dsh plugin --profile <你的 profile> remove @onezero-y/dsh-tint-theme
```

## 原理

本插件没有宿主侧配置项——所有行为都在客户端半，通过 `package.json` 里的 `dsh.client` 字段激活。主题和强调色叠加都通过官方的 `ctx.theme` 服务注册（`register()` 注册主题，`overrideTokens()` 叠加强调色——只覆盖 `--dsw-alias-brand-primary` 这一个 token，是 DSH 主题服务自己文档里标注的"主品牌强调色"），设置行通过 `ctx.slots` 注册。两项偏好都存在本插件自己的 settings 命名空间里，不借用内置主题/语言的 settings 区。

clay 配色和六个强调色块都是原创设计，只有 DSH 定义的 `--dsw-alias-*` token 名称是共享的公共契约。

## License

[MIT](./LICENSE)
