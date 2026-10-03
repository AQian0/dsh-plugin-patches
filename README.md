# dsh-plugin-patches

[简体中文](README.md) | [English](README.en.md)

个人维护的 DeepSeek Harness 补丁集，通过 dsh 插件扩展功能。

主包 `@aqian0/dsh-plugin-patches` 直接在根目录的 `package.json` 声明，通过 `cordis.patch.yml` 聚合插件。当前补丁列表为空，尚无实际插件。

每项功能补丁使用独立的 cordis 插件子包，命名为 `@aqian0/dsh-plugin-patch-<name>`；主包负责聚合，不设置独立的契约包或多种 bundle。

补丁按行 `id` 定位，后写覆盖先写；修改 `config` 时会整体替换，不做合并。

保留 Oxlint 和 TypeScript 7 的基础支持。使用 Bun 安装依赖，执行 `bun run check` 进行 lint、类型检查和 bundle 校验；类型检查也覆盖 `scripts/`。

`scripts/build.ts` 使用 Bun 将一个插件包的 `src/` 打包到 `lib/`，外部依赖保留为导入；TS 7 根据该插件的 `tsconfig.json` 生成 `lib/types/` 下的类型声明。`.ts` 和 `.mts` 入口均输出 `.js`。运行 `bun scripts/build.ts <插件包目录>`；根包没有源码，`bun run build` 当前无需编译。

dsh 默认由 Node 启动。支持 TS 的开发启动环境可以直接加载本地源码；通过 npm 安装到 `node_modules` 的插件使用 JavaScript 入口。

`scripts/checkBundle.ts` 使用 Bun 内置 YAML API 检查补丁文件的语法和列表结构；运行时的标签解释与补丁合成由 dsh 负责。首个插件落地时，再添加它需要的源码与测试。
