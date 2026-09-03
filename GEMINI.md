# GEMINI.md — FLN Expense (Dứa Chi Tiêu) Project Guide

FLN Expense is a delightful, mobile-first personal finance management web application built with Vue 3 (Composition API + `<script setup>`), TypeScript, Pinia, Dinero.js (BigInt edition), Chart.js, and Vite.

The visual identity and design system is inspired directly by **Dứa Con** — a relaxed, sleeping ginger-and-white tabby cat.

---

## 🐾 Brand & Design System: Dứa Con (Cozy Feline Sanctuary)

1. **Color Palette:**
   - **Primary Ginger Amber:** `--primary: #df6826;`, hover `#c9561a`, active `#b34a14`, light `#fef4ec`
   - **Cream & Milk Grounds:** `--bg: #fbf8f4;`, subtle ground `#f5ede4`, surfaces `#ffffff`, warm card surface `#faf5ee`
   - **Espresso Charcoal Text:** `--text: #28211d;`, secondary `#574b44`, muted `#807269`, subtle `#a89b92`
   - **Financial Indicators:** Bamboo Sage for Income (`#0d9468`, bg `#edfcf4`); Terracotta Persimmon for Expense (`#db4c1a`, bg `#fff5ed`)
   - **Mascot Pink Accent:** `--accent-pink: #f472b6;`

2. **Strict Iconography Rule:**
   - **NO EMOJI ABUSE:** Never use Unicode emoji glyphs (e.g., `🟢`, `🔴`, `📊`, `📑`, `📥`, `🕒`, `📅`) as icons in the UI.
   - Always use the unified SVG stroke icon component: [`AppIcon.vue`](src/components/icons/AppIcon.vue) with 2px stroke width, rounded caps, and 24x24 viewBox.
   - Use [`CatMascot.vue`](src/components/CatMascot.vue) for the brand avatar and peaceful zero-state illustrations.

3. **Mobile-First Ergonomics:**
   - **Mobile (< 860px):** Fixed bottom navigation bar ([`MobileBottomNav.vue`](src/components/MobileBottomNav.vue)) with safe-area padding and a center elevated Floating Action Button (`+`) for single-thumb transaction logging. Form opens as an ergonomic slide-up Bottom Sheet ([`TransactionModal.vue`](src/components/TransactionModal.vue)) with visual category chips.
   - **Desktop (>= 860px):** Persistent left sidebar ([`AppSidebar.vue`](src/components/AppSidebar.vue)) with currency balance cards, quick navigation, and language switch.

---

## 💰 Currency & Financial Logic: Dinero.js

- All monetary calculations are performed with BigInt precision via `dinero.js/bigint`.
- **Zero Floating-Point Drift:** Never perform native floating-point math (`+`, `-`, `*`) directly on currency amounts.
- Helper utilities reside in [`src/utils/dineroHelpers.ts`](src/utils/dineroHelpers.ts):
  - `createDineroAmount(val, currencyCode)`
  - `formatDineroAmount(dineroInstance, locale)`
  - `getDineroDecimalNumber(dineroInstance)`
- Currencies currently supported: `VND`, `JPY`, `USD`.
- Store operations (`addTransaction`, `updateTransaction`, `deleteTransaction`) are managed via Pinia in [`src/stores/expenseStore.ts`](src/stores/expenseStore.ts) and persisted to LocalStorage via [`src/stores/transactionStorage.ts`](src/stores/transactionStorage.ts).

---

## 🌐 Localization: Vietnamese & Japanese

- All user-facing strings, categories, and subcategories must be localized in both Vietnamese (`vi`) and Japanese (`ja`).
- Locale dictionaries:
  - [`src/locales/vi.ts`](src/locales/vi.ts)
  - [`src/locales/ja.ts`](src/locales/ja.ts)
- Helper functions in [`src/locales/i18n.ts`](src/locales/i18n.ts):
  - `t(key, locale)`
  - `tCategory(catKey, locale)`
  - `tSubcategory(subKey, locale)`

---

## 🛠️ Verification & Quality Commands

Always run these verification commands before committing changes:

```bash
# Type checking
yarn type-check

# Production build
yarn build

# Linting (oxlint + eslint)
yarn lint

# Design token detector
node .agent/skills/impeccable/scripts/detect.mjs --json src/App.vue src/assets/main.css
```
