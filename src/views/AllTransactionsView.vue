<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Transaction, TransactionType } from '@/types/transaction'
import { t, tCategory, tSubcategory, type Locale } from '@/locales/i18n'
import { groupTransactionsByDate } from '@/utils/dateHelpers'
import { useExpenseStore } from '@/stores/expenseStore'
import TransactionItem from '@/components/TransactionItem.vue'
import CatMascot from '@/components/CatMascot.vue'
import AppIcon from '@/components/icons/AppIcon.vue'

const props = defineProps<{ locale: Locale }>()
const emit = defineEmits<{
  (e: 'navigate', view: 'dashboard'): void
  (e: 'edit', tx: Transaction): void
  (e: 'delete', id: string): void
  (e: 'open-add-modal'): void
}>()

const store = useExpenseStore()

const filterType = ref<'all' | TransactionType>('all')
const searchQuery = ref('')

const filteredTransactions = computed(() => {
  let list = store.transactions
  if (filterType.value !== 'all') {
    list = list.filter((tx) => tx.category.type === filterType.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter((tx) => {
      const cat = tCategory(tx.category.name, props.locale).toLowerCase()
      const sub = tSubcategory(tx.category.subcategory, props.locale).toLowerCase()
      const id = tx.id.toLowerCase()
      return cat.includes(q) || sub.includes(q) || id.includes(q)
    })
  }
  return list
})

const groupedTransactions = computed(() => {
  return groupTransactionsByDate(filteredTransactions.value, props.locale)
})
</script>

<template>
  <div class="all-tx-view">
    <!-- View Top Bar -->
    <div class="view-header">
      <div class="header-left">
        <button
          type="button"
          class="btn-back"
          :aria-label="t('dashboard', locale)"
          @click="emit('navigate', 'dashboard')"
        >
          <AppIcon name="back" :size="16" stroke-width="2.4" />
          <span>{{ t('dashboard', locale) }}</span>
        </button>
        <h2 class="view-title">{{ t('allTransactions', locale) }}</h2>
      </div>

      <!-- Type Filter Segmented Control -->
      <div class="filter-pills" role="radiogroup">
        <button
          type="button"
          class="filter-btn"
          :class="{ active: filterType === 'all' }"
          @click="filterType = 'all'"
        >
          {{ t('all', locale) }}
        </button>
        <button
          type="button"
          class="filter-btn"
          :class="{ active: filterType === 'expense' }"
          @click="filterType = 'expense'"
        >
          {{ t('expense', locale) }}
        </button>
        <button
          type="button"
          class="filter-btn"
          :class="{ active: filterType === 'income' }"
          @click="filterType = 'income'"
        >
          {{ t('income', locale) }}
        </button>
      </div>
    </div>

    <!-- Search Input Bar -->
    <div class="search-bar">
      <AppIcon name="search" :size="16" stroke-width="2" class="search-icon" />
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('searchPlaceholder', locale)"
        class="search-input"
      />
      <button
        v-if="searchQuery"
        type="button"
        class="clear-search-btn"
        aria-label="Clear search"
        @click="searchQuery = ''"
      >
        <AppIcon name="close" :size="14" stroke-width="2.2" />
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!groupedTransactions.length" class="card empty-state-card">
      <CatMascot :size="140" variant="sleeping" />
      <p class="empty-msg">
        {{ searchQuery || filterType !== 'all' ? t('emptyFilter', locale) : t('emptyState', locale) }}
      </p>
      <button
        v-if="!searchQuery && filterType === 'all'"
        type="button"
        class="btn-primary"
        @click="emit('open-add-modal')"
      >
        <AppIcon name="plus" :size="16" stroke-width="2.5" />
        <span>{{ t('addTx', locale) }}</span>
      </button>
    </div>

    <!-- Groups of Transactions -->
    <div v-else class="groups-container">
      <div v-for="group in groupedTransactions" :key="group.dateKey" class="date-group">
        <div class="date-header">
          <div class="date-tag">
            <AppIcon name="calendar" :size="14" stroke-width="2" />
            <span class="date-label">{{ group.label }}</span>
          </div>
          <span class="date-count">{{ group.transactions.length }}</span>
        </div>

        <div class="group-items">
          <TransactionItem
            v-for="tx in group.transactions"
            :key="tx.id"
            :tx="tx"
            :locale="locale"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.all-tx-view {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.btn-back {
  background: var(--surface-warm);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  font-size: 0.82rem;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-pill);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.15s ease;
}

.btn-back:hover {
  background: var(--surface-hover);
  color: var(--text);
  border-color: #d1c3b5;
}

.filter-pills {
  display: flex;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.2rem;
  border-radius: var(--radius-pill);
  gap: 0.2rem;
}

.filter-btn {
  border: none;
  background: transparent;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.15s ease;
}

.filter-btn:hover {
  color: var(--text);
}

.filter-btn.active {
  background: #ffffff;
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(58, 41, 30, 0.08);
}

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.85rem;
  gap: 0.5rem;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-bar:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.9rem;
  color: var(--text);
}

.search-input::placeholder {
  color: var(--text-subtle);
}

.clear-search-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border-radius: 4px;
}

.clear-search-btn:hover {
  color: var(--text);
}

/* Groups */
.groups-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.25rem;
}

.date-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.date-count {
  font-size: 0.74rem;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 0.08rem 0.5rem;
  color: var(--text-muted);
  font-weight: 600;
}

.group-items {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

/* Empty State Card */
.empty-state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 2.5rem 1rem;
  text-align: center;
}

.empty-msg {
  color: var(--text-muted);
  font-size: 0.9rem;
  max-width: 320px;
  line-height: 1.45;
}
</style>
