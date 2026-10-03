# dsh-plugin-patches

[简体中文](README.md) | [English](README.en.md)

A personally maintained patch set for DeepSeek Harness, extending its functionality through dsh plugins.

The main package, `@aqian0/dsh-plugin-patches`, is declared directly in the root `package.json` and aggregates plugins through `cordis.patch.yml`. The patch list is currently empty, with no plugins implemented yet.

Each feature patch uses a separate cordis plugin subpackage named `@aqian0/dsh-plugin-patch-<name>`. The main package handles aggregation, without a separate contract package or multiple bundles.

Patches target rows by `id`; later patches override earlier ones. Updating `config` replaces it entirely, without merging.

Basic support for Oxlint and TypeScript 7 is included. Install dependencies with Bun, then run `bun run check` for linting, type checking, and bundle validation. Type checking also covers `scripts/`.

`scripts/build.ts` uses Bun to bundle a plugin package's `src/` into `lib/`, keeping external dependencies as imports. TS 7 generates type declarations under `lib/types/` based on the plugin's `tsconfig.json`. Both `.ts` and `.mts` entry points produce `.js` output. Run `bun scripts/build.ts <plugin-package-directory>`. The root package has no source code, so `bun run build` currently requires no compilation.

dsh starts with Node by default. Development environments with TypeScript support can load local source files directly; plugins installed into `node_modules` through npm use JavaScript entry points.

`scripts/checkBundle.ts` uses Bun's built-in YAML API to validate the syntax and list structure of patch files. dsh handles tag interpretation and patch composition at runtime. Source code and tests will be added as needed when the first plugin is implemented.
