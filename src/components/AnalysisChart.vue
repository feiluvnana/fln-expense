<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Chart, type ChartConfiguration } from 'chart.js'
import type { Transaction } from '@/types/transaction'
import { t, type Locale } from '@/locales/i18n'
import {
  getCategoryChartConfig,
  getComparisonChartConfig,
  getCurrencyChartConfig,
} from '@/utils/chartConfig'
import AppIcon from '@/components/icons/AppIcon.vue'

const props = defineProps<{
  transactions: Transaction[]
  locale: Locale
}>()

type Mode = 'category' | 'comparison' | 'currency'
const mode = ref<Mode>('category')
const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function renderChart() {
  if (!canvasRef.value) return
  if (chartInstance) chartInstance.destroy()

  let cfg: ChartConfiguration
  if (mode.value === 'category') {
    cfg = getCategoryChartConfig(props.transactions, props.locale)
  } else if (mode.value === 'comparison') {
    cfg = getComparisonChartConfig(props.transactions, props.locale)
  } else {
    cfg = getCurrencyChartConfig(props.transactions)
  }

  chartInstance = new Chart(canvasRef.value, cfg)
}

onMounted(() => renderChart())
onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})

watch(
  [mode, () => props.transactions, () => props.locale],
  () => renderChart(),
  { deep: true },
)
</script>

<template>
  <div class="card chart-card">
    <div class="chart-header">
      <div class="header-left">
        <h3 class="chart-title">{{ t('analysis', locale) }}</h3>
      </div>

      <div class="mode-pills" role="radiogroup">
        <button
          type="button"
          class="mode-btn"
          :class="{ active: mode === 'category' }"
          @click="mode = 'category'"
        >
          <AppIcon name="chart-pie" :size="13" stroke-width="2.2" />
          <span>{{ t('modeCategory', locale) }}</span>
        </button>
        <button
          type="button"
          class="mode-btn"
          :class="{ active: mode === 'comparison' }"
          @click="mode = 'comparison'"
        >
          <AppIcon name="chart-bar" :size="13" stroke-width="2.2" />
          <span>{{ t('modeComparison', locale) }}</span>
        </button>
        <button
          type="button"
          class="mode-btn"
          :class="{ active: mode === 'currency' }"
          @click="mode = 'currency'"
        >
          <AppIcon name="receipt" :size="13" stroke-width="2.2" />
          <span>{{ t('modeCurrency', locale) }}</span>
        </button>
      </div>
    </div>

    <div class="chart-container">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<style scoped>
.chart-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.mode-pills {
  display: flex;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.2rem;
  border-radius: var(--radius-pill);
  gap: 0.2rem;
}

.mode-btn {
  border: none;
  background: transparent;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-pill);
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.15s ease;
}

.mode-btn:hover {
  color: var(--text);
}

.mode-btn.active {
  background: #ffffff;
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(58, 41, 30, 0.08);
}

.chart-container {
  position: relative;
  height: 230px;
  width: 100%;
}
</style>
