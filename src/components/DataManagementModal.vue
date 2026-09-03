<script setup lang="ts">
import { ref } from 'vue'
import { t, type Locale } from '@/locales/i18n'
import type { Transaction } from '@/types/transaction'
import type { RecurringItem } from '@/types/recurring'
import { useExpenseStore } from '@/stores/expenseStore'
import { useRecurringStore, serializeRecurringItem, deserializeRecurringItem } from '@/stores/recurringStore'
import { serializeTx, deserializeTx } from '@/stores/transactionStorage'
import { getSampleTransactions, getSampleRecurring } from '@/utils/sampleData'
import AppIcon from '@/components/icons/AppIcon.vue'

defineProps<{
  isOpen: boolean
  locale: Locale
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useExpenseStore()
const recurringStore = useRecurringStore()

const importMode = ref<'replace' | 'merge'>('replace')
const fileInputRef = ref<HTMLInputElement | null>(null)
const feedbackMsg = ref<{ text: string; isError?: boolean } | null>(null)

function showFeedback(text: string, isError = false) {
  feedbackMsg.value = { text, isError }
  setTimeout(() => {
    if (feedbackMsg.value?.text === text) {
      feedbackMsg.value = null
    }
  }, 4000)
}

function handleExport(locale: Locale) {
  try {
    const backupData = {
      appName: 'FLN Expense',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      transactions: store.transactions.map(serializeTx),
      recurring: recurringStore.items.map(serializeRecurringItem),
    }
    const jsonStr = JSON.stringify(backupData, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const today = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `fln-expense-backup-${today}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showFeedback(t('downloadSuccess', locale))
  } catch {
    showFeedback('Export failed', true)
  }
}

function handleLoadSample(locale: Locale) {
  const sampleTxs = getSampleTransactions()
  const sampleRec = getSampleRecurring()
  store.loadSampleData(sampleTxs)
  recurringStore.loadSampleData(sampleRec)
  showFeedback(t('sampleLoaded', locale))
}

function handleFileInputChange(e: Event, locale: Locale) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const content = event.target?.result as string
      const parsed = JSON.parse(content)
      const txRaw = Array.isArray(parsed) ? parsed : parsed?.transactions
      const recRaw = Array.isArray(parsed) ? [] : parsed?.recurring

      const txs = Array.isArray(txRaw)
        ? (txRaw as Record<string, unknown>[]).map(deserializeTx).filter((x: Transaction | null): x is Transaction => x !== null)
        : []
      const recItems = Array.isArray(recRaw)
        ? (recRaw as Record<string, unknown>[]).map(deserializeRecurringItem).filter((x: RecurringItem | null): x is RecurringItem => x !== null)
        : []

      // A backup holding only recurring items is still valid
      if (txs.length === 0 && recItems.length === 0) {
        showFeedback(t('importError', locale), true)
        return
      }

      if (txs.length > 0) {
        store.importTransactions(txs, importMode.value)
      }
      if (recItems.length > 0) {
        recurringStore.importRecurring(recItems, importMode.value)
      }

      const successStr = t('importSuccess', locale).replace('{count}', String(txs.length))
      showFeedback(successStr)
      if (fileInputRef.value) fileInputRef.value.value = ''
    } catch {
      showFeedback(t('importError', locale), true)
    }
  }
  reader.readAsText(file)
}

function handleClear(locale: Locale) {
  if (confirm(t('clearConfirm', locale))) {
    store.clearAllTransactions()
    recurringStore.clearAllRecurring()
    showFeedback(t('dataCleared', locale))
  }
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-sheet">
      <!-- Pinned Header -->
      <div class="modal-sheet-header">
        <!-- Mobile Pull Bar Handle -->
        <div class="sheet-handle-bar" aria-hidden="true">
          <span class="sheet-handle"></span>
        </div>

        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-title-group">
            <div class="icon-bubble">
              <AppIcon name="database" :size="20" stroke-width="2.2" />
            </div>
            <h3 class="modal-title">{{ t('dataManagement', locale) }}</h3>
          </div>
          <button
            type="button"
            class="btn-close-icon"
            :aria-label="t('close', locale)"
            @click="emit('close')"
          >
            <AppIcon name="close" :size="18" stroke-width="2.2" />
          </button>
        </div>
      </div>

      <!-- Scrollable Body with generous padding -->
      <div class="modal-sheet-body">
        <!-- Feedback Alert Banner -->
        <div
          v-if="feedbackMsg"
          class="feedback-banner"
          :class="feedbackMsg.isError ? 'banner-error' : 'banner-success'"
        >
          <AppIcon :name="feedbackMsg.isError ? 'close' : 'check'" :size="16" stroke-width="2.4" />
          <span>{{ feedbackMsg.text }}</span>
        </div>

        <!-- Content Sections -->
        <div class="management-sections">
        <!-- 1. Load Sample Data Card -->
        <div class="data-card sample-card">
          <div class="data-card-info">
            <div class="card-label-row">
              <AppIcon name="cat" :size="17" stroke-width="2" />
              <h4 class="card-title">{{ t('loadSampleData', locale) }}</h4>
            </div>
            <p class="card-desc">{{ t('loadSampleDataDesc', locale) }}</p>
          </div>
          <button
            type="button"
            class="btn-action-primary"
            @click="handleLoadSample(locale)"
          >
            <AppIcon name="plus" :size="15" stroke-width="2.5" />
            <span>{{ t('loadSampleData', locale) }}</span>
          </button>
        </div>

        <!-- 2. Export Data Card -->
        <div class="data-card">
          <div class="data-card-info">
            <div class="card-label-row">
              <AppIcon name="download" :size="17" stroke-width="2" />
              <h4 class="card-title">{{ t('exportData', locale) }}</h4>
            </div>
            <p class="card-desc">{{ t('exportDataDesc', locale) }}</p>
          </div>
          <button
            type="button"
            class="btn-action-secondary"
            :disabled="!store.transactions.length && !recurringStore.items.length"
            @click="handleExport(locale)"
          >
            <AppIcon name="download" :size="15" stroke-width="2.2" />
            <span>{{ t('exportData', locale) }}</span>
          </button>
        </div>

        <!-- 3. Import Data Card -->
        <div class="data-card">
          <div class="data-card-info">
            <div class="card-label-row">
              <AppIcon name="upload" :size="17" stroke-width="2" />
              <h4 class="card-title">{{ t('importData', locale) }}</h4>
            </div>
            <p class="card-desc">{{ t('importDataDesc', locale) }}</p>

            <!-- Import Mode Segmented Toggle -->
            <div class="import-mode-wrap">
              <span class="mode-label">{{ t('importMode', locale) }}:</span>
              <div class="mode-toggle-pills">
                <button
                  type="button"
                  class="mode-pill"
                  :class="{ active: importMode === 'replace' }"
                  @click="importMode = 'replace'"
                >
                  {{ t('importReplace', locale) }}
                </button>
                <button
                  type="button"
                  class="mode-pill"
                  :class="{ active: importMode === 'merge' }"
                  @click="importMode = 'merge'"
                >
                  {{ t('importMerge', locale) }}
                </button>
              </div>
            </div>
          </div>

          <input
            ref="fileInputRef"
            type="file"
            accept=".json,application/json"
            class="hidden-file-input"
            @change="handleFileInputChange($event, locale)"
          />
          <button
            type="button"
            class="btn-action-secondary"
            @click="fileInputRef?.click()"
          >
            <AppIcon name="upload" :size="15" stroke-width="2.2" />
            <span>{{ t('importData', locale) }}</span>
          </button>
        </div>

        <!-- 4. Danger Zone: Clear All -->
        <div class="data-card danger-card">
          <div class="data-card-info">
            <h4 class="card-title text-danger">{{ t('clearAllData', locale) }}</h4>
            <span class="danger-count">
              {{ store.transactions.length + recurringStore.items.length }} {{ t('totalRecords', locale).toLowerCase() }}
            </span>
          </div>
          <button
            type="button"
            class="btn-danger"
            :disabled="!store.transactions.length && !recurringStore.items.length"
            @click="handleClear(locale)"
          >
            <AppIcon name="trash" :size="15" stroke-width="2.2" />
            <span>{{ t('clearAllData', locale) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(35, 27, 22, 0.48);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 110;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (min-width: 640px) {
  .modal-backdrop {
    align-items: center;
    padding: 1.5rem;
  }
}

.modal-sheet {
  background: var(--surface);
  width: 100%;
  max-width: 500px;
  max-height: 88vh;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: var(--shadow-modal);
  animation: slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@media (min-width: 640px) {
  .modal-sheet {
    border-radius: var(--radius-xl);
    max-height: 84vh;
    animation: scaleIn 0.18s ease-out;
  }
}

@keyframes scaleIn {
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-sheet-header {
  padding: 0.85rem 1.25rem 0.75rem;
  border-bottom: 1px solid var(--border-light);
  background: var(--surface);
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .modal-sheet-header {
    padding: 1.1rem 1.5rem 0.85rem;
  }
}

.modal-sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.15rem 1.25rem calc(1.75rem + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  overscroll-behavior: contain;
}

@media (min-width: 640px) {
  .modal-sheet-body {
    padding: 1.25rem 1.5rem 2rem;
  }
}

.sheet-handle-bar {
  display: flex;
  justify-content: center;
  margin-top: -0.25rem;
  margin-bottom: 0.25rem;
}

@media (min-width: 640px) {
  .sheet-handle-bar { display: none; }
}

.sheet-handle {
  width: 36px;
  height: 4px;
  background: #ded3c5;
  border-radius: var(--radius-pill);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.icon-bubble {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.btn-close-icon {
  background: var(--surface-warm);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.btn-close-icon:hover {
  background: var(--surface-hover);
  color: var(--text);
}

/* Feedback Banner */
.feedback-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  animation: fadeIn 0.15s ease-out;
}

.banner-success {
  background: var(--income-bg);
  color: var(--income);
  border: 1px solid var(--income-border);
}

.banner-error {
  background: var(--expense-bg);
  color: var(--expense);
  border: 1px solid var(--expense-border);
}

/* Management Sections */
.management-sections {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.data-card {
  background: var(--surface-warm);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sample-card {
  background: linear-gradient(180deg, #fdf8f3 0%, #f7eee4 100%);
  border-color: var(--border-strong, #ded3c5);
}

.data-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.card-label-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--primary);
}

.card-title {
  font-size: 0.94rem;
  font-weight: 700;
  color: var(--text);
}

.card-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.import-mode-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.mode-label {
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.mode-toggle-pills {
  display: inline-flex;
  background: #ffffff;
  border: 1px solid var(--border);
  padding: 0.15rem;
  border-radius: var(--radius-pill);
  gap: 0.15rem;
}

.mode-pill {
  border: none;
  background: transparent;
  padding: 0.25rem 0.55rem;
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.12s ease;
}

.mode-pill.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 700;
}

.hidden-file-input {
  display: none;
}

/* Action Buttons */
.btn-action-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: var(--primary);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.55rem 0.9rem;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  box-shadow: 0 2px 5px rgba(223, 104, 38, 0.25);
  transition: all 0.15s ease;
}

.btn-action-primary:hover {
  background: var(--primary-hover);
}

.btn-action-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: #ffffff;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.55rem 0.9rem;
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  transition: all 0.15s ease;
}

.btn-action-secondary:hover:not(:disabled) {
  background: var(--surface-hover);
  border-color: #d1c3b5;
}

.btn-action-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Danger Card */
.danger-card {
  background: #fff8f5;
  border-color: #fed7aa;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.text-danger {
  color: var(--expense);
}

.danger-count {
  font-size: 0.74rem;
  color: var(--text-muted);
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: transparent;
  color: var(--expense);
  border: 1px solid var(--expense-border);
  border-radius: var(--radius-md);
  padding: 0.45rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-danger:hover:not(:disabled) {
  background: var(--expense-bg);
}

.btn-danger:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
