<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Locale } from '@/locales/i18n'
import { t, tCategory, tSubcategory } from '@/locales/i18n'
import type { SupportedCurrencyCode, Category, TransactionType } from '@/types/transaction'
import type { RecurringItem, RecurringFrequency } from '@/types/recurring'
import { CATEGORY_IDENTIFIERS } from '@/types/categories'
import { getDineroDecimalNumber } from '@/utils/dineroHelpers'
import AppIcon from './icons/AppIcon.vue'

const props = defineProps<{
  isOpen: boolean
  editingItem: RecurringItem | null
  locale: Locale
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (
    e: 'save',
    payload: {
      name: string
      type: TransactionType
      amount: number
      currencyCode: SupportedCurrencyCode
      category: Category
      frequency: RecurringFrequency
      dueDay: number
      notes?: string
    },
  ): void
}>()

const supportedCurrencies: SupportedCurrencyCode[] = ['VND', 'JPY', 'USD']

const name = ref('')
const type = ref<TransactionType>('expense')
const amount = ref<number | null>(null)
const currency = ref<SupportedCurrencyCode>('VND')
const frequency = ref<RecurringFrequency>('monthly')
const dueDay = ref<number>(1)
const selectedCat = ref<string>('housing')
const selectedSub = ref<string>('rent')
const notes = ref('')

const availableCats = computed(() => {
  return Object.keys(CATEGORY_IDENTIFIERS[type.value])
})

const availableSubs = computed(() => {
  const map = CATEGORY_IDENTIFIERS[type.value]
  return map[selectedCat.value] || []
})

watch(type, (newType) => {
  if (props.editingItem && props.editingItem.type === newType) return
  if (newType === 'expense') {
    selectedCat.value = 'housing'
    selectedSub.value = 'rent'
  } else {
    selectedCat.value = 'salary_and_wages'
    selectedSub.value = 'base_salary'
  }
})

watch(selectedCat, () => {
  const subs = availableSubs.value
  if (!subs.includes(selectedSub.value)) {
    selectedSub.value = subs[0] || 'miscellaneous'
  }
})

watch(
  () => props.editingItem,
  (item) => {
    if (item) {
      name.value = item.name
      type.value = item.type
      amount.value = getDineroDecimalNumber(item.amount)
      currency.value = item.currencyCode
      frequency.value = item.frequency
      dueDay.value = item.dueDay
      selectedCat.value = item.category.name
      selectedSub.value = item.category.subcategory
      notes.value = item.notes || ''
    } else {
      name.value = ''
      type.value = 'expense'
      amount.value = null
      currency.value = 'VND'
      frequency.value = 'monthly'
      dueDay.value = 1
      selectedCat.value = 'housing'
      selectedSub.value = 'rent'
      notes.value = ''
    }
  },
  { immediate: true },
)

