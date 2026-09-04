---
name: fln-expense
description: >-
  Comprehensive guide and domain instructions for developing, testing, and adding features to the FLN Expense (Dứa Chi Tiêu) app.
  Use this skill when modifying transactions, recurring items, categories, multi-currency Dinero.js arithmetic, localizations,
  mobile components, persistence, import/export, or applying the Dứa Con cozy design system.
---

# FLN Expense (Dứa Chi Tiêu) Development Skill

Runbooks, conventions, and procedures for extending the FLN Expense web application.
This file is the shared domain reference for every coding agent on this repo — `CLAUDE.md` and
`GEMINI.md` are thin entry points that route here.

## 0. Architecture at a glance

| Concern | Where |
| --- | --- |
| App shell, view switching, locale state | [`src/App.vue`](../../../src/App.vue) — no router library; a `currentView` ref of `'dashboard' \| 'all' \| 'recurring'` |
| Views | [`DashboardView.vue`](../../../src/views/DashboardView.vue), [`AllTransactionsView.vue`](../../../src/views/AllTransactionsView.vue), [`RecurringView.vue`](../../../src/views/RecurringView.vue) |
| Transaction state | [`src/stores/expenseStore.ts`](../../../src/stores/expenseStore.ts) (Pinia setup store) |
| Recurring state | [`src/stores/recurringStore.ts`](../../../src/stores/recurringStore.ts) |
| Persistence (LocalStorage + JSON serde) | [`src/stores/transactionStorage.ts`](../../../src/stores/transactionStorage.ts), recurring serde lives in `recurringStore.ts` |
| Money primitives | [`src/utils/dineroHelpers.ts`](../../../src/utils/dineroHelpers.ts) |
| i18n | [`src/locales/i18n.ts`](../../../src/locales/i18n.ts) + [`vi.ts`](../../../src/locales/vi.ts) / [`ja.ts`](../../../src/locales/ja.ts) |
| Icons / mascot | [`AppIcon.vue`](../../../src/components/icons/AppIcon.vue), [`CatMascot.vue`](../../../src/components/CatMascot.vue) |
| Design tokens | [`src/assets/main.css`](../../../src/assets/main.css) `:root`, documented in [`DESIGN.md`](../../../DESIGN.md) |

Stack: Vue 3 (Composition API + `<script setup>`), TypeScript, Pinia, `dinero.js/bigint`, Chart.js, Vite.
Path alias `@/` → `src/`.

---

## 1. Multi-Currency Arithmetic with Dinero.js

All currency calculations must use `dinero.js/bigint` to avoid IEEE 754 floating-point rounding errors.
Supported codes: `'VND' | 'JPY' | 'USD'` (`SupportedCurrencyCode`).

### Creating and Formatting Amounts

```typescript
import { createDineroAmount, formatDineroAmount, getDineroDecimalNumber } from '@/utils/dineroHelpers'

// Create a Dinero instance from a decimal number and currency code
const amount = createDineroAmount(150000, 'VND')

// Format for display based on active locale ('vi' | 'ja')
const formatted = formatDineroAmount(amount, 'vi') // e.g. "150.000 ₫"

// Back to a plain number — ONLY for chart data or form inputs, never for math
const decimal = getDineroDecimalNumber(amount)
```

### Performing Math

Always use functions from `dinero.js/bigint`:

```typescript
import { add, subtract, isNegative, isZero, isPositive } from 'dinero.js/bigint'

const total = add(amountA, amountB) // Currencies must match
const netBalance = subtract(incomeAmount, expenseAmount)
const isDeficit = isNegative(netBalance)
```

Never `+`, `-`, or `*` two amounts as numbers. Totals are always kept **per currency** —
`Partial<Record<SupportedCurrencyCode, Dinero<bigint>>>` — never summed across currencies.
See `totalIncomeByCurrency` / `netBalanceByCurrency` in `expenseStore.ts` for the pattern.

### Serialization

`Dinero` objects cannot be `JSON.stringify`-ed directly. Persisted shapes store
`{ minorUnits: string, currencyCode }` and are rebuilt on load:

