import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { add, subtract, isNegative, type Dinero } from 'dinero.js/bigint'
import type { Transaction, SupportedCurrencyCode, Category } from '@/types/transaction'
import { createDineroAmount } from '@/utils/dineroHelpers'
import { generateRandomId } from '@/utils/idGenerator'
import { loadStoredTransactions, persistTransactions } from './transactionStorage'

export interface TxPayload {
  amount: number
  currencyCode: SupportedCurrencyCode
  category: Category
}

export const useExpenseStore = defineStore('expenses', () => {
  const transactions = ref<Transaction[]>(loadStoredTransactions())

  function persist() {
    persistTransactions(transactions.value)
  }

  function addTransaction(data: TxPayload): Transaction {
    const newTx: Transaction = {
      id: generateRandomId(),
      amount: createDineroAmount(data.amount, data.currencyCode),
      category: data.category,
      timestamp: new Date().toISOString(),
    }
    transactions.value.unshift(newTx)
    persist()
    return newTx
  }

  function updateTransaction(id: string, data: TxPayload) {
    const idx = transactions.value.findIndex((t) => t.id === id)
    if (idx === -1) return
    transactions.value[idx] = {
      ...transactions.value[idx]!,
      amount: createDineroAmount(data.amount, data.currencyCode),
      category: data.category,
    }
    persist()
  }

  function deleteTransaction(id: string) {
    transactions.value = transactions.value.filter((t) => t.id !== id)
    persist()
  }

  const sortedTransactions = computed(() => {
    return [...transactions.value].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  })

  const recentTransactions = computed(() => sortedTransactions.value.slice(0, 5))

  const activeCurrencies = computed<SupportedCurrencyCode[]>(() => {
    const set = new Set<SupportedCurrencyCode>()
    for (const tx of transactions.value) {
      set.add(tx.amount.toJSON().currency.code as SupportedCurrencyCode)
    }
    if (set.size === 0) set.add('VND')
    return Array.from(set)
  })

  const totalIncomeByCurrency = computed(() => {
    const totals: Partial<Record<SupportedCurrencyCode, Dinero<bigint>>> = {}
    for (const tx of transactions.value) {
      if (tx.category.type === 'income') {
        const code = tx.amount.toJSON().currency.code as SupportedCurrencyCode
        totals[code] = totals[code] ? add(totals[code]!, tx.amount) : tx.amount
      }
    }
    return totals
  })

  const totalExpenseByCurrency = computed(() => {
    const totals: Partial<Record<SupportedCurrencyCode, Dinero<bigint>>> = {}
    for (const tx of transactions.value) {
      if (tx.category.type === 'expense') {
        const code = tx.amount.toJSON().currency.code as SupportedCurrencyCode
        totals[code] = totals[code] ? add(totals[code]!, tx.amount) : tx.amount
      }
    }
    return totals
  })

  const netBalanceByCurrency = computed(() => {
    const balances: Partial<Record<SupportedCurrencyCode, { val: Dinero<bigint>; isNegative: boolean }>> = {}
    for (const curr of activeCurrencies.value) {
      const inc = totalIncomeByCurrency.value[curr] || createDineroAmount(0, curr)
      const exp = totalExpenseByCurrency.value[curr] || createDineroAmount(0, curr)
      const net = subtract(inc, exp)
      balances[curr] = {
        val: net,
        isNegative: isNegative(net),
      }
    }
    return balances
  })

  return {
    transactions: sortedTransactions,
    recentTransactions,
    activeCurrencies,
    totalIncomeByCurrency,
    totalExpenseByCurrency,
    netBalanceByCurrency,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
})
