import {
  dinero,
  VND,
  JPY,
  USD,
  toDecimal,
  toSnapshot,
  type Dinero,
  type DineroCurrency,
} from 'dinero.js/bigint'
import type { SupportedCurrencyCode } from '@/types/transaction'

export const SUPPORTED_CURRENCIES: Record<SupportedCurrencyCode, DineroCurrency<bigint>> = {
  VND,
  JPY,
  USD,
}

export function createDineroAmount(
  val: number,
  currencyCode: SupportedCurrencyCode = 'VND',
): Dinero<bigint> {
  const currency = SUPPORTED_CURRENCIES[currencyCode] || VND
  const factor = Math.pow(Number(currency.base), Number(currency.exponent))
  const minorUnits = BigInt(Math.round(val * factor))
  return dinero({ amount: minorUnits, currency })
}

export function formatDineroAmount(d: Dinero<bigint>, locale = 'vi'): string {
  const snapshot = toSnapshot(d)
  const decimalStr = toDecimal(d)
  const localeTag = locale === 'vi' ? 'vi-VN' : 'ja-JP'
  try {
    return new Intl.NumberFormat(localeTag, {
      style: 'currency',
      currency: snapshot.currency.code,
    }).format(Number(decimalStr))
  } catch {
    return `${snapshot.currency.code} ${decimalStr}`
  }
}

export function getDineroDecimalNumber(d: Dinero<bigint>): number {
  return Number(toDecimal(d))
}
