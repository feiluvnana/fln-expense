import type { Transaction } from '@/types/transaction'

export function formatDateDisplay(isoString: string, locale = 'vi'): string {
  const d = new Date(isoString)
  return d.toLocaleString(locale === 'vi' ? 'vi-VN' : 'ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTimeOnly(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function getDateGroupLabel(isoString: string, locale = 'vi'): string {
  const d = new Date(isoString)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = d.toDateString() === yesterday.toDateString()

  if (isToday) return locale === 'vi' ? 'Hôm nay' : '今日'
  if (isYesterday) return locale === 'vi' ? 'Hôm qua' : '昨日'

  return d.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  })
}

export interface DateGroup {
  dateKey: string
  label: string
  transactions: Transaction[]
}

export function groupTransactionsByDate(transactions: Transaction[], locale = 'vi'): DateGroup[] {
  const map = new Map<string, Transaction[]>()

  for (const tx of transactions) {
    const key = tx.timestamp.slice(0, 10) // YYYY-MM-DD
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(tx)
  }

  const groups: DateGroup[] = []
  for (const [key, items] of map.entries()) {
    const sample = items[0]
    groups.push({
      dateKey: key,
      label: sample ? getDateGroupLabel(sample.timestamp, locale) : key,
      transactions: items,
    })
  }

  return groups.sort((a, b) => b.dateKey.localeCompare(a.dateKey))
}
