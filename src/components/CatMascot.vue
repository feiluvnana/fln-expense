<script setup lang="ts">
import { computed } from 'vue'
import {
  MASCOT_ARTWORK,
  type MascotVariant,
} from '@/components/mascotSprites'

const props = withDefaults(
  defineProps<{
    /** Size budget in px (width, aspect ratio is preserved). */
    size?: number
    variant?: MascotVariant
    /** Set to announce the mascot; left empty it stays decorative. */
    label?: string
  }>(),
  {
    size: 32,
    variant: 'avatar',
    label: '',
  },
)

const artwork = computed(() => MASCOT_ARTWORK[props.variant])

const width = computed(() => props.size)
const height = computed(() =>
  Math.round(props.size * (artwork.value.height / artwork.value.width)),
)
</script>

<template>
  <div
    class="cat-mascot-wrap"
    :class="`variant-${variant}`"
    :style="{ width: `${width}px`, height: `${height}px` }"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <picture class="cat-mascot-picture">
      <source :srcset="artwork.webp" type="image/webp" />
      <img
        :src="artwork.png"
        :alt="label || artwork.alt"
        :width="width"
        :height="height"
        class="cat-mascot-img"
        loading="lazy"
        draggable="false"
      />
    </picture>

    <!-- Floating animated sleep marks for the sleeping variant -->
    <div v-if="variant === 'sleeping'" class="cat-mascot-zzz-layer" aria-hidden="true">
      <span class="cat-zzz zzz-1">z</span>
      <span class="cat-zzz zzz-2">z</span>
      <span class="cat-zzz zzz-3">Z</span>
    </div>
  </div>
</template>

<style scoped>
.cat-mascot-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  flex-shrink: 0;
}

.cat-mascot-picture {
  display: flex;
  width: 100%;
  height: 100%;
}

.cat-mascot-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  image-rendering: auto;
}

/* Subtle peaceful breathing when sleeping */
.variant-sleeping .cat-mascot-img {
  transform-origin: 50% 85%;
  animation: cat-breathe 4s ease-in-out infinite;
}

@keyframes cat-breathe {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.02) translateY(-0.5px);
  }
}

/* Floating animated Zzz layer */
.cat-mascot-zzz-layer {
  position: absolute;
  top: -12%;
  left: 12%;
  width: 36%;
  height: 40%;
  pointer-events: none;
}

.cat-zzz {
  position: absolute;
  font-family: var(--font-display, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  font-weight: 800;
  color: var(--primary, #df6826);
  opacity: 0;
  text-shadow: 0 1px 2px rgba(223, 104, 38, 0.18);
  animation: cat-zzz-float 3.6s ease-out infinite;
}

.zzz-1 {
  font-size: 0.7rem;
  bottom: 12%;
  left: 10%;
  animation-delay: 0s;
}

.zzz-2 {
  font-size: 0.85rem;
  bottom: 38%;
  left: 35%;
  animation-delay: 1.2s;
}

.zzz-3 {
  font-size: 1.05rem;
  bottom: 64%;
  left: 65%;
  animation-delay: 2.4s;
}

@keyframes cat-zzz-float {
  0% {
    opacity: 0;
    transform: translate(0, 4px) scale(0.85);
  }
  20% {
    opacity: 0.85;
  }
  55% {
    opacity: 0.75;
    transform: translate(3px, -6px) scale(1.02);
  }
  85%,
  100% {
    opacity: 0;
    transform: translate(6px, -14px) scale(1.15);
  }
}

@media (prefers-reduced-motion: reduce) {
  .variant-sleeping .cat-mascot-img,
  .cat-zzz {
    animation: none;
    opacity: 0.7;
    transform: none;
  }
}
</style>
