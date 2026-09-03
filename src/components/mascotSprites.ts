/**
 * Dứa Con as pixel art, traced from the reference photo in public/image.png.
 *
 * Each sprite is a character map on an integer grid — one character per pixel,
 * keyed to MASCOT_PALETTE. Editing the art means editing these rows, so the
 * source stays legible: you can read the cat in the diff. `.` is transparent.
 *
 * Grids are deliberately small (16 for the face, 54 for the sleeping pose) so every
 * pixel lands on a whole device pixel when CatMascot snaps its render to an
 * integer multiple of the grid.
 */

/** Any character outside the palette is a hole; this is the one we author with. */
const TRANSPARENT = '.'

export const MASCOT_PALETTE: Record<string, string> = {
  o: '#3d2b1e', // espresso outline
  D: '#b34a14', // ginger deep shadow, tabby bars
  G: '#df6826', // ginger mid — the brand primary
  L: '#ef8f4a', // ginger lit by the window
  H: '#f9b478', // ginger highlight
  W: '#fffdf9', // cream white fur
  S: '#ecdcc9', // fur shadow
  s: '#d9c3ad', // fur deep shadow
  P: '#f472b6', // nose
  p: '#fbbf94', // inner ear, paw pads
  E: '#5a4030', // closed eyelid
  g: '#ebdccb', // the cushion he has melted into
}

export interface MascotSprite {
  readonly w: number
  readonly h: number
  readonly rows: readonly string[]
}

/** Face, 16x16 — brand avatar and favicon. */
const avatar: MascotSprite = {
  w: 16,
  h: 16,
  rows: [
    '....o......o....',
    '...oGo....oGo...',
    '..oDGpo..opGDo..',
    '.oDGGpoooopGGDo.',
    '.oDLLLLWWLLLLDo.',
    'oDGGGGGWWGGGGGDo',
    'oDGGWWWWWWWWGGDo',
    'oGGoWEEWWEEWoGGo',
    'oGGoWWWWWWWWoGGo',
    'oGGoWWWPPWWWoGGo',
    'oGGoWWEWWEWWoGGo',
    '.oGoWWWWWWWWoGo.',
    '..oWWWWWWWWWWo..',
    '..oSWWWWWWWWSo..',
    '...ooSSWWSSoo...',
    '.....oooooo.....',
  ],
}

/** Sleeping sprawl, 54x37 — the pose from the photograph, for zero states. */
const sleeping: MascotSprite = {
  w: 54,
  h: 37,
  rows: [
    '......................................................',
    '......................................................',
    '................................................ooo...',
    '................................................WGGo..',
    '................................................WWGGo.',
    '.................................................WWGo.',
    '...............................................DDoGGGo',
    '.................................................DoGGo',
    '..................................................oGGo',
    '..................................................oGGo',
    '.......................................ooo........DGGo',
    '.........................LLLLLLLLLLLLLLLLLLooo..ooGDGo',
    '.......................oLoDDGGGGDDGGGGDDGGGGGGooGGGGD.',
    '................o....oLLGGDDGGGGDDGGGGDDGGGGGGGGGGGoo.',
    '...............oGo.ooGGGGGDDGGGGDDGGGGDDGGGDDGGGGGo...',
    '...ooooo.......oGGooGGGGGGDDGGGDDDGGGGDDGGGDDGGGGo....',
    '..oGGDGGo.....oGpGDGoGGGGDDDGGGDDGGGGDDDGGGDDGGGGo....',
    '.oGGGDGGGoooooGpppDGGoGGGDDGGGGDDGGGGDDGGGGDDGGGGGo...',
    '.oGGDGGGGGWWWGGpppGDGoGGGDDGGGGDDGGGGDDGGGDDDGGGGGo...',
    'oGGGDppGGGGWGGGGGGGDGGoGGDDGGGGDDGGGGDDGGGDDGGGGGGo...',
    '.oGGpppGGGWWWGGGGGGGGoWWWWWWWWWWWWWGGDDGGGDDGGGGGo....',
    '.oGGGGGGGGWWWGGGGGGGGoWWWWWWWWWWWWWWWWWGGGDDGGGGGo....',
    '..oGGGGGGWWWWWGGGGGGoWWWWWWWWWWWWWWWWWWWWGGGGGGGo.....',
    '...oGGGGWWWWWWWGGGGGoWWWWWWWWWWWWWWWWWWWWWGGGGGo......',
    '...oWWWWWWWWWWWWWWWWWoWWWWWWWWWWWWWWWWWWWWGGGGo.......',
    '...oWWEEEWWWWWWEEEWWWoWWWWWWWWWWWWWWWWWWWWooooo.......',
    '...oWEWWWEWWWWEWWWEWWoWWWWWWWWWWWWWWWWSSSoGGGGo.......',
    '.S..oWWWWWWWWWWWWWWWoWSWWWWWWWWWWWWSSSWWWoGGGGo.......',
    '..S.oWWWWWWPPWWWWWWWoSWWWWWWWWWWWWWWWWWooGGWWWWooo....',
    '....oWWWWWEWWEWWWWWWoWLLLWWWWWWWWWooooooGoGWWWWWWo....',
    '.....oWWWEWWWWEWWWWooLLLLLooooooooWWWWWoo.oWWWppWWo...',
    '......oWWWWWWWWWWWooooooLWWWoooooWWWWWWWo..oWWWWWo....',
    '.......ooWWWWWWWooWWWWWWooooWWWWWoWWWppo...oooWooo....',
    '.......ggooooooogoWWWWWWWWWWWWWWWoooooogggggggoggg....',
    '....gggggggggggggoooWWWWWWWWWWppWoggggggggggggggggggg.',
    '.......gggggggggggggoooooooooooooggggggggggggggggg....',
    '.........................ggggggg......................',
  ],
}

export const MASCOT_SPRITES = { avatar, sleeping } as const
export type MascotVariant = keyof typeof MASCOT_SPRITES

/** Sleep marks, animated as their own layer so the cat itself stays still. */
const zSmall: MascotSprite = { w: 3, h: 4, rows: ['GGG', '..G', '.G.', 'GGG'] }
const zLarge: MascotSprite = { w: 4, h: 5, rows: ['LLLL', '...L', '..L.', '.L..', 'LLLL'] }

export const SLEEP_MARKS: readonly { sprite: MascotSprite; x: number; y: number; delay: string }[] = [
  { sprite: zSmall, x: 23, y: 7, delay: '0s' },
  { sprite: zLarge, x: 29, y: 2, delay: '1.8s' },
]

export interface SpriteRun {
  x: number
  y: number
  w: number
  fill: string
}

/**
 * Collapse each row into runs of one colour. The sleeping sprite is ~900 opaque
 * pixels but only a couple of hundred runs, which is the difference between a
 * heavy DOM and a cheap one for an illustration three views render.
 */
export function spriteRuns(sprite: MascotSprite): SpriteRun[] {
  const runs: SpriteRun[] = []
  sprite.rows.forEach((row, y) => {
    let start = 0
    let char = row[0] ?? TRANSPARENT
    const flush = (end: number) => {
      const fill = MASCOT_PALETTE[char]
      if (fill) runs.push({ x: start, y, w: end - start, fill })
    }
    for (let x = 1; x <= row.length; x++) {
      const ch = row[x] ?? TRANSPARENT
      if (ch === char) continue
      flush(x)
      start = x
      char = ch
    }
  })
  return runs
}
