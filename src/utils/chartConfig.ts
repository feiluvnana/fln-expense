import { Chart, registerables, type ChartConfiguration } from 'chart.js'
import type { Transaction } from '@/types/transaction'
import { t, tCategory, tSubcategory, type Locale } from '@/locales/i18n'
import { getDineroDecimalNumber } from './dineroHelpers'

Chart.register(...registerables)

// Warm feline sanctuary palette (inspired by ginger cat image.png)
const FELINE_PALETTE = [
  '#E06828', // Ginger Amber
  '#F59E0B', // Honey Gold
  '#10B981', // Bamboo Sage
  '#EA580C', // Terracotta Persimmon
  '#D97706', // Warm Caramel
  '#8B5CF6', // Dusty Lavender
  '#F43F5E', // Rose
  '#0D9488', // Sky Teal
  '#78716C', // Warm Slate
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#14B8A6', // Teal
]

const COMMON_TOOLTIP = {
  backgroundColor: '#28211D',
  titleColor: '#FFFFFF',
  bodyColor: '#F5EDE4',
  padding: 10,
  cornerRadius: 8,
  boxPadding: 4,
}

export function getCategoryChartConfig(
  txs: Transaction[],
  locale: Locale,
  currencyFilter?: string,
): ChartConfiguration<'doughnut'> {
  let filtered = txs.filter((t) => t.category.type === 'expense')
  if (currencyFilter && currencyFilter !== 'all') {
    filtered = filtered.filter((t) => t.amount.toJSON().currency.code === currencyFilter)
  }

  const map = new Map<string, number>()
  for (const tx of filtered) {
    const v = getDineroDecimalNumber(tx.amount)
    map.set(tx.category.name, (map.get(tx.category.name) || 0) + v)
  }

  const labels = Array.from(map.keys()).map((k) => tCategory(k, locale))
  const data = Array.from(map.values())

  return {
    type: 'doughnut',
    data: {
      labels: labels.length ? labels : [t('emptyState', locale)],
      datasets: [
        {
          data: data.length ? data : [1],
          backgroundColor: labels.length ? FELINE_PALETTE : ['#E7DDD3'],
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 11 },
            color: '#574B44',
            padding: 14,
          },
        },
        tooltip: COMMON_TOOLTIP,
      },
    },
  }
}

export function getSubcategoryChartConfig(
  txs: Transaction[],
  locale: Locale,
  currencyFilter?: string,
): ChartConfiguration<'doughnut'> {
  let filtered = txs.filter((t) => t.category.type === 'expense')
  if (currencyFilter && currencyFilter !== 'all') {
    filtered = filtered.filter((t) => t.amount.toJSON().currency.code === currencyFilter)
  }

  const map = new Map<string, { total: number; parentCat: string }>()
  for (const tx of filtered) {
    const sub = tx.category.subcategory
    const v = getDineroDecimalNumber(tx.amount)
    const existing = map.get(sub)
    if (existing) {
      existing.total += v
    } else {
      map.set(sub, { total: v, parentCat: tx.category.name })
    }
  }

  const keys = Array.from(map.keys())
  const labels = keys.map((k) => {
    const item = map.get(k)!
    return `${tSubcategory(k, locale)} (${tCategory(item.parentCat, locale)})`
  })
  const data = keys.map((k) => map.get(k)!.total)

  return {
    type: 'doughnut',
    data: {
      labels: labels.length ? labels : [t('emptyState', locale)],
      datasets: [
        {
          data: data.length ? data : [1],
          backgroundColor: labels.length ? FELINE_PALETTE : ['#E7DDD3'],
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '64%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 11 },
            color: '#574B44',
            padding: 12,
          },
        },
        tooltip: COMMON_TOOLTIP,
      },
    },
  }
}

export function getComparisonChartConfig(
  txs: Transaction[],
  locale: Locale,
): ChartConfiguration<'bar'> {
  let inc = 0
  let exp = 0
  for (const tx of txs) {
    const v = getDineroDecimalNumber(tx.amount)
    if (tx.category.type === 'income') inc += v
    else exp += v
  }

  return {
    type: 'bar',
    data: {
      labels: [t('income', locale), t('expense', locale)],
      datasets: [
        {
          data: [inc, exp],
          backgroundColor: ['#10B981', '#EA580C'],
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 36,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: COMMON_TOOLTIP,
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 12, weight: 600 },
            color: '#574B44',
          },
        },
        y: {
          grid: { color: '#F0E7DD' },
          ticks: {
            font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 11 },
            color: '#807269',
          },
        },
      },
    },
  }
}

export function getCurrencyChartConfig(txs: Transaction[]): ChartConfiguration<'pie'> {
  const counts: Record<string, number> = { VND: 0, JPY: 0, USD: 0 }
  for (const tx of txs) {
    const code = tx.amount.toJSON().currency.code
    counts[code] = (counts[code] || 0) + 1
  }

  return {
    type: 'pie',
    data: {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: ['#E06828', '#F59E0B', '#10B981'],
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', size: 11 },
            color: '#574B44',
            padding: 14,
          },
        },
        tooltip: COMMON_TOOLTIP,
      },
    },
  }
}
