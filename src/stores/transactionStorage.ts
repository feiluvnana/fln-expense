import { dinero } from 'dinero.js/bigint'
import type { Transaction, SupportedCurrencyCode, Category } from '@/types/transaction'
import { SUPPORTED_CURRENCIES, createDineroAmount } from '@/utils/dineroHelpers'
import { generateRandomId } from '@/utils/idGenerator'

const STORAGE_KEY = 'fln_expenses_v6'

interface SerializedTx {
  id: string
  amount: { minorUnits: string; currencyCode: SupportedCurrencyCode }
  category: Category
  timestamp: string
}

export function serializeTx(tx: Transaction): SerializedTx {
  const s = tx.amount.toJSON()
  const code = (s.currency.code in SUPPORTED_CURRENCIES ? s.currency.code : 'VND') as SupportedCurrencyCode
  return { id: tx.id, amount: { minorUnits: s.amount.toString(), currencyCode: code }, category: tx.category, timestamp: tx.timestamp }
}

export function deserializeTx(raw: Record<string, unknown>): Transaction | null {
  try {
    const r = raw as Partial<SerializedTx>
    if (!r.id || !r.amount?.minorUnits || !r.category) return null
    const code = (r.amount.currencyCode in SUPPORTED_CURRENCIES ? r.amount.currencyCode : 'VND') as SupportedCurrencyCode
    return {
      id: String(r.id),
      amount: dinero({ amount: BigInt(r.amount.minorUnits), currency: SUPPORTED_CURRENCIES[code] }),
      category: { type: r.category.type === 'income' ? 'income' : 'expense', name: r.category.name || 'other_expense', subcategory: r.category.subcategory || 'miscellaneous' },
      timestamp: r.timestamp || new Date().toISOString(),
    }
  } catch { return null }
}

export function getInitialSeedData(): Transaction[] {
  const now = Date.now()
  return [
    { id: generateRandomId(), amount: createDineroAmount(120000, 'VND'), category: { type: 'expense', name: 'food_and_dining', subcategory: 'restaurants' }, timestamp: new Date(now - 7200000).toISOString() },
    { id: generateRandomId(), amount: createDineroAmount(35000000, 'VND'), category: { type: 'income', name: 'salary_and_wages', subcategory: 'base_salary' }, timestamp: new Date(now - 86400000).toISOString() },
    { id: generateRandomId(), amount: createDineroAmount(4500, 'JPY'), category: { type: 'expense', name: 'shopping', subcategory: 'clothing_shoes' }, timestamp: new Date(now - 172800000).toISOString() },
    { id: generateRandomId(), amount: createDineroAmount(15.99, 'USD'), category: { type: 'expense', name: 'entertainment', subcategory: 'movies_streaming' }, timestamp: new Date(now - 259200000).toISOString() },
  ]
}

export function loadStoredTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getInitialSeedData()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return getInitialSeedData()
    const list = parsed.map(deserializeTx).filter((x): x is Transaction => x !== null)
    return list.length ? list : getInitialSeedData()
  } catch { return getInitialSeedData() }
}

export function persistTransactions(list: Transaction[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list.map(serializeTx))) } catch (err) { console.error(err) }
}