- Transactions: `serializeTx` / `deserializeTx` in `transactionStorage.ts`
- Recurring items: `serializeRecurringItem` / `deserializeRecurringItem` in `recurringStore.ts`

Both deserializers return `null` on malformed input — keep that tolerance when editing, so a
corrupted LocalStorage entry degrades to "skip this record" instead of a blank app.

---

## 2. Adding or Modifying Categories

Categories are a two-level tree in [`src/types/categories.ts`](../../../src/types/categories.ts):
`CATEGORY_IDENTIFIERS[type][categoryKey] = [subcategoryKey, ...]`.

When adding a category or subcategory, do all four steps:

1. **Register identifiers** in `src/types/categories.ts` under `CATEGORY_IDENTIFIERS.expense` or `.income`.
2. **Add an SVG icon case** in [`AppIcon.vue`](../../../src/components/icons/AppIcon.vue) matching the top-level
   category key (2px stroke, round caps, 24×24 viewBox). Existing icon names:
   `back backup business_and_freelance calendar cat chart check clock close dashboard database
   debt_and_loans delete download edit education entertainment filter food_and_dining
   gifts_and_grants healthcare housing import investments loans_and_debts note other_expense
   other_income pencil pet_care plus receipt repeat salary_and_wages search shopping sparkles
   time transactions transportation trash upload utilities x`
3. **Add localized names** — Vietnamese in `viCategories` / `viSubcategories` ([`vi.ts`](../../../src/locales/vi.ts))
   and Japanese in `jaCategories` / `jaSubcategories` ([`ja.ts`](../../../src/locales/ja.ts)). Missing keys fall
   back to `vi`, then to the raw key with underscores replaced — so a missing translation is silent. Check both.
4. **Check the chart palette** in [`chartConfig.ts`](../../../src/utils/chartConfig.ts) still has a colour for
   the new category.

---

## 3. Recurring Items

[`RecurringItem`](../../../src/types/recurring.ts) models a scheduled income/expense:
`frequency: 'monthly' | 'weekly' | 'yearly'`, `dueDay` (1–31 for monthly), `active`, and `lastLoggedDate`.

- Store: [`recurringStore.ts`](../../../src/stores/recurringStore.ts), LocalStorage key `fln_recurring_v1`.
- `logItemAsTransaction(item)` is the bridge into `expenseStore` — it creates a real transaction and stamps
  `lastLoggedDate`. `isLoggedThisMonth(item)` drives the "already logged" UI state.
- `projectedIncomeByCurrency` / `projectedExpenseByCurrency` aggregate only `active` items, per currency.
- UI: [`RecurringView.vue`](../../../src/views/RecurringView.vue) + [`RecurringModal.vue`](../../../src/components/RecurringModal.vue).

When adding a field to `RecurringItem`, update `SerializedRecurringItem`, both serde functions, the
modal form, and the sample data in [`sampleData.ts`](../../../src/utils/sampleData.ts) together.

---

## 4. Persistence, Import & Export

- Transactions live under LocalStorage; loading is via `loadStoredTransactions()`, writing via
  `persistTransactions(list)`. Every store mutation calls `persist()` — keep that invariant.
- Sample data and recurring defaults are only available/seeded in dev environment (`import.meta.env.DEV`).
- [`DataManagementModal.vue`](../../../src/components/DataManagementModal.vue) handles JSON export, import
  (`'replace' | 'merge'` — merge de-duplicates by `id`), sample-data loading, and clear-all.
- Sample data: [`src/utils/sampleData.ts`](../../../src/utils/sampleData.ts) (`RAW_SAMPLE_DATA`,
  `RAW_SAMPLE_RECURRING`) plus the shipped [`public/sample-data.json`](../../../public/sample-data.json).
  Keep the two in sync when either changes.
- IDs come from `generateRandomId(prefix)` in [`idGenerator.ts`](../../../src/utils/idGenerator.ts).

---

## 5. Localization: Vietnamese & Japanese

Every user-facing string must exist in **both** `vi` and `ja`.

