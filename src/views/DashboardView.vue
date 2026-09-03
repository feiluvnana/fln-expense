<script setup lang="ts">
import { ref } from 'vue'
import type { Transaction } from '@/types/transaction'
import { t, type Locale } from '@/locales/i18n'
import { formatDineroAmount } from '@/utils/dineroHelpers'
import { useExpenseStore } from '@/stores/expenseStore'
import { useRecurringStore } from '@/stores/recurringStore'
import AnalysisChart from '@/components/AnalysisChart.vue'
import TransactionItem from '@/components/TransactionItem.vue'
import CatMascot from '@/components/CatMascot.vue'
import AppIcon from '@/components/icons/AppIcon.vue'
import { useHorizontalScroll } from '@/utils/useHorizontalScroll'

defineProps<{ locale: Locale }>()

const emit = defineEmits<{
  (e: 'navigate', view: 'all' | 'recurring'): void
  (e: 'edit', tx: Transaction): void
  (e: 'delete', id: string): void
  (e: 'open-add-modal'): void
  (e: 'open-data-modal'): void
}>()

const store = useExpenseStore()
const recurringStore = useRecurringStore()
const activeMobileCurrencyIndex = ref(0)
const overviewContainerRef = ref<HTMLElement | null>(null)
const upcomingContainerRef = ref<HTMLElement | null>(null)

const overviewScroll = useHorizontalScroll(overviewContainerRef, { step: 340 })
const upcomingScroll = useHorizontalScroll(upcomingContainerRef, { step: 260 })

function scrollToCurrency(idx: number) {
  activeMobileCurrencyIndex.value = idx
  if (!overviewContainerRef.value) return
  const cards = overviewContainerRef.value.querySelectorAll('.currency-hero-card')
  if (cards[idx]) {
    cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }
}

function onOverviewScroll() {
  if (!overviewContainerRef.value) return
  const el = overviewContainerRef.value
  const scrollLeft = el.scrollLeft
  const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 12 : el.offsetWidth
  const idx = Math.round(scrollLeft / cardWidth)
  if (idx >= 0 && idx < store.activeCurrencies.length) {
    activeMobileCurrencyIndex.value = idx
  }
}
</script>

