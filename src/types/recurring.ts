import type { Dinero } from 'dinero.js/bigint'
import type { Category, SupportedCurrencyCode, TransactionType } from './transaction'

export type RecurringFrequency = 'monthly' | 'weekly' | 'yearly'

export interface RecurringItem {
  id: string
  name: string
  type: TransactionType
  amount: Dinero<bigint>
  currencyCode: SupportedCurrencyCode
  category: Category
  frequency: RecurringFrequency
  dueDay: number // 1-31 for monthly
  active: boolean
  lastLoggedDate?: string
  notes?: string
}

export interface SerializedRecurringItem {
  id: string
  name: string
  type: TransactionType
  amount: { minorUnits: string; currencyCode: SupportedCurrencyCode }
  category: Category
  frequency: RecurringFrequency
  dueDay: number
  active: boolean
  lastLoggedDate?: string
  notes?: string
}