function onSubmit() {
  if (!name.value.trim() || !amount.value || amount.value <= 0) return

  emit('save', {
    name: name.value.trim(),
    type: type.value,
    amount: amount.value,
    currencyCode: currency.value,
    category: {
      type: type.value,
      name: selectedCat.value,
      subcategory: selectedSub.value,
    },
    frequency: frequency.value,
    dueDay: Number(dueDay.value) || 1,
    notes: notes.value.trim() || undefined,
  })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-sheet">
      <!-- Pinned Header -->
      <div class="modal-sheet-header">
        <div class="sheet-handle-bar" aria-hidden="true">
          <span class="sheet-handle"></span>
        </div>

        <div class="modal-header">
          <div class="header-title-group">
            <div class="icon-bubble">
              <AppIcon name="repeat" :size="18" stroke-width="2.3" />
            </div>
            <h3 class="modal-title">
              {{ editingItem ? t('editRecurring', locale) : t('addRecurring', locale) }}
            </h3>
          </div>
          <button
            type="button"
            class="btn-close-icon"
            :aria-label="t('cancel', locale)"
            @click="emit('close')"
          >
            <AppIcon name="close" :size="18" stroke-width="2.2" />
          </button>
        </div>
      </div>

      <!-- Scrollable Form Body -->
      <form id="recurring-modal-form" @submit.prevent="onSubmit" class="modal-sheet-body">
        <!-- Name Input -->
        <div class="form-section">
          <label class="form-label" for="recurring-name-input">{{ t('recurringName', locale) }}</label>
          <input
            id="recurring-name-input"
            v-model="name"
            type="text"
            required
            :placeholder="t('namePlaceholder', locale)"
            class="text-input"
            autocomplete="off"
          />
        </div>

        <!-- Type Segmented Control -->
        <div class="type-segmented-control" role="radiogroup">
          <button
            type="button"
            class="type-pill-btn"
            :class="{ active: type === 'expense' }"
            @click="type = 'expense'"
          >
            <AppIcon name="arrow-down-right" :size="16" stroke-width="2.2" />
            <span>{{ t('expense', locale) }}</span>
          </button>
          <button
            type="button"
            class="type-pill-btn"
            :class="{ active: type === 'income' }"
            @click="type = 'income'"
          >
            <AppIcon name="arrow-up-right" :size="16" stroke-width="2.2" />
            <span>{{ t('income', locale) }}</span>
          </button>
        </div>

        <!-- Amount & Currency Row -->
        <div class="form-section">
          <label class="form-label" for="recurring-amount-input">{{ t('amount', locale) }}</label>
          <div class="amount-entry-group">
            <input
              id="recurring-amount-input"
              v-model.number="amount"
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="0.00"
              class="amount-input tabular-nums"
              autocomplete="off"
            />
            <div class="currency-pills">
              <button
                v-for="curr in supportedCurrencies"
                :key="curr"
                type="button"
                class="currency-pill"
                :class="{ active: currency === curr }"
                @click="currency = curr"
              >
                {{ curr }}
              </button>
            </div>
          </div>
        </div>

        <!-- Frequency & Due Day Row -->
        <div class="form-section">
          <div class="frequency-row">
            <div class="freq-col">
              <label class="form-label">{{ t('frequency', locale) }}</label>
              <div class="freq-pills">
                <button
                  type="button"
                  class="freq-pill"
                  :class="{ active: frequency === 'monthly' }"
                  @click="frequency = 'monthly'"
                >
                  {{ t('monthly', locale) }}
                </button>
                <button
                  type="button"
                  class="freq-pill"
                  :class="{ active: frequency === 'weekly' }"
                  @click="frequency = 'weekly'"
                >
                  {{ t('weekly', locale) }}
                </button>
                <button
                  type="button"
                  class="freq-pill"
                  :class="{ active: frequency === 'yearly' }"
                  @click="frequency = 'yearly'"
                >
                  {{ t('yearly', locale) }}
                </button>
              </div>
            </div>

            <div class="due-col" v-if="frequency === 'monthly'">
              <label class="form-label" for="due-day-input">{{ t('dueDay', locale) }}</label>
              <div class="day-input-wrap">
                <input
                  id="due-day-input"
                  v-model.number="dueDay"
                  type="number"
                  min="1"
                  max="31"
                  required
                  class="day-number-input tabular-nums"
                />
                <span class="day-suffix">/ 31</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Grid -->
        <div class="form-section">
          <label class="form-label">{{ t('category', locale) }}</label>
          <div class="categories-grid">
            <button
              v-for="cat in availableCats"
              :key="cat"
              type="button"
              class="cat-chip"
              :class="{ active: selectedCat === cat }"
              @click="selectedCat = cat"
            >
              <AppIcon :name="cat" :size="16" stroke-width="2" />
              <span class="cat-label">{{ tCategory(cat, locale) }}</span>
            </button>
          </div>
        </div>

        <!-- Subcategory Selection -->
        <div v-if="availableSubs.length" class="form-section">
          <label class="form-label">{{ t('subcategory', locale) }}</label>
          <div class="subcategories-wrap">
            <button
              v-for="sub in availableSubs"
              :key="sub"
              type="button"
              class="sub-pill"
              :class="{ active: selectedSub === sub }"
              @click="selectedSub = sub"
            >
              {{ tSubcategory(sub, locale) }}
            </button>
          </div>
        </div>

        <!-- Note Input -->
        <div class="form-section">
          <label class="form-label" for="recurring-notes-input">{{ t('note', locale) }}</label>
          <input
            id="recurring-notes-input"
            v-model="notes"
            type="text"
            :placeholder="t('recurringNotePlaceholder', locale)"
            class="text-input"
            autocomplete="off"
            maxlength="200"
          />
        </div>
      </form>

      <!-- Pinned Footer Actions -->
      <div class="modal-sheet-footer">
        <button type="button" class="btn-secondary" @click="emit('close')">
          {{ t('cancel', locale) }}
        </button>
        <button
          type="submit"
          form="recurring-modal-form"
          class="btn-primary submit-btn"
          :disabled="!name.trim() || !amount || amount <= 0"
        >
          <AppIcon name="check" :size="16" stroke-width="2.5" />
          <span>{{ editingItem ? t('save', locale) : t('create', locale) }}</span>
        </button>
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
  z-index: 100;
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
  max-width: 480px;
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
  gap: 0.6rem;
}