```typescript
import { t, tCategory, tSubcategory, type Locale } from '@/locales/i18n'

t('addTx', locale)               // UI copy from viMessages / jaMessages
tCategory('food_and_dining', locale)
tSubcategory('coffee_tea', locale)
```

Locale is owned by `App.vue` (`fln_locale` in LocalStorage) and passed down as a `locale` prop.
Components take `locale: Locale` as a prop rather than reading storage themselves.

Japanese is denser and Vietnamese is longer — check both locales for truncation and wrapping on
mobile widths after any copy or layout change.

---

## 6. Dứa Con Design System Conventions

The visual identity comes from **Dứa Con**, the ginger-and-white tabby in `public/image.png`.
[`DESIGN.md`](../../../DESIGN.md) is the authority for the full token set; the rules below are the ones
that get broken most often.

1. **No Unicode emoji as UI icons.** Never put `🟢 🔴 📊 📑 📥 🕒 📅` into template text, labels, or buttons.
   Always `<AppIcon name="..." :size="16" />`.
2. **Tokens, not hex.** Reference the CSS variables from [`main.css`](../../../src/assets/main.css):
   - Primary: `var(--primary)` `#df6826`, `var(--primary-hover)`, `var(--primary-light)`, `var(--primary-tint)`
   - Surfaces: `var(--surface)` `#ffffff`, `var(--surface-warm)` `#faf5ee`, `var(--bg)` `#fbf8f4`, `var(--bg-subtle)`
   - Text: `var(--text)` `#28211d`, `var(--text-secondary)`, `var(--text-muted)` `#807269`, `var(--text-subtle)`
   - Income: `var(--income)` `#0d9468`, `var(--income-bg)` `#edfcf4`
   - Expense: `var(--expense)` `#db4c1a`, `var(--expense-bg)` `#fff5ed`
   - Accent: `var(--accent-pink)` `#f472b6`
   - Radii `--radius-sm|md|lg|xl|pill`, shadows `--shadow-sm|card|float|modal`
   Raw hex is acceptable only inside mascot/illustration SVG artwork.
3. **Mascot.** `<CatMascot :size="40" variant="avatar" />` for brand avatars, `variant="sleeping"` for
   peaceful zero states, `variant="banner"` for wide headers.
4. **Tabular numerals.** Every element rendering a formatted money amount carries the `tabular-nums` class.
5. **Touch targets.** Mobile interactive elements are at least 44×44px.
6. **Layout split at 860px.** Below: fixed bottom nav ([`MobileBottomNav.vue`](../../../src/components/MobileBottomNav.vue))
   with safe-area padding and a centred elevated FAB; forms open as slide-up bottom sheets
   ([`TransactionModal.vue`](../../../src/components/TransactionModal.vue)). At and above: persistent left
   sidebar ([`AppSidebar.vue`](../../../src/components/AppSidebar.vue)) with per-currency balance cards.
7. **Horizontal scrollers.** Use the global `v-horizontal-scroll` directive
   ([`src/directives/horizontalScroll.ts`](../../../src/directives/horizontalScroll.ts), registered in
   [`main.ts`](../../../src/main.ts)) for wheel-to-horizontal and drag-to-scroll. When you also need arrow
   buttons and edge-fade state, use the [`useHorizontalScroll`](../../../src/utils/useHorizontalScroll.ts)
   composable instead. Do not hand-roll a third variant.

For any substantive visual work, drive it through the design skill rather than free-handing it:
see [`.agents/skills/impeccable/SKILL.md`](../impeccable/SKILL.md).

---

## 7. Verification Workflow

Run before completing any task:

```bash
# 1. Type-check TypeScript + Vue SFCs
yarn type-check

# 2. Build production bundle (also runs type-check)
yarn build

# 3. Lint and autofix (oxlint + eslint)
yarn lint

# 4. Design token / anti-pattern drift check on the files you touched
node .claude/skills/impeccable/scripts/detect.mjs --json src/App.vue src/assets/main.css
```

`yarn format` (Prettier) is available but not part of the gate. Node ≥ 22.18 is required.
