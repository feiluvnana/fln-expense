<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { Chart, type ChartConfiguration } from 'chart.js'
import type { Transaction, SupportedCurrencyCode } from '@/types/transaction'
import { t, type Locale } from '@/locales/i18n'
import {
  getCategoryChartConfig,
  getSubcategoryChartConfig,
  getComparisonChartConfig,
  getCurrencyChartConfig,
} from '@/utils/chartConfig'
import AppIcon from '@/components/icons/AppIcon.vue'

const props = defineProps<{
  transactions: Transaction[]
  locale: Locale
}>()

type Mode = 'category' | 'subcategory' | 'comparison' | 'currency'
const mode = ref<Mode>('category')
const selectedCurrency = ref<string>('all')
const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const activeCurrencies = computed<SupportedCurrencyCode[]>(() => {
  const set = new Set<SupportedCurrencyCode>()
  for (const tx of props.transactions) {
    set.add(tx.amount.toJSON().currency.code as SupportedCurrencyCode)
  }
  return Array.from(set)
})

function renderChart() {
  if (!canvasRef.value) return
  if (chartInstance) chartInstance.destroy()

  let cfg: ChartConfiguration
  if (mode.value === 'category') {
    cfg = getCategoryChartConfig(props.transactions, props.locale, selectedCurrency.value)
  } else if (mode.value === 'subcategory') {
    cfg = getSubcategoryChartConfig(props.transactions, props.locale, selectedCurrency.value)
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
  [mode, selectedCurrency, () => props.transactions, () => props.locale],
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
          :class="{ active: mode === 'subcategory' }"
          @click="mode = 'subcategory'"
        >
          <AppIcon name="filter" :size="13" stroke-width="2.2" />
          <span>{{ t('modeSubcategory', locale) }}</span>
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

    <!-- Currency Filter Pills (Shown when in Category or Subcategory breakdown with multiple currencies) -->
    <div
      v-if="(mode === 'category' || mode === 'subcategory') && activeCurrencies.length > 1"
      class="chart-currency-filter"
    >
      <span class="curr-filter-label">{{ t('filterCurrency', locale) }}:</span>
      <div class="curr-filter-pills">
        <button
          type="button"
          class="curr-filter-pill"
          :class="{ active: selectedCurrency === 'all' }"
          @click="selectedCurrency = 'all'"
        >
          {{ t('allCurrencies', locale) }}
        </button>
        <button
          v-for="curr in activeCurrencies"
          :key="'chart-curr-' + curr"
          type="button"
          class="curr-filter-pill tabular-nums"
          :class="{ active: selectedCurrency === curr }"
          @click="selectedCurrency = curr"
        >
          {{ curr }}
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

.chart-currency-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.1rem 0;
}

.curr-filter-label {
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--text-muted);
}

.curr-filter-pills {
  display: flex;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.15rem;
  border-radius: var(--radius-pill);
  gap: 0.15rem;
}

.curr-filter-pill {
  border: none;
  background: transparent;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.12s ease;
}

.curr-filter-pill:hover {
  color: var(--text);
}

.curr-filter-pill.active {
  background: #ffffff;
  color: var(--primary);
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(58, 41, 30, 0.08);
}

.chart-container {
  position: relative;
  height: 230px;
  width: 100%;
}
</style>
