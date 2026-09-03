<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Locale } from '@/locales/i18n'
import { t, tCategory, tSubcategory } from '@/locales/i18n'
import { useRecurringStore, type RecurringPayload } from '@/stores/recurringStore'
import type { RecurringItem } from '@/types/recurring'
import type { TransactionType } from '@/types/transaction'
import { formatDineroAmount } from '@/utils/dineroHelpers'
import AppIcon from '@/components/icons/AppIcon.vue'
import CatMascot from '@/components/CatMascot.vue'
import RecurringModal from '@/components/RecurringModal.vue'

const props = defineProps<{
  locale: Locale
}>()

const emit = defineEmits<{
  (e: 'navigate', view: 'dashboard' | 'all' | 'recurring'): void
}>()

const recurringStore = useRecurringStore()

const filterType = ref<'all' | TransactionType>('all')
const isModalOpen = ref(false)
const editingItem = ref<RecurringItem | null>(null)
const toastMsg = ref<string | null>(null)

let toastTimer: ReturnType<typeof setTimeout> | null = null
function showToast(text: string) {
  toastMsg.value = text
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMsg.value = null
  }, 2400)
}

const filteredItems = computed(() => {
  if (filterType.value === 'all') return recurringStore.items
  return recurringStore.items.filter((it) => it.type === filterType.value)
})

function openAddModal() {
  editingItem.value = null
  isModalOpen.value = true
}

function openEditModal(item: RecurringItem) {
  editingItem.value = item
  isModalOpen.value = true
}

function handleSave(payload: RecurringPayload) {
  if (editingItem.value) {
    recurringStore.updateRecurring(editingItem.value.id, payload)
  } else {
    recurringStore.addRecurring(payload)
  }
  isModalOpen.value = false
}

function handleDelete(item: RecurringItem) {
  if (confirm(t('confirmDeleteRecurring', props.locale))) {
    recurringStore.deleteRecurring(item.id)
  }
}

function handleLog(item: RecurringItem) {
  recurringStore.logItemAsTransaction(item)
  showToast(t('logSuccess', props.locale))
}

function getFrequencyLabel(item: RecurringItem): string {
  if (item.frequency === 'monthly') {
    return t('dayOfMonth', props.locale).replace('{day}', String(item.dueDay))
  }
  if (item.frequency === 'weekly') return t('weekly', props.locale)
  return t('yearly', props.locale)
}
</script>