.icon-bubble {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-pill);
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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

.modal-sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.15rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  overscroll-behavior: contain;
}

@media (min-width: 640px) {
  .modal-sheet-body {
    padding: 1.25rem 1.5rem 1.75rem;
  }
}

.modal-sheet-footer {
  padding: 0.85rem 1.25rem calc(0.85rem + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--border-light);
  background: var(--surface);
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .modal-sheet-footer {
    padding: 1rem 1.5rem;
  }
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.text-input {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border);
  background: var(--surface-warm);
  font-size: 0.95rem;
  color: var(--text);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.text-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(223, 104, 38, 0.12);
  background: #ffffff;
}

/* Type Segmented Control */
.type-segmented-control {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.25rem;
  border-radius: var(--radius-pill);
  gap: 0.25rem;
}

.type-pill-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.55rem;
  border-radius: var(--radius-pill);
  font-size: 0.88rem;
  font-weight: 600;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.type-pill-btn.active {
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.type-segmented-control button:first-child.active {
  color: var(--expense);
}

.type-segmented-control button:last-child.active {
  color: var(--income);
}

/* Amount Input & Currency */
.amount-entry-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.amount-input {
  flex: 1;
  min-width: 140px;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border);
  background: var(--surface-warm);
  font-size: 1.15rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.amount-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(223, 104, 38, 0.12);
  background: #ffffff;
}

.currency-pills {
  display: flex;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.2rem;
  border-radius: var(--radius-pill);
  gap: 0.2rem;
}

.currency-pill {
  border: none;
  background: transparent;
  font-size: 0.76rem;
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: all 0.12s ease;
}

.currency-pill.active {
  background: #ffffff;
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* Frequency and Due Day */
.frequency-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.freq-col {
  flex: 1;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.freq-pills {
  display: flex;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.2rem;
  border-radius: var(--radius-pill);
  gap: 0.2rem;
}

.freq-pill {
  border: none;
  background: transparent;
  flex: 1;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-pill);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.12s ease;
}

.freq-pill.active {
  background: #ffffff;
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.due-col {
  width: 100px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.day-input-wrap {
  display: flex;
  align-items: center;
  background: var(--surface-warm);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.25rem 0.5rem;
}

.day-number-input {
  width: 48px;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--text);
  outline: none;
  text-align: center;
}

.day-suffix {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* Category Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
  gap: 0.45rem;
  padding: 0.1rem 0;
}

.cat-chip {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.6rem;
  border: 1px solid var(--border);
  background: var(--surface-warm);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  min-width: 0;
  transition: all 0.12s ease;
}

.cat-chip:hover {
  background: var(--surface-hover);
  color: var(--text);
}

.cat-chip.active {
  background: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary-hover);
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(223, 104, 38, 0.15);
}

.cat-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Subcategory Pills */
.subcategories-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0.1rem 0;
}

.sub-pill {
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--border);
  background: #ffffff;
  border-radius: var(--radius-pill);
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.12s ease;
}

.sub-pill:hover {
  border-color: #d1c3b5;
  color: var(--text);
}

.sub-pill.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
  font-weight: 600;
}

.submit-btn {
  padding: 0.65rem 1.4rem;
}
</style>
