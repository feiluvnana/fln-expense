import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { dinero, add, subtract, isNegative, type Dinero } from 'dinero.js/bigint'
import type { RecurringItem, SerializedRecurringItem, RecurringFrequency } from '@/types/recurring'
import type { SupportedCurrencyCode, Category, TransactionType } from '@/types/transaction'
import { SUPPORTED_CURRENCIES, createDineroAmount, getDineroDecimalNumber } from '@/utils/dineroHelpers'
import { generateRandomId } from '@/utils/idGenerator'
import { useExpenseStore } from './expenseStore'

const RECURRING_STORAGE_KEY = 'fln_recurring_v1'

export interface RecurringPayload {
  name: string
  type: TransactionType
  amount: number
  currencyCode: SupportedCurrencyCode
  category: Category
  frequency: RecurringFrequency
  dueDay: number
  notes?: string
}

export function serializeRecurringItem(item: RecurringItem): SerializedRecurringItem {
  const s = item.amount.toJSON()
  const code = (s.currency.code in SUPPORTED_CURRENCIES ? s.currency.code : 'VND') as SupportedCurrencyCode
  return {
    id: item.id,
    name: item.name,
    type: item.type,
    amount: { minorUnits: s.amount.toString(), currencyCode: code },
    category: item.category,
    frequency: item.frequency,
    dueDay: item.dueDay,
    active: item.active,
    lastLoggedDate: item.lastLoggedDate,
    notes: item.notes,
  }
}

export function deserializeRecurringItem(raw: Record<string, unknown>): RecurringItem | null {
  try {
    const r = raw as Partial<SerializedRecurringItem>
    if (!r.id || !r.name || !r.amount?.minorUnits || !r.category) return null
    const code = (r.amount.currencyCode in SUPPORTED_CURRENCIES ? r.amount.currencyCode : 'VND') as SupportedCurrencyCode
    return {
      id: String(r.id),
      name: String(r.name),
      type: r.type === 'income' ? 'income' : 'expense',
      amount: dinero({ amount: BigInt(r.amount.minorUnits), currency: SUPPORTED_CURRENCIES[code] }),
      currencyCode: code,
      category: {
        type: r.category.type === 'income' ? 'income' : 'expense',
        name: r.category.name || 'other_expense',
        subcategory: r.category.subcategory || 'miscellaneous',
      },
      frequency: r.frequency || 'monthly',
      dueDay: typeof r.dueDay === 'number' ? r.dueDay : 1,
      active: r.active !== false,
      lastLoggedDate: r.lastLoggedDate,
      notes: r.notes,
    }
  } catch {
    return null
  }
}

function getInitialDefaultRecurring(): RecurringItem[] {
  return [
    {
      id: generateRandomId(),
      name: 'Lương cố định hàng tháng',
      type: 'income',
      amount: createDineroAmount(35000000, 'VND'),
      currencyCode: 'VND',
      category: { type: 'income', name: 'salary_and_wages', subcategory: 'base_salary' },
      frequency: 'monthly',
      dueDay: 5,
      active: true,
      notes: 'Chuyển khoản ngày 5 hàng tháng',
    },
    {
      id: generateRandomId(),
      name: 'Tiền thuê nhà / phòng trọ',
      type: 'expense',
      amount: createDineroAmount(4500000, 'VND'),
      currencyCode: 'VND',
      category: { type: 'expense', name: 'housing', subcategory: 'rent' },
      frequency: 'monthly',
      dueDay: 1,
      active: true,
      notes: 'Chuyển khoản đầu tháng cho chủ nhà',
    },
    {
      id: generateRandomId(),
      name: 'Internet Wifi cáp quang',
      type: 'expense',
      amount: createDineroAmount(250000, 'VND'),
      currencyCode: 'VND',
      category: { type: 'expense', name: 'utilities', subcategory: 'internet' },
      frequency: 'monthly',
      dueDay: 15,
      active: true,
      notes: 'Gói cước gia đình tốc độ cao',
    },
    {
      id: generateRandomId(),
      name: 'Gói xem phim Netflix / Spotify',
      type: 'expense',
      amount: createDineroAmount(15.99, 'USD'),
      currencyCode: 'USD',
      category: { type: 'expense', name: 'entertainment', subcategory: 'movies_streaming' },
      frequency: 'monthly',
      dueDay: 20,
      active: true,
      notes: 'Trừ thẻ tín dụng tự động',
    },
    {
      id: generateRandomId(),
      name: 'Quỹ hạt & pate Dứa Con',
      type: 'expense',
      amount: createDineroAmount(500000, 'VND'),
      currencyCode: 'VND',
      category: { type: 'expense', name: 'pet_care', subcategory: 'pet_food' },
      frequency: 'monthly',
      dueDay: 10,
      active: true,
      notes: 'Thức ăn dinh dưỡng cho mèo cưng',
    },
  ]
}

function loadStoredRecurring(): RecurringItem[] {
  try {
    const raw = localStorage.getItem(RECURRING_STORAGE_KEY)
    if (raw === null) return import.meta.env.DEV ? getInitialDefaultRecurring() : []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(deserializeRecurringItem).filter((x): x is RecurringItem => x !== null)
  } catch {
    return []
  }
}

