<script setup lang="ts">
import type { Transaction } from '@/types/transaction'
import { t, type Locale } from '@/locales/i18n'
import { formatDineroAmount } from '@/utils/dineroHelpers'
import { useExpenseStore } from '@/stores/expenseStore'
import AnalysisChart from '@/components/AnalysisChart.vue'
import TransactionItem from '@/components/TransactionItem.vue'
import CatMascot from '@/components/CatMascot.vue'
import AppIcon from '@/components/icons/AppIcon.vue'

defineProps<{ locale: Locale }>()

const emit = defineEmits<{
  (e: 'navigate', view: 'all'): void
  (e: 'edit', tx: Transaction): void
  (e: 'delete', id: string): void
  (e: 'open-add-modal'): void
}>()

const store = useExpenseStore()
</script>

<template>
  <div class="dashboard-view">
    <!-- Multi-Currency Overview Cards -->
    <div class="overview-section">
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
              <span class="stat-number tabular-nums">
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
              <span class="stat-number tabular-nums">
                {{ store.totalExpenseByCurrency[curr] ? formatDineroAmount(store.totalExpenseByCurrency[curr]!, locale) : '0' }}
              </span>
            </div>
          </div>
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
        <button type="button" class="btn-primary btn-empty-cta" @click="emit('open-add-modal')">
          <AppIcon name="plus" :size="16" stroke-width="2.5" />
          <span>{{ t('addTx', locale) }}</span>
        </button>
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
}

/* Overview Section */
.overview-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.currency-hero-card {
  background: linear-gradient(180deg, #ffffff 0%, #faf6f0 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.15rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.curr-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.curr-code {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.curr-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
}

.net-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
}

.hero-balance-val {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.hero-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
  margin-top: 0.25rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-light);
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.6rem;
  border-radius: var(--radius-md);
  background: #ffffff;
  border: 1px solid var(--border-light);
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
}

.stat-name {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
}

.stat-number {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
</style>
