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
      <!-- Warm ginger head background circle -->
      <circle cx="24" cy="24" r="22" fill="#FAF2E8" stroke="#F1DCC9" stroke-width="1.5" />

      <!-- Ginger ears -->
      <path d="M12 21L15 8L23 15" fill="#E27432" />
      <path d="M15 17L17 11L21 15" fill="#FBBF94" />
      <path d="M36 21L33 8L25 15" fill="#E27432" />
      <path d="M33 17L31 11L27 15" fill="#FBBF94" />

      <!-- Head shape -->
      <path
        d="M12 24C12 17.5 17.5 12 24 12C30.5 12 36 17.5 36 24C36 30.5 30.5 35 24 35C17.5 35 12 30.5 12 24Z"
        fill="#E8823D"
      />

      <!-- Tabby markings on forehead -->
      <path d="M24 14V19" stroke="#C9601F" stroke-width="1.5" stroke-linecap="round" />
      <path d="M20 15L21.5 19" stroke="#C9601F" stroke-width="1.2" stroke-linecap="round" />
      <path d="M28 15L26.5 19" stroke="#C9601F" stroke-width="1.2" stroke-linecap="round" />

      <!-- White muzzle & cheeks (like the cat in public/image.png) -->
      <path
        d="M15 25C15 22.5 17.5 21 21 21C22.5 21 23.5 21.8 24 22.5C24.5 21.8 25.5 21 27 21C30.5 21 33 22.5 33 25C33 29 29.5 33 24 33C18.5 33 15 29 15 25Z"
        fill="#FFFDF9"
      />

      <!-- Sleeping Eyes (curved peaceful arcs) -->
      <path
        d="M18 23C19 21.5 21 21.5 22 23"
        stroke="#523927"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <path
        d="M26 23C27 21.5 29 21.5 30 23"
        stroke="#523927"
        stroke-width="1.6"
        stroke-linecap="round"
      />

      <!-- Sweet pink nose -->
      <polygon points="24,25 22.8,26.6 25.2,26.6" fill="#F8719D" />

      <!-- Cat mouth lines -->
      <path
        d="M24 26.6V28M24 28C23.2 28.8 21.8 28.8 21 28M24 28C24.8 28.8 26.2 28.8 27 28"
        stroke="#523927"
        stroke-width="1.2"
        stroke-linecap="round"
      />

      <!-- Cute paw peeking -->
      <circle cx="34" cy="34" r="5" fill="#FFFDF9" stroke="#F1DCC9" stroke-width="1" />
      <circle cx="33" cy="33" r="1.5" fill="#FBBF94" />
    </svg>

    <!-- Sleeping Variant (For Empty States & Cozy Headers) -->
    <svg
      v-else-if="variant === 'sleeping'"
      :width="size"
      :height="size * 0.65"
      viewBox="0 0 200 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="cat-svg"
      aria-hidden="true"
    >
      <!-- Soft floor/cushion shadow -->
      <ellipse cx="100" cy="112" rx="75" ry="12" fill="#F0E3D3" opacity="0.7" />

      <!-- Cozy curled body (chubby ginger cat curled sleeping) -->
      <!-- Tail -->
      <path
        d="M48 85C38 82 25 90 28 102C31 112 45 110 60 105"
        stroke="#E27432"
        stroke-width="13"
        stroke-linecap="round"
      />
      <!-- Tail white tip -->
      <path
        d="M28 102C29 107 36 108 42 107"
        stroke="#FFFDF9"
        stroke-width="11"
        stroke-linecap="round"
      />

      <!-- Chubby main body (Ginger back & rump) -->
      <path
        d="M52 92C42 75 52 50 78 44C108 37 142 42 158 60C170 74 165 96 148 104C128 113 72 110 52 92Z"
        fill="#E8823D"
      />

      <!-- Tabby stripes across back (just like the real photo) -->
      <path d="M85 45C86 52 83 60 80 66" stroke="#C9601F" stroke-width="3" stroke-linecap="round" />
      <path
        d="M102 42C103 51 99 62 96 70"
        stroke="#C9601F"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M120 44C120 53 118 63 115 72"
        stroke="#C9601F"
        stroke-width="3"
        stroke-linecap="round"
      />
      <path
        d="M138 50C137 58 135 67 132 74"
        stroke="#C9601F"
        stroke-width="3"
        stroke-linecap="round"
      />

      <!-- Creamy white belly and chest -->
      <path
        d="M80 82C95 78 120 78 138 86C148 91 144 103 132 106C112 110 75 108 70 96C68 92 73 85 80 82Z"
        fill="#FFFDF9"
      />

      <!-- Sleeping Cat Head (resting comfortably on paw) -->
      <!-- Ears -->
      <path d="M142 54L152 32L162 48" fill="#E27432" />
      <path d="M146 50L152 38L158 46" fill="#FBBF94" />
      <path d="M165 60L180 44L178 65" fill="#E27432" />
      <path d="M168 59L176 48L175 63" fill="#FBBF94" />

      <!-- Head circle -->
      <circle cx="155" cy="68" r="22" fill="#E8823D" />

      <!-- White muzzle -->
      <path
        d="M148 70C148 64 154 62 162 64C168 65 174 72 172 78C170 85 158 87 152 83C149 80 148 75 148 70Z"
        fill="#FFFDF9"
      />

      <!-- Tabby mark on forehead -->
      <path d="M150 50L153 57" stroke="#C9601F" stroke-width="2" stroke-linecap="round" />
      <path d="M156 50L157 58" stroke="#C9601F" stroke-width="2" stroke-linecap="round" />

      <!-- Sleeping Eyes -->
      <path
        d="M153 67C155 64 159 64 161 67"
        stroke="#452D1C"
        stroke-width="2.2"
        stroke-linecap="round"
      />

      <!-- Sweet pink nose -->
      <polygon points="166,73 163,76 168,76" fill="#F8719D" />

      <!-- White front paws tucked together -->
      <ellipse cx="140" cy="98" rx="9" ry="6" fill="#FFFDF9" stroke="#EFE5D8" stroke-width="1" />
      <ellipse cx="155" cy="96" rx="9" ry="6" fill="#FFFDF9" stroke="#EFE5D8" stroke-width="1" />
      <!-- Paw beans / lines -->
      <line
        x1="138"
        y1="96"
        x2="138"
        y2="100"
        stroke="#F1D8C4"
        stroke-width="1.2"
        stroke-linecap="round"
      />
      <line
        x1="153"
        y1="94"
        x2="153"
        y2="98"
        stroke="#F1D8C4"
        stroke-width="1.2"
        stroke-linecap="round"
      />

      <!-- "Zzz" sleep particles floating gently -->
      <text
        x="178"
        y="42"
        fill="#DF6826"
        font-family="sans-serif"
        font-weight="700"
        font-size="12"
        opacity="0.8"
      >
        z
      </text>
      <text
        x="186"
        y="32"
        fill="#DF6826"
        font-family="sans-serif"
        font-weight="700"
        font-size="15"
        opacity="0.6"
      >
        z
      </text>
      <text
        x="194"
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