<template>
  <div class="dashboard-view">
    <!-- Multi-Currency Overview Cards with Mobile Carousel Support -->
    <div class="overview-wrapper">
      <!-- Top control bar: Mobile switcher & Desktop scroll navigation arrows -->
      <div class="overview-top-bar">
        <!-- Quick Currency Switcher for Mobile when multiple currencies exist -->
        <div v-if="store.activeCurrencies.length > 1" class="mobile-curr-switcher">
          <button
            v-for="(curr, idx) in store.activeCurrencies"
            :key="'tab-' + curr"
            type="button"
            class="curr-tab-btn"
            :class="{ active: activeMobileCurrencyIndex === idx }"
            @click="scrollToCurrency(idx)"
          >
            {{ curr }}
          </button>
        </div>

        <!-- Desktop Scroll Navigation Arrows for Balance Cards -->
        <div
          v-if="store.activeCurrencies.length > 1"
          class="desktop-scroll-arrows"
        >
          <button
            type="button"
            class="scroll-arrow-btn"
            :disabled="!overviewScroll.canScrollLeft.value"
            aria-label="Scroll left"
            @click="overviewScroll.scrollLeft"
          >
            <AppIcon name="chevron-left" :size="15" stroke-width="2.5" />
          </button>
          <button
            type="button"
            class="scroll-arrow-btn"
            :disabled="!overviewScroll.canScrollRight.value"
            aria-label="Scroll right"
            @click="overviewScroll.scrollRight"
          >
            <AppIcon name="chevron-right" :size="15" stroke-width="2.5" />
          </button>
        </div>
      </div>

      <div
        ref="overviewContainerRef"
        class="overview-section"
        @scroll.passive="onOverviewScroll"
      >
        <div
          v-for="curr in store.activeCurrencies"
          :key="'overview-' + curr"
          class="card currency-hero-card"
        >
          <div class="hero-top-row">
            <div class="curr-badge">
              <span class="curr-code">{{ curr }}</span>
              <span class="curr-label">{{ t('netBalance', locale) }}</span>
            </div>
            <span
              v-if="store.netBalanceByCurrency[curr]"
              class="net-badge"
              :class="store.netBalanceByCurrency[curr]!.isNegative ? 'badge-expense' : 'badge-income'"
            >
              {{ store.netBalanceByCurrency[curr]!.isNegative ? '-' : '+' }}
            </span>
          </div>

          <div
            v-if="store.netBalanceByCurrency[curr]"
            class="hero-balance-val tabular-nums"
            :class="store.netBalanceByCurrency[curr]!.isNegative ? 'text-expense' : 'text-income'"
            :title="formatDineroAmount(store.netBalanceByCurrency[curr]!.val, locale)"
          >
            {{ formatDineroAmount(store.netBalanceByCurrency[curr]!.val, locale) }}
          </div>

          <!-- Income & Expense Sub-breakdown -->
          <div class="hero-stats-row">
            <div class="stat-pill stat-income">
              <div class="stat-icon-wrap income">
                <AppIcon name="arrow-up-right" :size="13" stroke-width="2.4" />
              </div>
              <div class="stat-texts">
                <span class="stat-name">{{ t('totalIncome', locale) }}</span>
                <span
                  class="stat-number tabular-nums"
                  :title="store.totalIncomeByCurrency[curr] ? formatDineroAmount(store.totalIncomeByCurrency[curr]!, locale) : '0'"
                >
                  {{ store.totalIncomeByCurrency[curr] ? formatDineroAmount(store.totalIncomeByCurrency[curr]!, locale) : '0' }}
                </span>
              </div>
            </div>

            <div class="stat-pill stat-expense">
              <div class="stat-icon-wrap expense">
                <AppIcon name="arrow-down-right" :size="13" stroke-width="2.4" />
              </div>
              <div class="stat-texts">
                <span class="stat-name">{{ t('totalExpense', locale) }}</span>
                <span
                  class="stat-number tabular-nums"
                  :title="store.totalExpenseByCurrency[curr] ? formatDineroAmount(store.totalExpenseByCurrency[curr]!, locale) : '0'"
                >
                  {{ store.totalExpenseByCurrency[curr] ? formatDineroAmount(store.totalExpenseByCurrency[curr]!, locale) : '0' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Dots for Mobile Carousel -->
      <div v-if="store.activeCurrencies.length > 1" class="mobile-dots-indicator" aria-hidden="true">
        <span
          v-for="(curr, idx) in store.activeCurrencies"
          :key="'dot-' + curr"
          class="dot"
          :class="{ active: activeMobileCurrencyIndex === idx }"
          @click="scrollToCurrency(idx)"
        ></span>
      </div>
    </div>

    <!-- Upcoming Recurring Items Widget -->
    <div v-if="recurringStore.upcomingItems.length" class="card upcoming-recurring-widget">
      <div class="upcoming-header">
        <div class="upcoming-title-group">
          <div class="upcoming-icon-bubble">
            <AppIcon name="repeat" :size="14" stroke-width="2.4" />
          </div>
          <h3 class="upcoming-title">{{ t('upcomingRecurring', locale) }}</h3>
        </div>

        <div class="upcoming-actions-group">
          <!-- Desktop Scroll Navigation Arrows for Upcoming Chips -->
          <div
            v-if="recurringStore.upcomingItems.length > 2"
            class="desktop-scroll-arrows"
          >
            <button
              type="button"
              class="scroll-arrow-btn"
              :disabled="!upcomingScroll.canScrollLeft.value"
              aria-label="Scroll left"
              @click="upcomingScroll.scrollLeft"
            >
              <AppIcon name="chevron-left" :size="14" stroke-width="2.5" />
            </button>
            <button
              type="button"
              class="scroll-arrow-btn"
              :disabled="!upcomingScroll.canScrollRight.value"
              aria-label="Scroll right"
              @click="upcomingScroll.scrollRight"
            >
              <AppIcon name="chevron-right" :size="14" stroke-width="2.5" />
            </button>
          </div>

          <button
            type="button"
            class="btn-view-all"
            @click="emit('navigate', 'recurring')"
          >
            <span>{{ t('viewAll', locale) }}</span>
            <AppIcon name="arrow-right" :size="13" stroke-width="2.2" />
          </button>
        </div>
      </div>

      <div ref="upcomingContainerRef" class="upcoming-chips-row">
        <div
          v-for="rec in recurringStore.upcomingItems"
          :key="'dash-rec-' + rec.id"
          class="upcoming-mini-chip"
          role="button"
          tabindex="0"
          :title="t('recurringTitle', locale)"
          @click="emit('navigate', 'recurring')"
        >
          <div class="mini-status-dot" :class="rec.type"></div>
          <div class="mini-rec-text">
            <span class="mini-name">{{ rec.name }}</span>
            <span class="mini-due">{{ t('dayOfMonth', locale).replace('{day}', String(rec.dueDay)) }}</span>
          </div>
          <span class="mini-amt tabular-nums" :class="rec.type === 'income' ? 'text-income' : 'text-expense'">
            {{ rec.type === 'income' ? '+' : '-' }}{{ formatDineroAmount(rec.amount, locale) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Analysis Graph -->
    <AnalysisChart :transactions="store.transactions" :locale="locale" />

    <!-- Recent Transactions -->
    <div class="card recent-section">
      <div class="recent-header">
        <div class="recent-title-group">
          <h3 class="recent-title">{{ t('recentTx', locale) }}</h3>
          <span v-if="store.transactions.length" class="records-count">
            {{ store.transactions.length }} {{ t('totalRecords', locale).toLowerCase() }}
          </span>
        </div>
        <button
          v-if="store.transactions.length"
          type="button"
          class="btn-view-all"
          @click="emit('navigate', 'all')"
        >
          <span>{{ t('viewAll', locale) }}</span>
          <AppIcon name="arrow-right" :size="14" stroke-width="2.2" />
        </button>
      </div>

      <!-- Empty State with Sleeping Cat Mascot -->
      <div v-if="!store.recentTransactions.length" class="empty-state-wrap">
        <CatMascot :size="140" variant="sleeping" />
        <p class="empty-text">{{ t('emptyState', locale) }}</p>
        <div class="empty-actions">
          <button type="button" class="btn-primary" @click="emit('open-add-modal')">
            <AppIcon name="plus" :size="16" stroke-width="2.5" />
            <span>{{ t('addTx', locale) }}</span>
          </button>
          <button type="button" class="btn-secondary" @click="emit('open-data-modal')">
            <AppIcon name="database" :size="16" stroke-width="2.2" />
            <span>{{ t('loadSampleData', locale) }}</span>
          </button>
        </div>
      </div>

      <!-- Recent List -->
      <div v-else class="recent-list">
        <TransactionItem
          v-for="tx in store.recentTransactions"
          :key="tx.id"
          :tx="tx"
          :locale="locale"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

/* Overview Section */
.overview-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.overview-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: 0.5rem;
}

.desktop-scroll-arrows {
  display: none;
  align-items: center;
  gap: 0.35rem;
}

@media (min-width: 860px) {
  .desktop-scroll-arrows {
    display: flex;
  }
}

.scroll-arrow-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-pill);
  background: var(--surface-warm);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.scroll-arrow-btn:hover:not(:disabled) {
  background: var(--surface-hover);
  color: var(--primary);
  border-color: var(--primary);
  transform: scale(1.05);
}

.scroll-arrow-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.mobile-curr-switcher {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.2rem;
  border-radius: var(--radius-pill);
  align-self: flex-start;
}

.curr-tab-btn {
  border: none;
  background: transparent;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.12s ease;
}

.curr-tab-btn.active {
  background: #ffffff;
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(58, 41, 30, 0.08);
}

.mobile-dots-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.35rem;
  padding-top: 0.25rem;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-pill);
  background: #d8cbbe;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dot.active {
  width: 16px;
  background: var(--primary);
}

