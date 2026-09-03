<script setup lang="ts">
import type { Transaction } from '@/types/transaction'
import { t, tCategory, tSubcategory, type Locale } from '@/locales/i18n'
import { formatDineroAmount } from '@/utils/dineroHelpers'
import { formatTimeOnly } from '@/utils/dateHelpers'
import AppIcon from '@/components/icons/AppIcon.vue'

const props = defineProps<{
  tx: Transaction
  locale: Locale
}>()

const emit = defineEmits<{
  (e: 'edit', tx: Transaction): void
  (e: 'delete', id: string): void
}>()

function onDelete() {
  if (confirm(t('deleteConfirm', props.locale))) {
    emit('delete', props.tx.id)
  }
}
</script>

<template>
  <div class="tx-card" :class="tx.category.type">
    <!-- Category Icon Avatar -->
    <div class="tx-icon-avatar" :class="tx.category.type">
      <AppIcon :name="tx.category.name" :size="20" stroke-width="2" />
    </div>

    <!-- Info Column -->
    <div class="tx-body">
      <div class="tx-primary-line">
        <span class="category-name">{{ tCategory(tx.category.name, locale) }}</span>
        <span class="divider-dot" aria-hidden="true">•</span>
        <span class="subcategory-name">{{ tSubcategory(tx.category.subcategory, locale) }}</span>
      </div>
      <div class="tx-meta-line">
        <span class="tx-time">
          <AppIcon name="clock" :size="12" stroke-width="2" />
          {{ formatTimeOnly(tx.timestamp) }}
        </span>
        <span class="tx-id">#{{ tx.id.slice(-5) }}</span>
      </div>
    </div>

    <!-- Amount & Actions Column -->
    <div class="tx-end">
      <div
        class="tx-amount tabular-nums"
        :class="tx.category.type === 'income' ? 'text-income' : 'text-expense'"
      >
        <span class="amount-sign">{{ tx.category.type === 'income' ? '+' : '-' }}</span>
        {{ formatDineroAmount(tx.amount, locale) }}
      </div>

      <div class="tx-actions">
        <button
          type="button"
          class="action-btn edit-btn"
          :title="t('edit', locale)"
          :aria-label="t('edit', locale)"
          @click="emit('edit', tx)"
        >
          <AppIcon name="pencil" :size="14" stroke-width="2" />
        </button>
        <button
          type="button"
          class="action-btn delete-btn"
          :title="t('delete', locale)"
          :aria-label="t('delete', locale)"
          @click="onDelete"
        >
          <AppIcon name="trash" :size="14" stroke-width="2" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tx-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.85rem 1rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
}

.tx-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
  border-color: #ded3c5;
}

/* Category Avatar */
.tx-icon-avatar {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.tx-icon-avatar.expense {
  background: var(--primary-light);
  color: var(--primary);
  border: 1px solid var(--primary-tint);
}

.tx-icon-avatar.income {
  background: var(--income-bg);
  color: var(--income);
  border: 1px solid var(--income-border);
}

.tx-card:hover .tx-icon-avatar {
  transform: scale(1.04);
}

/* Body */
.tx-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.tx-primary-line {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text);
}

.divider-dot {
  color: var(--text-subtle);
  font-size: 0.75rem;
}

.subcategory-name {
  font-size: 0.84rem;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
}

.tx-meta-line {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.74rem;
  color: var(--text-muted);
}

.tx-time {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.tx-id {
  font-family: var(--font-mono);
  background: var(--surface-warm);
  color: var(--text-muted);
  padding: 0.08rem 0.35rem;
  border-radius: 4px;
  font-size: 0.7rem;
  letter-spacing: 0.02em;
}

/* End Column */
.tx-end {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  flex-shrink: 0;
}

.tx-amount {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.amount-sign {
  margin-right: 1px;
}

.tx-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  opacity: 0.85;
  transition: opacity 0.15s ease;
}

.tx-card:hover .tx-actions {
  opacity: 1;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.action-btn.edit-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary-tint);
}

.action-btn.delete-btn:hover {
  background: var(--expense-bg);
  color: var(--expense);
  border-color: var(--expense-border);
}
</style>
