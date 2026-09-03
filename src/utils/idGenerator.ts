export function generateRandomId(prefix = 'tx'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`
  }
  const randomStr =
    Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 8)
  return `${prefix}_${randomStr}`
}
