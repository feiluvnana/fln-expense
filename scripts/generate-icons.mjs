/**
 * Regenerate browser icons from the mascot avatar asset.
 *
 *   node scripts/generate-icons.mjs      (or: yarn icons)
 *
 * The continuous-line Chibi mascot in src/assets/mascot/avatar.png is the single source of truth:
 * the app avatar, the SVG favicon, the .ico and the Apple touch icon all come from the same
 * high-resolution artwork, maintaining consistent branding across all platforms and display densities.
 */
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pyScript = path.join(root, 'scripts/generate-icons.py')

try {
  const stdout = execSync(`python3 "${pyScript}"`, { encoding: 'utf8' })
  console.log('Regenerated icons from src/assets/mascot/avatar.png:')
  console.log(stdout.trim())
} catch (err) {
  console.error('Failed to regenerate icons:', err)
  process.exit(1)
}
