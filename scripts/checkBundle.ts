import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// ponytail: check syntax and list shape only; dsh handles tags and patch composition.
const packageDir = resolve(process.argv[2] ?? fileURLToPath(new URL('../', import.meta.url)))
const manifest: { dsh?: { bundle?: { patch?: string | string[] } } } = await Bun.file(join(packageDir, 'package.json')).json()
const declared = manifest.dsh?.bundle?.patch
const files = typeof declared === 'string' ? [declared] : declared
if (!Array.isArray(files) || !files.every(file => typeof file === 'string')) {
  throw new Error('dsh.bundle.patch must be a file path or a list of file paths')
}

let patchCount = 0
for (const file of files) {
  try {
    const patches: unknown = Bun.YAML.parse(await Bun.file(join(packageDir, file)).text())
    if (!Array.isArray(patches) || !patches.every(patch => patch !== null && typeof patch === 'object' && !Array.isArray(patch))) {
      throw new Error('expected a YAML array of patch objects')
    }
    patchCount += patches.length
  } catch (cause) {
    throw new Error(`${file}: invalid patch file`, { cause })
  }
}
console.log(`${files.length} patch file(s), ${patchCount} patch(es)`)