.overview-section {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 0.85rem;
  padding: 0.2rem 0.1rem 0.6rem;
  scrollbar-width: none;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  cursor: grab;
  user-select: none;
  overscroll-behavior-x: contain;
}

.overview-section:active {
  cursor: grabbing;
}

.overview-section::-webkit-scrollbar {
  display: none;
}

.currency-hero-card {
  flex: 0 0 320px;
  width: 320px;
  min-width: 320px;
  scroll-snap-align: start;
  background: linear-gradient(180deg, #ffffff 0%, #faf6f0 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 0.95rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

@media (max-width: 360px) {
  .currency-hero-card {
    flex: 0 0 285px;
    width: 285px;
    min-width: 285px;
    padding: 0.85rem 0.95rem;
  }
}

@media (min-width: 860px) {
  .mobile-curr-switcher,
  .mobile-dots-indicator {
    display: none;
  }

  .overview-section {
    scroll-snap-type: none;
    gap: 1.15rem;
    padding-bottom: 0.6rem;
  }

  .currency-hero-card {
    flex: 0 0 340px;
    width: 340px;
    min-width: 340px;
    padding: 1.15rem 1.25rem;
    gap: 0.75rem;
  }
}

.hero-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
  gap: 0.5rem;
}

.curr-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.curr-code {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.curr-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.net-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
  flex-shrink: 0;
}

.hero-balance-val {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  white-space: nowrap;
}

@media (min-width: 860px) {
  .hero-balance-val {
    font-size: 1.75rem;
  }
}

.hero-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.15rem;
  padding-top: 0.55rem;
  border-top: 1px solid var(--border-light);
}

