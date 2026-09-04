/**
 * Dứa Con mascot — Hand-drawn continuous-line art (Chibi Kawaii style).
 * Sourced from the reference photo in public/image.png.
 */
import avatarWebp from '@/assets/mascot/avatar.webp'
import avatarPng from '@/assets/mascot/avatar.png'
import sleepingWebp from '@/assets/mascot/sleeping.webp'
import sleepingPng from '@/assets/mascot/sleeping.png'

export type MascotVariant = 'avatar' | 'sleeping'

export interface MascotArtwork {
  readonly webp: string
  readonly png: string
  readonly width: number
  readonly height: number
  readonly alt: string
}

export const MASCOT_ARTWORK: Record<MascotVariant, MascotArtwork> = {
  avatar: {
    webp: avatarWebp,
    png: avatarPng,
    width: 845,
    height: 845,
    alt: 'Dứa Con',
  },
  sleeping: {
    webp: sleepingWebp,
    png: sleepingPng,
    width: 1025,
    height: 612,
    alt: 'Dứa Con đang ngủ say',
  },
}

export const MASCOT_PALETTE: Record<string, string> = {
  espresso: '#3d2b1e', // continuous dark outline
  gingerDeep: '#b34a14', // ginger deep shadow / tabby bars
  gingerPrimary: '#df6826', // ginger mid — brand primary
  gingerLit: '#ef8f4a', // ginger lit by the window
  gingerHighlight: '#f9b478', // ginger highlight
  furCream: '#fffdf9', // cream white fur
  furShadow: '#ecdcc9', // fur shadow
  nosePink: '#f472b6', // nose pink
  innerEar: '#fbbf94', // inner ear
}
