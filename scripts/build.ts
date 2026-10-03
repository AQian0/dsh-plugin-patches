import { existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Build one plugin package; the root bundle currently has no source to compile.
const packageDir = resolve(process.argv[2] ?? '.')
const sourceDir = join(packageDir, 'src')
const outputDir = join(packageDir, 'lib')

if (!existsSync(join(packageDir, 'package.json'))) throw new Error(`${packageDir}: package.json not found`)

if (!existsSync(sourceDir)) {
  console.log(`${packageDir}: no src directory; nothing to build`)
} else {
  const files = await Array.fromAsync(new Bun.Glob('**/*.{ts,mts}').scan(sourceDir))
  const entrypoints = files.filter(file => !/\.d\.m?ts$/.test(file)).map(file => join(sourceDir, file))
  if (entrypoints.length === 0) throw new Error(`${sourceDir}: no TypeScript sources`)
  await rm(outputDir, { recursive: true, force: true })

  const declarations = Bun.spawn([
    fileURLToPath(new URL('../node_modules/.bin/tsc', import.meta.url)),
    '--project', packageDir,
    '--noEmit', 'false', '--declaration', '--emitDeclarationOnly',
    '--rootDir', sourceDir, '--declarationDir', join(outputDir, 'types'),
  ], { stdout: 'inherit', stderr: 'inherit' })
  if (await declarations.exited !== 0) throw new Error(`${packageDir}: declaration generation failed`)

  for (const file of files.filter(file => /\.d\.m?ts$/.test(file))) {
    await Bun.write(join(outputDir, 'types', file), Bun.file(join(sourceDir, file)))
  }

  const result = await Bun.build({
    entrypoints,
    root: sourceDir,
    outdir: outputDir,
    target: 'node',
    packages: 'external',
  })
  if (!result.success) throw new AggregateError(result.logs, `${packageDir}: build failed`)
  console.log(`${packageDir}: built ${entrypoints.length} entrypoint(s)`)
}