@media (min-width: 860px) {
  .hero-stats-row {
    gap: 0.65rem;
    margin-top: 0.25rem;
    padding-top: 0.75rem;
  }
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.55rem;
  border-radius: var(--radius-md);
  background: #ffffff;
  border: 1px solid var(--border-light);
  min-width: 0;
}

.stat-icon-wrap {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-pill);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrap.income {
  background: var(--income-bg);
  color: var(--income);
}

.stat-icon-wrap.expense {
  background: var(--expense-bg);
  color: var(--expense);
}

.stat-texts {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.stat-name {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-number {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}

/* Recent Section */
.recent-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recent-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recent-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.records-count {
  font-size: 0.75rem;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.1rem 0.45rem;
  border-radius: var(--radius-pill);
  font-weight: 500;
}

.btn-view-all {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: background 0.15s ease, color 0.15s ease;
}

.btn-view-all:hover {
  background: var(--primary-light);
  color: var(--primary-hover);
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

/* Empty State */
.empty-state-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 2.2rem 1rem;
  text-align: center;
}

.empty-text {
  color: var(--text-muted);
  font-size: 0.9rem;
  max-width: 320px;
  line-height: 1.45;
}

.btn-empty-cta {
  margin-top: 0.35rem;
}

.empty-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

/* Upcoming Recurring Widget */
.upcoming-recurring-widget {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 0.85rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
}

.upcoming-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: 0.5rem;
}

.upcoming-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.upcoming-actions-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upcoming-icon-bubble {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-pill);
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.upcoming-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  white-space: nowrap;
}

.upcoming-chips-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.65rem;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding: 0.2rem 0.1rem 0.4rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  cursor: grab;
  user-select: none;
  overscroll-behavior-x: contain;
}

.upcoming-chips-row:active {
  cursor: grabbing;
}

.upcoming-chips-row::-webkit-scrollbar {
  display: none;
}

.upcoming-mini-chip {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.upcoming-mini-chip:hover {
  background: var(--surface-hover);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.mini-status-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-pill);
  flex-shrink: 0;
}

.mini-status-dot.expense {
  background: var(--expense);
}

.mini-status-dot.income {
  background: var(--income);
}

.mini-rec-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.mini-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}

.mini-due {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.mini-amt {
  font-size: 0.85rem;
  font-weight: 700;
  font-family: var(--font-mono);
  white-space: nowrap;
  margin-left: 0.25rem;
}
</style>