<template>
  <div class="recurring-view">
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
        <div class="title-wrap">
          <h2 class="view-title">{{ t('recurringTitle', locale) }}</h2>
          <p class="view-subtitle">{{ t('recurringSubtitle', locale) }}</p>
        </div>
      </div>

      <button type="button" class="btn-primary btn-add-recurring" @click="openAddModal">
        <AppIcon name="plus" :size="16" stroke-width="2.5" />
        <span>{{ t('addRecurring', locale) }}</span>
      </button>
    </div>

    <!-- Monthly Projection Summary Cards -->
    <div class="projections-container" v-if="recurringStore.activeItems.length">
      <div
        v-for="curr in recurringStore.activeCurrencies"
        :key="'proj-' + curr"
        class="card projection-card"
      >
        <div class="proj-top-row">
          <div class="curr-badge">
            <span class="curr-code">{{ curr }}</span>
            <span class="curr-label">{{ t('monthlyProjection', locale) }}</span>
          </div>
          <span
            v-if="recurringStore.projectedNetByCurrency[curr]"
            class="net-badge"
            :class="recurringStore.projectedNetByCurrency[curr]!.isNegative ? 'badge-expense' : 'badge-income'"
          >
            {{ recurringStore.projectedNetByCurrency[curr]!.isNegative ? '-' : '+' }}
          </span>
        </div>

        <div
          v-if="recurringStore.projectedNetByCurrency[curr]"
          class="proj-net-val tabular-nums"
          :class="recurringStore.projectedNetByCurrency[curr]!.isNegative ? 'text-expense' : 'text-income'"
          :title="formatDineroAmount(recurringStore.projectedNetByCurrency[curr]!.val, locale)"
        >
          {{ formatDineroAmount(recurringStore.projectedNetByCurrency[curr]!.val, locale) }}
          <span class="net-caption">({{ t('projectedNet', locale) }})</span>
        </div>

        <div class="proj-stats-row">
          <div class="stat-pill stat-income">
            <div class="stat-icon-wrap income">
              <AppIcon name="arrow-up-right" :size="13" stroke-width="2.4" />
            </div>
            <div class="stat-texts">
              <span class="stat-name">{{ t('projectedIncome', locale) }}</span>
              <span
                class="stat-number tabular-nums"
                :title="recurringStore.projectedIncomeByCurrency[curr] ? formatDineroAmount(recurringStore.projectedIncomeByCurrency[curr]!, locale) : '0'"
              >
                {{ recurringStore.projectedIncomeByCurrency[curr] ? formatDineroAmount(recurringStore.projectedIncomeByCurrency[curr]!, locale) : '0' }}
              </span>
            </div>
          </div>

          <div class="stat-pill stat-expense">
            <div class="stat-icon-wrap expense">
              <AppIcon name="arrow-down-right" :size="13" stroke-width="2.4" />
            </div>
            <div class="stat-texts">
              <span class="stat-name">{{ t('projectedExpense', locale) }}</span>
              <span
                class="stat-number tabular-nums"
                :title="recurringStore.projectedExpenseByCurrency[curr] ? formatDineroAmount(recurringStore.projectedExpenseByCurrency[curr]!, locale) : '0'"
              >
                {{ recurringStore.projectedExpenseByCurrency[curr] ? formatDineroAmount(recurringStore.projectedExpenseByCurrency[curr]!, locale) : '0' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Control Bar -->
    <div class="recurring-control-bar">
      <div class="filter-pills" role="radiogroup">
        <button
          type="button"
          class="filter-btn"
          :class="{ active: filterType === 'all' }"
          @click="filterType = 'all'"
        >
          {{ t('all', locale) }} ({{ recurringStore.items.length }})
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

    <!-- Toast Alert -->
    <div v-if="toastMsg" class="toast-alert" role="alert">
      <AppIcon name="check" :size="16" stroke-width="2.4" />
      <span>{{ toastMsg }}</span>
    </div>

    <!-- Recurring Items List -->
    <div v-if="filteredItems.length" class="recurring-list">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="card recurring-card"
        :class="{ inactive: !item.active }"
      >
        <!-- Left: Category Icon -->
        <div class="rec-icon-wrap" :class="item.type">
          <AppIcon :name="item.category.name" :size="20" stroke-width="2" />
        </div>

        <!-- Center: Details -->
        <div class="rec-info">
          <div class="rec-title-row">
            <h4 class="rec-name">{{ item.name }}</h4>
            <span
              class="badge-freq"
            >
              <AppIcon name="calendar" :size="11" stroke-width="2.2" />
              <span>{{ getFrequencyLabel(item) }}</span>
            </span>
          </div>

          <div class="rec-meta-row">
            <span class="rec-category-name">
              {{ tCategory(item.category.name, locale) }} &middot; {{ tSubcategory(item.category.subcategory, locale) }}
            </span>
            <span
              class="badge-logged"
              :class="recurringStore.isLoggedThisMonth(item) ? 'is-logged' : 'not-logged'"
            >
              <AppIcon :name="recurringStore.isLoggedThisMonth(item) ? 'check' : 'repeat'" :size="11" stroke-width="2.2" />
              <span>{{ recurringStore.isLoggedThisMonth(item) ? t('loggedThisMonth', locale) : t('notLoggedThisMonth', locale) }}</span>
            </span>
          </div>

          <!-- Optional Item Note -->
          <div v-if="item.notes" class="rec-notes-row">
            <AppIcon name="note" :size="12" stroke-width="2" class="rec-note-icon" />
            <span class="rec-note-text" :title="item.notes">{{ item.notes }}</span>
          </div>
        </div>

        <!-- Right: Amount & 1-Tap Actions -->
        <div class="rec-actions-block">
          <div
            class="rec-amount tabular-nums"
            :class="item.type === 'income' ? 'text-income' : 'text-expense'"
            :title="formatDineroAmount(item.amount, locale)"
          >
            {{ item.type === 'income' ? '+' : '-' }}{{ formatDineroAmount(item.amount, locale) }}
          </div>

          <div class="rec-btn-group">
            <!-- 1-Tap Log Transaction -->
            <button
              type="button"
              class="btn-log-quick"
              :title="t('logNow', locale)"
              @click="handleLog(item)"
            >
              <AppIcon name="plus" :size="13" stroke-width="2.6" />
              <span>{{ t('logNow', locale) }}</span>
            </button>

            <!-- Active Switch -->
            <button
              type="button"
              class="btn-icon-switch"
              :class="{ active: item.active }"
              :title="item.active ? t('active', locale) : t('paused', locale)"
              @click="recurringStore.toggleActive(item.id)"
            >
              <span class="switch-knob"></span>
            </button>

            <!-- Edit Button -->
            <button
              type="button"
              class="btn-icon-subtle"
              :title="t('editRecurring', locale)"
              @click="openEditModal(item)"
            >
              <AppIcon name="edit" :size="14" stroke-width="2.2" />
            </button>

            <!-- Delete Button -->
            <button
              type="button"
              class="btn-icon-subtle danger"
              :title="t('delete', locale)"
              @click="handleDelete(item)"
            >
              <AppIcon name="trash" :size="14" stroke-width="2.2" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card empty-recurring-wrap">
      <CatMascot :size="162" variant="sleeping" />
      <p class="empty-text">{{ t('emptyRecurring', locale) }}</p>
      <button type="button" class="btn-primary" @click="openAddModal">
        <AppIcon name="plus" :size="16" stroke-width="2.5" />
        <span>{{ t('addRecurring', locale) }}</span>
      </button>
    </div>

    <!-- Recurring Add/Edit Modal -->
    <RecurringModal
      :is-open="isModalOpen"
      :editing-item="editingItem"
      :locale="locale"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.recurring-view {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.title-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.view-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
}

.view-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 0.4rem 0.8rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-back:hover {
  background: var(--surface-hover);
  color: var(--text);
}

.btn-add-recurring {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
}

/* Projections Container */
.projections-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.85rem;
}

.projection-card {
  background: linear-gradient(180deg, #ffffff 0%, #faf5ee 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 0.95rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.proj-top-row {
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
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.curr-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.net-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-pill);
}

.proj-net-val {
  font-size: clamp(1.15rem, 4vw, 1.35rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.4rem;
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
  max-width: 100%;
}

.net-caption {
  font-size: 0.74rem;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
}

.proj-stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.5rem;
  padding-top: 0.55rem;
  border-top: 1px solid var(--border-light);
  min-width: 0;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.5rem;
  border-radius: var(--radius-md);
  background: #ffffff;
  border: 1px solid var(--border-light);
  min-width: 0;
}

.stat-icon-wrap {
  width: 22px;
  height: 22px;
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
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-number {
  font-size: clamp(0.72rem, 2.2vw, 0.82rem);
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
}

/* Controls */
.recurring-control-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.filter-pills {
  display: flex;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.2rem;
  border-radius: var(--radius-pill);
  gap: 0.2rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-pills::-webkit-scrollbar {
  display: none;
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
  white-space: nowrap;
  flex-shrink: 0;
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

/* Toast */
.toast-alert {
  position: fixed;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-50%);
  background: #28211d;
  color: #ffffff;
  padding: 0.65rem 1.25rem;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: var(--shadow-modal);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 150;
  animation: slideUpToast 0.2s ease-out;
}

@keyframes slideUpToast {
  from { transform: translate(-50%, 15px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

/* Recurring Cards */
.recurring-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.recurring-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-lg);
  transition: opacity 0.15s ease;
}

.recurring-card.inactive {
  opacity: 0.62;
  background: var(--surface-warm);
}

.rec-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rec-icon-wrap.expense {
  background: var(--expense-bg);
  color: var(--expense);
}

.rec-icon-wrap.income {
  background: var(--income-bg);
  color: var(--income);
}

.rec-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.rec-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.rec-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge-freq {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  font-weight: 600;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.1rem 0.45rem;
  border-radius: var(--radius-pill);
}

.rec-meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.rec-category-name {
  font-size: 0.76rem;
  color: var(--text-muted);
}

.badge-logged {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.45rem;
  border-radius: var(--radius-pill);
}

.badge-logged.is-logged {
  background: var(--income-bg);
  color: var(--income);
}

.badge-logged.not-logged {
  background: var(--surface-warm);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.rec-notes-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.76rem;
  color: var(--text-secondary);
  margin-top: 0.1rem;
}

.rec-note-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.rec-note-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rec-actions-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
  flex-shrink: 0;
  min-width: 0;
  max-width: 52%;
}

.rec-amount {
  font-size: clamp(0.85rem, 2.8vw, 1rem);
  font-weight: 800;
  font-family: var(--font-mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.rec-btn-group {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-log-quick {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--primary-light);
  color: var(--primary-hover);
  border: 1px solid var(--primary);
  padding: 0.25rem 0.55rem;
  border-radius: var(--radius-pill);
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.12s ease;
}

.btn-log-quick:hover {
  background: var(--primary);
  color: #ffffff;
}

/* Switch */
.btn-icon-switch {
  width: 32px;
  height: 18px;
  background: #d8cbbe;
  border-radius: var(--radius-pill);
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 0.15s ease;
  padding: 2px;
}

.btn-icon-switch.active {
  background: var(--income);
}

.switch-knob {
  display: block;
  width: 14px;
  height: 14px;
  background: #ffffff;
  border-radius: var(--radius-pill);
  transition: transform 0.15s ease;
}

.btn-icon-switch.active .switch-knob {
  transform: translateX(14px);
}

.btn-icon-subtle {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-pill);
  background: var(--surface-warm);
  border: 1px solid var(--border);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.12s ease;
}

.btn-icon-subtle:hover {
  background: var(--surface-hover);
  color: var(--text);
}

.btn-icon-subtle.danger:hover {
  background: var(--expense-bg);
  border-color: var(--expense);
  color: var(--expense);
}

/* Empty State */
.empty-recurring-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 2.5rem 1rem;
  text-align: center;
}

.empty-text {
  color: var(--text-muted);
  font-size: 0.9rem;
  max-width: 320px;
  line-height: 1.45;
}
</style>
