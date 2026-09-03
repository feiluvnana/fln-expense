import type { Dinero } from 'dinero.js'
import type { TransactionType } from './categories'

export type { TransactionType } from './categories'
export type SupportedCurrencyCode = 'VND' | 'JPY' | 'USD'

export interface Category {
  type: TransactionType
  name: string
  subcategory: string
}

export interface Transaction<TAmount = bigint> {
  id: string
  amount: Dinero<TAmount>
  category: Category
  timestamp: string
}
