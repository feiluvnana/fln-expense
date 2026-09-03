---
name: fln-expense
description: >-
  Comprehensive guide and domain instructions for developing, testing, and adding features to the FLN Expense (Dứa Chi Tiêu) app.
  Use this skill when modifying transactions, categories, multi-currency Dinero.js arithmetic, localizations, mobile components, or applying the Dứa Con cozy design system.
---

# FLN Expense (Dứa Chi Tiêu) Development Skill

This skill contains runbooks, conventions, and procedures for extending the FLN Expense web application.

---

## 1. Multi-Currency Arithmetic with Dinero.js

All currency calculations must use `dinero.js/bigint` to avoid IEEE 754 floating-point rounding errors.

### Creating and Formatting Amounts

```typescript
import { createDineroAmount, formatDineroAmount } from '@/utils/dineroHelpers'

// Create a Dinero instance from decimal number and currency code ('VND' | 'JPY' | 'USD')
const amount = createDineroAmount(150000, 'VND')

// Format for display based on active locale ('vi' | 'ja')
const formatted = formatDineroAmount(amount, 'vi') // e.g. "150.000 ₫"
```

### Performing Math

Always use functions from `dinero.js/bigint`:

```typescript
import { add, subtract, isNegative, isZero, isPositive } from 'dinero.js/bigint'

const total = add(amountA, amountB) // Currencies must match
const netBalance = subtract(incomeAmount, expenseAmount)
const isDeficit = isNegative(netBalance)
```

---

## 2. Adding or Modifying Categories

When adding new categories or subcategories:

1. **Register Identifiers in [`src/types/categories.ts`](src/types/categories.ts):**
   Add to `CATEGORY_IDENTIFIERS[type]`.
2. **Add SVG Icon in [`src/components/icons/AppIcon.vue`](src/components/icons/AppIcon.vue):**
   Ensure an icon case matches the category name, with 2px stroke and round caps.
3. **Add Localized Names:**
   - Vietnamese in [`src/locales/vi.ts`](src/locales/vi.ts) under `viCategories` and `viSubcategories`.
   - Japanese in [`src/locales/ja.ts`](src/locales/ja.ts) under `jaCategories` and `jaSubcategories`.

---

## 3. Dứa Con Design System Conventions

1. **No Unicode Emojis as UI Icons:**
   Never insert emojis (`🟢`, `🔴`, `📊`, `📑`, `📥`, `🕒`, `📅`, etc.) into template text or buttons.
   Always use `<AppIcon name="..." :size="16" />`.
2. **Colors & Spacing:**
   Reference CSS variables defined in [`src/assets/main.css`](src/assets/main.css):
   - Primary: `var(--primary)` (#df6826), `var(--primary-hover)`, `var(--primary-light)`
   - Surfaces: `var(--surface)` (#ffffff), `var(--surface-warm)` (#faf5ee), `var(--bg)` (#fbf8f4)
   - Text: `var(--text)` (#28211d), `var(--text-muted)` (#807269)
   - Income: `var(--income)` (#0d9468), `var(--income-bg)` (#edfcf4)
   - Expense: `var(--expense)` (#db4c1a), `var(--expense-bg)` (#fff5ed)
   - Mascot: Use `<CatMascot :size="40" variant="avatar" />` or `variant="sleeping"` for empty states.
3. **Tabular Numerals:**
   Always add class `tabular-nums` to elements rendering formatted money amounts.
4. **Touch Targets:**
   Mobile interactive elements must have at least 44x44px clickable area.

---

## 4. Verification Workflow

Before completing any task, execute:

```bash
# 1. Type-check TypeScript code
yarn type-check

# 2. Build production bundle
yarn build

# 3. Check and fix linting
yarn lint

# 4. Check for design token drift
node .agent/skills/impeccable/scripts/detect.mjs --json src/App.vue src/assets/main.css
```