function persistRecurring(items: RecurringItem[]) {
  try {
    localStorage.setItem(RECURRING_STORAGE_KEY, JSON.stringify(items.map(serializeRecurringItem)))
  } catch (err) {
    console.error(err)
  }
}

export const useRecurringStore = defineStore('recurring', () => {
  const items = ref<RecurringItem[]>(loadStoredRecurring())

  function persist() {
    persistRecurring(items.value)
  }

  function addRecurring(data: RecurringPayload): RecurringItem {
    const newItem: RecurringItem = {
      id: generateRandomId(),
      name: data.name.trim(),
      type: data.type,
      amount: createDineroAmount(data.amount, data.currencyCode),
      currencyCode: data.currencyCode,
      category: data.category,
      frequency: data.frequency,
      dueDay: data.dueDay,
      active: true,
      notes: data.notes?.trim(),
    }
    items.value.unshift(newItem)
    persist()
    return newItem
  }

  function updateRecurring(id: string, data: RecurringPayload) {
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx === -1) return
    items.value[idx] = {
      ...items.value[idx]!,
      name: data.name.trim(),
      type: data.type,
      amount: createDineroAmount(data.amount, data.currencyCode),
      currencyCode: data.currencyCode,
      category: data.category,
      frequency: data.frequency,
      dueDay: data.dueDay,
      notes: data.notes?.trim(),
    }
    persist()
  }

  function deleteRecurring(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
    persist()
  }

  function toggleActive(id: string) {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      item.active = !item.active
      persist()
    }
  }

  function logItemAsTransaction(item: RecurringItem) {
    const expenseStore = useExpenseStore()
    const decimalVal = getDineroDecimalNumber(item.amount)
    const txNote = item.notes ? `${item.name} - ${item.notes}` : item.name

    expenseStore.addTransaction({
      amount: decimalVal,
      currencyCode: item.currencyCode,
      category: item.category,
      note: txNote,
    })

    item.lastLoggedDate = new Date().toISOString()
    persist()
  }

  function isLoggedThisMonth(item: RecurringItem): boolean {
    if (!item.lastLoggedDate) return false
    const logDate = new Date(item.lastLoggedDate)
    const now = new Date()
    return logDate.getFullYear() === now.getFullYear() && logDate.getMonth() === now.getMonth()
  }

  const activeItems = computed(() => items.value.filter((i) => i.active))

  const activeCurrencies = computed<SupportedCurrencyCode[]>(() => {
    const set = new Set<SupportedCurrencyCode>()
    for (const it of items.value) {
      set.add(it.currencyCode)
    }
    if (set.size === 0) set.add('VND')
    return Array.from(set)
  })

  // Monthly projection sums
  const projectedIncomeByCurrency = computed(() => {
    const totals: Partial<Record<SupportedCurrencyCode, Dinero<bigint>>> = {}
    for (const it of activeItems.value) {
      if (it.type === 'income') {
        const c = it.currencyCode
        totals[c] = totals[c] ? add(totals[c]!, it.amount) : it.amount
      }
    }
    return totals
  })

  const projectedExpenseByCurrency = computed(() => {
    const totals: Partial<Record<SupportedCurrencyCode, Dinero<bigint>>> = {}
    for (const it of activeItems.value) {
      if (it.type === 'expense') {
        const c = it.currencyCode
        totals[c] = totals[c] ? add(totals[c]!, it.amount) : it.amount
      }
    }
    return totals
  })

  const projectedNetByCurrency = computed(() => {
    const balances: Partial<Record<SupportedCurrencyCode, { val: Dinero<bigint>; isNegative: boolean }>> = {}
    for (const c of activeCurrencies.value) {
      const inc = projectedIncomeByCurrency.value[c] || createDineroAmount(0, c)
      const exp = projectedExpenseByCurrency.value[c] || createDineroAmount(0, c)
      const net = subtract(inc, exp)
      balances[c] = {
        val: net,
        isNegative: isNegative(net),
      }
    }
    return balances
  })

  const upcomingItems = computed(() => {
    const today = new Date().getDate()
    return [...activeItems.value].sort((a, b) => {
      const diffA = (a.dueDay - today + 31) % 31
      const diffB = (b.dueDay - today + 31) % 31
      return diffA - diffB
    })
  })

  function clearAllRecurring() {
    items.value = []
    persist()
  }

  function importRecurring(newItems: RecurringItem[], mode: 'replace' | 'merge' = 'replace') {
    if (mode === 'replace') {
      items.value = [...newItems]
    } else {
      const existingIds = new Set(items.value.map((i) => i.id))
      const deduplicated = newItems.filter((i) => !existingIds.has(i.id))
      items.value = [...deduplicated, ...items.value]
    }
    persist()
  }

  function loadSampleData(sampleItems: RecurringItem[]) {
    if (!import.meta.env.DEV) return
    importRecurring(sampleItems, 'replace')
  }

  return {
    items,
    activeItems,
    activeCurrencies,
    upcomingItems,
    projectedIncomeByCurrency,
    projectedExpenseByCurrency,
    projectedNetByCurrency,
    addRecurring,
    updateRecurring,
    deleteRecurring,
    toggleActive,
    logItemAsTransaction,
    isLoggedThisMonth,
    clearAllRecurring,
    importRecurring,
    loadSampleData,
  }
})
