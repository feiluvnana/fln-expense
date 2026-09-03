<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    variant?: 'avatar' | 'sleeping' | 'banner'
  }>(),
  {
    size: 40,
    variant: 'avatar',
  },
)
</script>

<template>
  <div class="cat-mascot-wrapper" :class="variant">
    <!-- Mini Avatar Variant (Header, Sidebar Logo) -->
    <!-- Faithfully reproduces the ginger-and-white tabby face with the white blaze from public/image.png -->
    <svg
      v-if="variant === 'avatar'"
      :width="size"
      :height="size"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="cat-svg"
      aria-hidden="true"
    >
      <!-- Warm ground halo -->
      <circle cx="24" cy="24" r="22" fill="#FAF2E8" stroke="#F1DCC9" stroke-width="1.5" />

      <!-- Ginger Ears with Pink Inner -->
      <!-- Left Ear -->
      <path d="M12 21L14 8L22 15" fill="#DF6826" />
      <path d="M14 17L15.5 11L19.5 15" fill="#FBBF94" />
      <!-- Right Ear -->
      <path d="M36 21L34 8L26 15" fill="#DF6826" />
      <path d="M34 17L32.5 11L28.5 15" fill="#FBBF94" />

      <!-- Head Base (Snowy White) -->
      <path
        d="M12 24C12 17.5 17.5 13 24 13C30.5 13 36 17.5 36 24C36 31 30.5 35 24 35C17.5 35 12 31 12 24Z"
        fill="#FFFDF9"
      />

      <!-- Ginger Tabby Patches on Crown/Temples (leaving the distinctive white blaze down the middle) -->
      <!-- Left Ginger Patch -->
      <path
        d="M12 23C12 17.5 16 13 20.5 13.5C18.5 17 17.5 21 15 25C13 24.5 12 23.8 12 23Z"
        fill="#E8823D"
      />
      <!-- Right Ginger Patch -->
      <path
        d="M36 23C36 17.5 32 13 27.5 13.5C29.5 17 30.5 21 33 25C35 24.5 36 23.8 36 23Z"
        fill="#E8823D"
      />

      <!-- Tabby Forehead & Temple Stripes -->
      <path d="M15 15C16 17 17 18 18 19" stroke="#C9561A" stroke-width="1.2" stroke-linecap="round" />
      <path d="M33 15C32 17 31 18 30 19" stroke="#C9561A" stroke-width="1.2" stroke-linecap="round" />

      <!-- Sleeping Eyes (Curved peaceful happy squints) -->
      <path
        d="M18 23.5C19 22 21 22 22 23.5"
        stroke="#4A3425"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <path
        d="M26 23.5C27 22 29 22 30 23.5"
        stroke="#4A3425"
        stroke-width="1.6"
        stroke-linecap="round"
      />

      <!-- Sweet Pink Nose -->
      <polygon points="24,25.5 22.8,27.2 25.2,27.2" fill="#F472B6" />

      <!-- Sleeping Cat Mouth Lines -->
      <path
        d="M24 27.2V28.5M24 28.5C23.2 29.2 22 29.2 21.2 28.6M24 28.5C24.8 29.2 26 29.2 26.8 28.6"
        stroke="#4A3425"
        stroke-width="1.2"
        stroke-linecap="round"
      />

      <!-- Delicate White Whiskers -->
      <path d="M14 26L8 25M14 27.5L7 28M34 26L40 25M34 27.5L41 28" stroke="#DEC8B4" stroke-width="1" stroke-linecap="round" />

      <!-- Cute White Paw resting at the edge -->
      <ellipse cx="34" cy="34" rx="4.5" ry="3.5" fill="#FFFDF9" stroke="#EFE4D6" stroke-width="0.8" />
      <circle cx="34" cy="33.5" r="1.2" fill="#FBBF94" />
    </svg>

    <!-- Sleeping Variant (For Empty States & Cozy Sanctuary Headers) -->
    <!-- Matches the exact side-sleeping chair posture of Dứa Con from public/image.png -->
    <svg
      v-else-if="variant === 'sleeping'"
      :width="size"
      :height="size * 0.62"
      viewBox="0 0 240 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="cat-svg"
      aria-hidden="true"
    >
      <!-- Soft Chair Surface Shadow -->
      <ellipse cx="120" cy="128" rx="92" ry="12" fill="#EDE0D1" opacity="0.75" />
      <path d="M35 124C65 120 175 120 205 124" stroke="#DECBC0" stroke-width="1.5" stroke-linecap="round" opacity="0.5" />

      <!-- Ginger Tabby Tail (curling up from rump) -->
      <path
        d="M185 75C200 68 215 72 218 84C220 95 210 106 195 110"
        stroke="#DF6826"
        stroke-width="12"
        stroke-linecap="round"
      />
      <!-- Tail tabby rings -->
      <path d="M198 72C203 76 206 82 205 87" stroke="#C9561A" stroke-width="2.5" stroke-linecap="round" />
      <path d="M214 83C216 88 214 94 210 98" stroke="#C9561A" stroke-width="2.5" stroke-linecap="round" />
      <!-- Tail white tip -->
      <path
        d="M205 104C200 107 195 109 190 110"
        stroke="#FFFDF9"
        stroke-width="10"
        stroke-linecap="round"
      />

      <!-- Chubby Torso: Warm Ginger Back & Flank -->
      <path
        d="M60 88C52 68 70 46 98 42C130 38 168 45 186 64C198 78 194 98 178 112C155 122 85 118 60 88Z"
        fill="#E8823D"
      />

      <!-- Tabby Stripes across the Ginger Spine/Back -->
      <path d="M102 44C104 53 100 64 96 72" stroke="#C9561A" stroke-width="3" stroke-linecap="round" />
      <path d="M124 42C125 53 121 66 117 76" stroke="#C9561A" stroke-width="3.2" stroke-linecap="round" />
      <path d="M146 45C146 56 142 68 138 78" stroke="#C9561A" stroke-width="3" stroke-linecap="round" />
      <path d="M166 52C164 62 161 72 157 80" stroke="#C9561A" stroke-width="2.8" stroke-linecap="round" />

      <!-- Fluffy White Belly & Chest (The distinctive snowy belly from image.png) -->
      <path
        d="M65 92C78 86 105 82 132 88C154 93 162 106 148 116C128 124 82 122 65 106C62 101 62 96 65 92Z"
        fill="#FFFDF9"
      />
      <!-- Belly fur soft tufts -->
      <path d="M105 84C108 87 114 86 117 84" stroke="#FFFDF9" stroke-width="2" stroke-linecap="round" />
      <path d="M135 88C138 92 144 91 147 88" stroke="#FFFDF9" stroke-width="2" stroke-linecap="round" />

      <!-- Hind Leg with White Sock (bent comfortably on chair) -->
      <path d="M165 92C178 95 186 106 178 118C172 124 160 122 154 116" fill="#E8823D" />
      <ellipse cx="172" cy="116" rx="9" ry="6" fill="#FFFDF9" stroke="#EFE4D6" stroke-width="0.8" />
      <circle cx="173" cy="115" r="1.5" fill="#FBBF94" />

      <!-- Cat Head (Resting tilted on left cheek) -->
      <!-- Ears -->
      <!-- Left ear (resting close to cushion) -->
      <path d="M42 98L30 82L46 86" fill="#DF6826" />
      <path d="M38 94L33 85L43 88" fill="#FBBF94" />
      <!-- Right ear (pointing up) -->
      <path d="M52 68L60 48L72 65" fill="#DF6826" />
      <path d="M56 65L61 54L68 64" fill="#FBBF94" />

      <!-- Head Base (White muzzle/cheeks) -->
      <circle cx="56" cy="85" r="22" fill="#FFFDF9" />

      <!-- Ginger Patches on Head (preserving the white forehead blaze) -->
      <path
        d="M38 82C36 74 42 66 50 67C46 73 44 80 40 86C38 85 38 83 38 82Z"
        fill="#E8823D"
      />
      <path
        d="M74 80C76 72 70 65 62 66C66 72 68 78 72 84C74 83 74 81 74 80Z"
        fill="#E8823D"
      />
      <path d="M46 70C48 74 49 76 50 78" stroke="#C9561A" stroke-width="1.4" stroke-linecap="round" />

      <!-- Sleeping Eyes (Curved thin peaceful lines) -->
      <path
        d="M48 84C49.5 82 52 82 53.5 84"
        stroke="#4A3425"
        stroke-width="1.8"
        stroke-linecap="round"
      />
      <path
        d="M59 84C60.5 82 63 82 64.5 84"
        stroke="#4A3425"
        stroke-width="1.8"
        stroke-linecap="round"
      />

      <!-- Sweet Pink Nose -->
      <polygon points="56,87.5 54.5,89.5 57.5,89.5" fill="#F472B6" />

      <!-- Cat Mouth -->
      <path
        d="M56 89.5V91M56 91C55 91.8 53.8 91.6 53 91M56 91C57 91.8 58.2 91.6 59 91"
        stroke="#4A3425"
        stroke-width="1.1"
        stroke-linecap="round"
      />

      <!-- White Whiskers -->
      <path d="M46 88L36 86M46 90.5L34 91M66 88L76 86M66 90.5L78 91" stroke="#DFC9B6" stroke-width="1" stroke-linecap="round" />

      <!-- Front Legs (From photo: Left leg extended forward with distinctive orange patch on elbow!) -->
      <!-- Left Foreleg with orange elbow patch -->
      <path d="M72 102C82 104 96 108 108 114" stroke="#FFFDF9" stroke-width="9" stroke-linecap="round" />
      <!-- The iconic orange spot on the elbow from public/image.png! -->
      <ellipse cx="88" cy="105" rx="5" ry="3.5" fill="#E8823D" />
      <!-- White Paw with gentle wrist bend -->
      <ellipse cx="112" cy="115" rx="7" ry="5" fill="#FFFDF9" stroke="#EFE4D6" stroke-width="0.8" />
      <line x1="110" y1="113" x2="110" y2="117" stroke="#EBD9C8" stroke-width="1" stroke-linecap="round" />

      <!-- Right Foreleg tucked nearby -->
      <path d="M60 100C68 103 76 108 84 115" stroke="#FFFDF9" stroke-width="8" stroke-linecap="round" />
      <ellipse cx="88" cy="116" rx="6" ry="4.5" fill="#FFFDF9" stroke="#EFE4D6" stroke-width="0.8" />

      <!-- Floating "Zzz" Sleep Marks -->
      <text
        x="72"
        y="45"
        fill="#DF6826"
        font-family="sans-serif"
        font-weight="700"
        font-size="11"
        opacity="0.8"
      >
        z
      </text>
      <text
        x="80"
        y="33"
        fill="#DF6826"
        font-family="sans-serif"
        font-weight="700"
        font-size="14"
        opacity="0.6"
      >
        z
      </text>
      <text
        x="90"
        y="20"
        fill="#DF6826"
        font-family="sans-serif"
        font-weight="700"
        font-size="18"
        opacity="0.4"
      >
        Z
      </text>
    </svg>

    <!-- Banner Variant -->
    <svg
      v-else-if="variant === 'banner'"
      :width="size"
      :height="size * 0.4"
      viewBox="0 0 320 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="cat-svg"
      aria-hidden="true"
    >
      <ellipse cx="160" cy="98" rx="130" ry="14" fill="#EDE0D1" opacity="0.6" />
      <!-- Sleeping cat in banner scale -->
      <path
        d="M100 80C92 62 110 42 135 38C165 34 200 42 216 58C228 72 224 90 208 102C185 112 125 108 100 80Z"
        fill="#E8823D"
      />
      <!-- Tabby stripes -->
      <path d="M140 40C142 50 138 60 135 68" stroke="#C9561A" stroke-width="3" stroke-linecap="round" />
      <path d="M162 38C163 49 159 62 155 72" stroke="#C9561A" stroke-width="3" stroke-linecap="round" />
      <path d="M184 42C184 52 180 64 176 74" stroke="#C9561A" stroke-width="3" stroke-linecap="round" />
      <!-- White belly -->
      <path
        d="M105 84C118 78 145 74 170 80C190 85 198 98 185 106C165 114 122 112 105 98Z"
        fill="#FFFDF9"
      />
      <!-- Head -->
      <circle cx="95" cy="76" r="20" fill="#FFFDF9" />
      <path d="M80 72C78 64 84 58 90 59C86 65 84 71 80 77Z" fill="#E8823D" />
      <path d="M110 70C112 63 106 58 100 59C104 65 106 70 110 76Z" fill="#E8823D" />
      <polygon points="82,88 72,74 86,77" fill="#DF6826" />
      <polygon points="92,58 98,40 108,55" fill="#DF6826" />
      <path d="M88 75C89 74 91 74 92 75" stroke="#4A3425" stroke-width="1.5" stroke-linecap="round" />
      <path d="M98 75C99 74 101 74 102 75" stroke="#4A3425" stroke-width="1.5" stroke-linecap="round" />
      <polygon points="95,78 94,80 96,80" fill="#F472B6" />
      <!-- Front paw with orange patch -->
      <path d="M110 92C118 94 130 98 140 102" stroke="#FFFDF9" stroke-width="8" stroke-linecap="round" />
      <ellipse cx="124" cy="95" rx="4.5" ry="3" fill="#E8823D" />
      <ellipse cx="144" cy="103" rx="6" ry="4" fill="#FFFDF9" stroke="#EFE4D6" stroke-width="0.8" />
      <!-- Tail -->
      <path d="M215 70C230 64 242 70 244 80C246 90 236 98 225 100" stroke="#DF6826" stroke-width="10" stroke-linecap="round" />
      <path d="M232 96C228 98 224 100 220 100" stroke="#FFFDF9" stroke-width="8" stroke-linecap="round" />
      <!-- Zzz -->
      <text x="110" y="36" fill="#DF6826" font-family="sans-serif" font-weight="700" font-size="12" opacity="0.7">z</text>
      <text x="120" y="24" fill="#DF6826" font-family="sans-serif" font-weight="700" font-size="16" opacity="0.4">Z</text>
    </svg>
  </div>
</template>

<style scoped>
.cat-mascot-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
.cat-svg {
  display: block;
}
</style>
