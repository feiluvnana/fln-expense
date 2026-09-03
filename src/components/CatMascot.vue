<script setup lang="ts">
import { computed } from 'vue'
import {
  MASCOT_SPRITES,
  SLEEP_MARKS,
  spriteRuns,
  type MascotVariant,
} from '@/components/mascotSprites'

const props = withDefaults(
  defineProps<{
    /** Width budget in px. The render snaps down to a whole multiple of the sprite grid. */
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

const sprite = computed(() => MASCOT_SPRITES[props.variant])

// Pixel art earns its crispness from whole pixels: a 16-wide sprite asked for
// 34px renders at 32, not at 2.125 units per cell.
const scale = computed(() => Math.max(1, Math.floor(props.size / sprite.value.w)))
const width = computed(() => sprite.value.w * scale.value)
const height = computed(() => sprite.value.h * scale.value)

const runs = computed(() => spriteRuns(sprite.value))

const sleepMarks = computed(() => {
  if (props.variant !== 'sleeping') return []
  return SLEEP_MARKS.map((mark) => ({
    delay: mark.delay,
    runs: spriteRuns(mark.sprite).map((run) => ({
      ...run,
      x: run.x + mark.x,
      y: run.y + mark.y,
    })),
  }))
})
</script>

<template>
  <svg
    class="cat-mascot"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${sprite.w} ${sprite.h}`"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      v-for="(run, i) in runs"
      :key="i"
      :x="run.x"
      :y="run.y"
      :width="run.w"
      height="1"
      :fill="run.fill"
    />
    <g
      v-for="(mark, m) in sleepMarks"
      :key="`zzz-${m}`"
      class="cat-mascot-zzz"
      :style="{ animationDelay: mark.delay }"
    >
      <rect
        v-for="(run, i) in mark.runs"
        :key="i"
        :x="run.x"
        :y="run.y"
        :width="run.w"
        height="1"
        :fill="run.fill"
      />
    </g>
  </svg>
</template>

<style scoped>
.cat-mascot {
  display: block;
  shape-rendering: crispEdges;
}

/* One authored moment: the sleep marks rise a pixel at a time, the cat lies still. */
.cat-mascot-zzz {
  animation: cat-mascot-drift 4.2s steps(1, end) infinite;
}

@keyframes cat-mascot-drift {
  0%,
  12% {
    transform: translateY(2px);
    opacity: 0;
  }
  24% {
    transform: translateY(1px);
    opacity: 1;
  }
  56% {
    transform: translateY(0);
    opacity: 1;
  }
  76% {
    transform: translateY(-1px);
    opacity: 0.5;
  }
  88%,
  100% {
    transform: translateY(-2px);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cat-mascot-zzz {
    animation: none;
  }
}
</style>
