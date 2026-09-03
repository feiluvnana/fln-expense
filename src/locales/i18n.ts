import { viMessages, viCategories, viSubcategories } from './vi'
import { jaMessages, jaCategories, jaSubcategories } from './ja'

export type Locale = 'vi' | 'ja'

export const DEFAULT_LOCALE: Locale = 'vi'

const MESSAGES: Record<Locale, Record<string, string>> = {
  vi: viMessages,
  ja: jaMessages,
}

const CATEGORIES: Record<Locale, Record<string, string>> = {
  vi: viCategories,
  ja: jaCategories,
}

const SUBCATEGORIES: Record<Locale, Record<string, string>> = {
  vi: viSubcategories,
  ja: jaSubcategories,
}

export function t(key: string, locale: Locale = 'vi'): string {
  return MESSAGES[locale]?.[key] || MESSAGES['vi']?.[key] || key
}

export function tCategory(categoryKey: string, locale: Locale = 'vi'): string {
  return (
    CATEGORIES[locale]?.[categoryKey] ||
    CATEGORIES['vi']?.[categoryKey] ||
    categoryKey.replace(/_/g, ' ')
  )
}

export function tSubcategory(subcategoryKey: string, locale: Locale = 'vi'): string {
  return (
    SUBCATEGORIES[locale]?.[subcategoryKey] ||
    SUBCATEGORIES['vi']?.[subcategoryKey] ||
    subcategoryKey.replace(/_/g, ' ')
  )
}
