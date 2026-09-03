# FLN Expense (Dứa Chi Tiêu) — Agent Guide

Mobile-first personal finance web app: **Vue 3** (Composition API + `<script setup>`), **TypeScript**,
**Pinia**, **Dinero.js** (BigInt edition), **Chart.js**, **Vite**. No router library — `src/App.vue`
swaps views through a `currentView` ref. Path alias `@/` → `src/`.

The visual identity is **Dứa Con**, the relaxed ginger-and-white tabby in `public/image.png`.

---

## Read before working

| Source | What it holds |
| --- | --- |
| [`.agents/skills/fln-expense/SKILL.md`](.agents/skills/fln-expense/SKILL.md) | **Start here.** Architecture map and domain runbooks: Dinero math, categories, recurring items, persistence and import/export, i18n, design conventions. |
| [`DESIGN.md`](DESIGN.md) | The committed design system — every token, type scale, spacing step, motion curve. |
| [`PRODUCT.md`](PRODUCT.md) | Product truth: users, purpose, positioning, operating context, constraints. |
| [`.agents/skills/impeccable/SKILL.md`](.agents/skills/impeccable/SKILL.md) | Design workflow; routes to the full vendored skill in `.claude/skills/impeccable/`. |

These files are shared by every coding agent on this repo. `GEMINI.md` and `CLAUDE.md` are identical
thin entry points — put durable knowledge in the skill or in `DESIGN.md`/`PRODUCT.md`, not here.

---

## Non-negotiables

1. **No emoji as UI icons.** Never `🟢 🔴 📊 📑 📥 🕒 📅` in template text, labels, or buttons.
   Always `<AppIcon name="..." :size="16" />` — a 2px-stroke, round-cap, 24×24 SVG set
   ([`src/components/icons/AppIcon.vue`](src/components/icons/AppIcon.vue)).
2. **No float math on money.** Every amount is a `Dinero<bigint>`; use `add` / `subtract` /
   `isNegative` from `dinero.js/bigint` and the helpers in
   [`src/utils/dineroHelpers.ts`](src/utils/dineroHelpers.ts). Totals stay **per currency** — VND, JPY and
   USD are never summed together.
3. **Localize both locales.** Every user-facing string exists in
   [`vi.ts`](src/locales/vi.ts) *and* [`ja.ts`](src/locales/ja.ts). Missing keys fall back silently, so
   check both.
4. **Tokens, not raw hex.** Use the CSS variables in [`src/assets/main.css`](src/assets/main.css)
   (`--primary`, `--surface-warm`, `--text-muted`, `--income`, `--expense`, `--radius-*`, `--shadow-*`).
   Raw hex only inside mascot/illustration SVG artwork.
5. **Mobile ergonomics.** Layout splits at 860px: bottom nav + slide-up bottom sheets below, persistent
   sidebar above. Interactive targets are at least 44×44px.
6. **`tabular-nums`** on every element rendering a formatted amount.

---

## Verify before finishing

```bash
yarn type-check   # vue-tsc
yarn build        # production bundle (runs type-check too)
yarn lint         # oxlint + eslint, with --fix
node .claude/skills/impeccable/scripts/detect.mjs --json src/App.vue src/assets/main.css
```

Swap the detector's file list for whatever UI files you actually touched. Node ≥ 22.18 required.
