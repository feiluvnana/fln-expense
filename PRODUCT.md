# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Individuals, freelancers, and students managing everyday personal finances across multiple currencies (VND, JPY, USD), primarily in Vietnamese and Japanese. They frequently record quick daily expenses on mobile while on the go (coffee, meals, transit, shopping) as well as track recurring income and review spending summaries.

## Product Purpose

A delightful, warm, and stress-free personal expense manager that makes recording and reviewing finances feel cozy and effortless rather than clinical or stressful.

## Positioning

Unlike sterile, generic corporate fintech dashboards cluttered with emojis or dense accounting grids, FLN Expense offers a calming, tactile feline-inspired sanctuary ("Dứa Con / Cozy Neko") that balances precision arithmetic (via Dinero.js) with warm, thoughtful micro-interactions, clean bespoke SVG iconography, and an intuitive mobile-first flow.

## Operating Context

- **Primary Device:** Mobile smartphones (iOS & Android web browsers) used single-handedly during quick checkout moments (supermarket, coffee shops, transit).
- **Secondary Device:** Desktop / laptop browser for deeper monthly reviews, analytics, and data management.
- **Ambient Scene:** On the move in bustling cafes or stores, or relaxing on the couch in warm evening light.

## Capabilities and Constraints

- **Capabilities:**
  - Multi-currency support: VND, JPY, USD with zero rounding errors via Dinero.js BigInt representations.
  - Expense and income categorization with hierarchical categories and subcategories.
  - Interactive financial analytics with doughnut, comparison, and currency distribution charts (Chart.js).
  - Date-grouped transaction history with filtering by transaction type (all, expense, income).
  - Full localization in Vietnamese (`vi`) and Japanese (`ja`) with persistent language selection.
  - LocalStorage persistence with resilient serialization.
- **Constraints:**
  - Zero third-party icon fonts or emoji abuse; all icons must be unified, bespoke SVG stroke icons.
  - Strictly mobile-ready: thumb-friendly bottom navigation, bottom-sheet transaction drawers, high-contrast touch targets (>=44px), and seamless desktop sidebar scaling.
  - Responsive Chart.js themes matching the warm color palette.

## Brand Commitments

- **Visual Inspiration:** The relaxed, chubby ginger-and-white tabby cat named Dứa sleeping on an office chair (`public/image.png`).
- **Aesthetic Tone:** "Cozy Feline Sanctuary" — warm ginger honey (#E77728), buttery cream backgrounds (#FAF6F0, #F3ECE2), soft charcoal typography (#2A2421), warm terracotta for expenses, serene sage green for income, and soft paw-pink accents.
- **Voice:** Calm, reassuring, warm, unhurried, respectful. No AI jargon, no emoji overload.

## Evidence on Hand

- Reference photo: `public/image.png` (sleeping orange-white tabby cat).
- Existing transaction dataset and seed schema in `src/stores/transactionStorage.ts`.
- Complete locale dictionaries for Vietnamese and Japanese in `src/locales/`.

## Product Principles

1. **Effortless Mobile Ergonomics:** Everything reachable by the thumb. Quick add is front-and-center, modal entry feels snappy with visual category pills.
2. **Warmth Without Clutter:** Cozy, organic, tactile aesthetics inspired by ginger cat warmth, avoiding cold generic templates while keeping typography crisp và legible.
3. **Dignified Iconography:** Authored, consistent SVG stroke icons replace all generic Unicode emojis.
4. **Financial Clarity & Precision:** BigInt precision via Dinero.js, clean currency separation, clear negative/positive visual semantics.

## Accessibility & Inclusion

- Meets WCAG AA contrast standards (minimum 4.5:1 for body and controls against cream/sand backgrounds).
- Generous touch targets (at least 44x44px for primary mobile interactions).
- Explicit semantic HTML with ARIA labels on all icon-only buttons.
