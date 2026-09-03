<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Transaction, TransactionType, SupportedCurrencyCode } from '@/types/transaction'
import type { TxPayload } from '@/stores/expenseStore'
import { CATEGORY_IDENTIFIERS } from '@/types/categories'
import { t, tCategory, tSubcategory, type Locale } from '@/locales/i18n'
import { toDecimal } from 'dinero.js/bigint'
import AppIcon from '@/components/icons/AppIcon.vue'

const props = defineProps<{
  isOpen: boolean
  locale: Locale
  editingTx?: Transaction | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: TxPayload, id?: string): void
}>()

const type = ref<TransactionType>('expense')
const availableCats = computed(() => Object.keys(CATEGORY_IDENTIFIERS[type.value]))
const selectedCat = ref(availableCats.value[0] || 'food_and_dining')
const availableSubs = computed(() => CATEGORY_IDENTIFIERS[type.value][selectedCat.value] || [])
const selectedSub = ref(availableSubs.value[0] || 'groceries')
const amount = ref<number | null>(null)
const currency = ref<SupportedCurrencyCode>('VND')
const note = ref('')

const supportedCurrencies: SupportedCurrencyCode[] = ['VND', 'JPY', 'USD']

watch(type, (newType) => {
  const firstCat = Object.keys(CATEGORY_IDENTIFIERS[newType])[0] || ''
  selectedCat.value = firstCat
  selectedSub.value = CATEGORY_IDENTIFIERS[newType][firstCat]?.[0] || ''
})

watch(selectedCat, (newCat) => {
  selectedSub.value = CATEGORY_IDENTIFIERS[type.value][newCat]?.[0] || ''
})

watch(
  () => props.isOpen,
  (open) => {
    if (!open) return
    if (props.editingTx) {
      type.value = props.editingTx.category.type
      selectedCat.value = props.editingTx.category.name
      selectedSub.value = props.editingTx.category.subcategory
      amount.value = Number(toDecimal(props.editingTx.amount))
      currency.value = props.editingTx.amount.toJSON().currency.code as SupportedCurrencyCode
      note.value = props.editingTx.note || ''
    } else {
      type.value = 'expense'
      selectedCat.value = Object.keys(CATEGORY_IDENTIFIERS['expense'])[0] || 'food_and_dining'
      selectedSub.value = CATEGORY_IDENTIFIERS['expense'][selectedCat.value]?.[0] || 'groceries'
      amount.value = null
      currency.value = 'VND'
      note.value = ''
    }
  },
)

function onSubmit() {
  if (!amount.value || amount.value <= 0) return
  emit(
    'save',
    {
      amount: amount.value,
      currencyCode: currency.value,
      category: {
        type: type.value,
        name: selectedCat.value,
        subcategory: selectedSub.value,
      },
      note: note.value.trim() || undefined,
    },
    props.editingTx?.id,
  )
  emit('close')
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

        <div class="modal-header">
          <h3 class="modal-title">
            {{ editingTx ? t('editTx', locale) : t('addTx', locale) }}
          </h3>
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

      <!-- Scrollable Form Body with generous padding -->
      <form id="tx-modal-form" @submit.prevent="onSubmit" class="modal-sheet-body">
        <!-- Transaction Type Segmented Toggle -->
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
          <label class="form-label" for="amount-input">{{ t('amount', locale) }}</label>
          <div class="amount-entry-group">
            <input
              id="amount-input"
              v-model.number="amount"
              type="number"
              step="any"
              min="0.01"
              required
              placeholder="0.00"
              class="amount-input tabular-nums"
              autocomplete="off"
            />
            <!-- Currency Quick Selector Pills -->
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

        <!-- Visual Category Selection -->
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
          <label class="form-label" for="tx-note-input">{{ t('note', locale) }}</label>
          <input
            id="tx-note-input"
            v-model="note"
            type="text"
            :placeholder="t('notePlaceholder', locale)"
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
          form="tx-modal-form"
          class="btn-primary submit-btn"
          :disabled="!amount || amount <= 0"
        >
          <AppIcon name="check" :size="16" stroke-width="2.5" />
          <span>{{ editingTx ? t('save', locale) : t('create', locale) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(35, 27, 22, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
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

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

/* Type Segmented Control */
.type-segmented-control {
  display: flex;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.25rem;
  border-radius: var(--radius-pill);
  gap: 0.25rem;
}

.type-pill-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.55rem 0.8rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.type-pill-btn.active {
  background: #ffffff;
  color: var(--text);
  box-shadow: 0 2px 6px rgba(58, 41, 30, 0.08);
}

.type-segmented-control .type-pill-btn:first-child.active {
  color: var(--expense);
}

.type-segmented-control .type-pill-btn:last-child.active {
  color: var(--income);
}

/* Form Sections */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

.amount-entry-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface-warm);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.35rem 0.5rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.amount-entry-group:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
  background: #ffffff;
}

.amount-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text);
  padding: 0.2rem 0.4rem;
}

.amount-input::placeholder {
  color: var(--text-subtle);
  font-weight: 400;
}

/* Currency Pills */
.currency-pills {
  display: flex;
  background: rgba(0, 0, 0, 0.04);
  padding: 0.15rem;
  border-radius: var(--radius-pill);
  gap: 0.15rem;
}

.currency-pill {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.75rem;
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
</style>
