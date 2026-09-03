/**
 * Regenerate the browser icons from the mascot sprites.
 *
 *   node scripts/generate-icons.mjs      (or: yarn icons)
 *
 * The pixel art in src/components/mascotSprites.ts is the single source of
 * truth: the app avatar, the SVG favicon, the .ico and the Apple touch icon all
 * come from the same character map, so the brand cannot drift between them.
 * Every raster size is a whole multiple of the 16px grid, which is why the
 * favicon stays crisp at 16, 32 and 48.
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const jiti = createJiti(import.meta.url)
const { MASCOT_SPRITES, MASCOT_PALETTE, spriteRuns } = await jiti.import(
  path.join(root, 'src/components/mascotSprites.ts'),
)

const face = MASCOT_SPRITES.avatar
const GROUND = '#faf2e8'

/* ------------------------------------------------------------------ raster */

function rgba(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
    255,
  ]
}

function createImage(size, fill) {
  const data = new Uint8Array(size * size * 4)
  if (fill) {
    const px = rgba(fill)
    for (let i = 0; i < size * size; i++) data.set(px, i * 4)
  }
  return { size, data }
}

function drawSprite(img, sprite, scale, offset) {
  for (let y = 0; y < sprite.h; y++) {
    for (let x = 0; x < sprite.w; x++) {
      const hex = MASCOT_PALETTE[sprite.rows[y][x]]
      if (!hex) continue
      const px = rgba(hex)
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const gx = offset + x * scale + dx
          const gy = offset + y * scale + dy
          if (gx < 0 || gy < 0 || gx >= img.size || gy >= img.size) continue
          img.data.set(px, (gy * img.size + gx) * 4)
        }
      }
    }
  }
}

/** Knock one grid cell out of each corner so the tile reads as rounded. */
function notchCorners(img, cell) {
  const clear = [0, 0, 0, 0]
  const { size } = img
  for (const [ox, oy] of [
    [0, 0],
    [size - cell, 0],
    [0, size - cell],
    [size - cell, size - cell],
  ]) {
    for (let y = oy; y < oy + cell; y++) {
      for (let x = ox; x < ox + cell; x++) img.data.set(clear, (y * size + x) * 4)
    }
  }
}

/* -------------------------------------------------------------- png encode */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, body) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(body.length)
  const typed = Buffer.concat([Buffer.from(type, 'ascii'), body])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typed))
  return Buffer.concat([length, typed, crc])
}

function encodePng(img) {
  const { size, data } = img
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0 // filter: none
    Buffer.from(data.buffer, data.byteOffset + y * size * 4, size * 4).copy(
      raw,
      y * (size * 4 + 1) + 1,
    )
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** PNG-in-ICO, which every browser in this project's support range reads. */
function encodeIco(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  let offset = 6 + pngs.length * 16
  const entries = pngs.map(({ size, buf }) => {
    const entry = Buffer.alloc(16)
    entry[0] = size >= 256 ? 0 : size
    entry[1] = size >= 256 ? 0 : size
    entry.writeUInt16LE(1, 4) // planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(buf.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += buf.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)])
}

/* ------------------------------------------------------------------- write */

const written = []

function write(rel, buf) {
  const target = path.join(root, rel)
  fs.writeFileSync(target, buf)
  written.push(`${rel} (${buf.length.toLocaleString('en-US')} bytes)`)
}

// favicon.svg — resolution independent, and the only icon that can stay text.
const runs = spriteRuns(face)
const tile = [
  `M1 0 H${face.w - 1} V1 H${face.w} V${face.h - 1} H${face.w - 1} V${face.h}`,
  `H1 V${face.h - 1} H0 V1 H1 Z`,
].join(' ')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${face.w} ${face.h}" shape-rendering="crispEdges">
  <title>Dứa Con</title>
  <path d="${tile}" fill="${GROUND}" />
${runs.map((r) => `  <rect x="${r.x}" y="${r.y}" width="${r.w}" height="1" fill="${r.fill}" />`).join('\n')}
</svg>
`
write('public/favicon.svg', Buffer.from(svg, 'utf8'))

// favicon.ico — 1x, 2x and 3x of the same 16px grid.
write(
  'public/favicon.ico',
  encodeIco(
    [1, 2, 3].map((scale) => {
      const size = face.w * scale
      const img = createImage(size, GROUND)
      drawSprite(img, face, scale, 0)
      notchCorners(img, scale)
      return { size, buf: encodePng(img) }
    }),
  ),
)

// apple-touch-icon.png — 180px tile, iOS applies its own mask, so inset the art.
const touch = createImage(180, GROUND)
drawSprite(touch, face, 10, 10)
write('public/apple-touch-icon.png', encodePng(touch))

console.log('Regenerated from src/components/mascotSprites.ts:')
for (const line of written) console.log(`  ${line}`)
