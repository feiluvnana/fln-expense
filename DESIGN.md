---
name: FLN Expense (Dứa Con)
description: Cozy feline-inspired personal finance management with Dinero.js arithmetic precision
colors:
  primary: '#df6826'
  primary-hover: '#c9561a'
  primary-active: '#b34a14'
  primary-light: '#fef4ec'
  primary-tint: '#ffedd5'
  primary-accent: '#e87b3a'
  bg: '#fbf8f4'
  bg-subtle: '#f5ede4'
  surface: '#ffffff'
  surface-warm: '#faf5ee'
  surface-hover: '#f5ebe0'
  text: '#28211d'
  text-secondary: '#574b44'
  text-muted: '#807269'
  text-subtle: '#a89b92'
  border: '#ece3d8'
  border-light: '#f4ede4'
  border-strong: '#ded3c5'
  border-hover: '#d1c3b5'
  border-subtle: '#d8cbbe'
  scrollbar-thumb: '#e3d5c5'
  scrollbar-thumb-hover: '#cfbeab'
  selection-color: '#7c2d12'
  income: '#0d9468'
  income-bg: '#edfcf4'
  income-border: '#a7f3d0'
  expense: '#db4c1a'
  expense-bg: '#fff5ed'
  expense-border: '#fed7aa'
  accent-pink: '#f472b6'
  shadow-soft: 'rgba(58, 41, 30, 0.08)'
  modal-scrim: 'rgba(35, 27, 22, 0.45)'
  subtle-overlay: 'rgba(0, 0, 0, 0.08)'
typography:
  scale:
    2xs: '0.7rem'
    xs: '0.72rem'
    sm: '0.74rem'
    label: '0.75rem'
    caption: '0.76rem'
    badge: '0.78rem'
    meta: '0.8rem'
    chip: '0.82rem'
    sub: '0.84rem'
    body-sm: '0.85rem'
    body-md: '0.88rem'
    body: '0.9rem'
    body-lg: '0.92rem'
    item-title: '0.95rem'
    base: '1rem'
    title-sm: '1.05rem'
    title-md: '1.1rem'
    title: '1.15rem'
    title-lg: '1.35rem'
    display: '1.75rem'
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '1.75rem'
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: '-0.02em'
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '1.15rem'
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: '-0.01em'
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '0.92rem'
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 'normal'
  mono:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    fontSize: '0.75rem'
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: '0.02em'
rounded:
  xs: '4px'
  sm: '6px'
  md: '8px'
  lg: '12px'
  xl: '18px'
  2xl: '24px'
  pill: '9999px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '14px'
  lg: '20px'
  xl: '32px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '#ffffff'
    rounded: '{rounded.lg}'
    padding: '10px 20px'
  button-primary-hover:
    backgroundColor: '{colors.primary-hover}'
    textColor: '#ffffff'
    rounded: '{rounded.lg}'
    padding: '10px 20px'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text}'
    rounded: '{rounded.xl}'
    padding: '20px 20px'
---

# Design System: Dứa Con (Cozy Feline Sanctuary)

## Overview

A warm, comforting personal finance design system directly inspired by a sleeping orange-and-white tabby cat resting on an office chair. It rejects generic cold corporate fintech blues and AI emoji-spam, replacing them with tactile cream/almond paper tones, warm ginger accents, single-thumb mobile ergonomics, and unified bespoke SVG iconography.

## Colors

- **Ginger Amber (`#df6826` / `#c9561a` / `#e87b3a`):** Primary brand accent, inspired by orange cat fur and warm hearth light.
- **Ivory Cream Ground (`#fbf8f4`, `#f5ede4`):** Soft, non-glaring background evoking milk froth and warm parchment.
- **Warm Milk White (`#ffffff`):** Foreground surface for cards and elevated interactive elements.
- **Espresso Charcoal (`#28211d`, `#574b44`, `#807269`):** High-contrast text hierarchy inspired by the dark mesh chair in the reference photograph.
- **Bamboo Sage (`#0d9468`, `#edfcf4`):** Serene positive status for Income and net positive balance.
- **Terracotta Persimmon (`#db4c1a`, `#fff5ed`):** Warm, clear indication for Expenses without aggressive alarmism.
- **Paw Pink (`#f472b6`):** Gentle accent for mascot ear and nose highlights.

## Typography

- **Font Family:** System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`) with tabular figures (`font-variant-numeric: tabular-nums`) enabled across all monetary amounts.
- **Hierarchy:**
  - Hero Balance: 1.75rem / 800 weight with tight -0.02em tracking.
  - Section Headings: 1.05rem - 1.15rem / 700 weight.
  - Item Titles: 0.95rem / 600 weight.
  - Meta/Subtitles: 0.75rem - 0.84rem / 500 weight.

## Layout

- **Mobile (< 860px):**
  - Sticky top brand bar with cat avatar and 1-tap language switch.
  - Content container with generous bottom padding (`calc(5.5rem + env(safe-area-inset-bottom))`).
  - Fixed frosted glass bottom navigation bar with thumb-accessible central Floating Action Button (`+`).
  - Slide-up bottom sheet modal with grab handle.
- **Desktop (>= 860px):**
  - Left persistent 260px warm sidebar with live currency balance widget, navigation, and language controls.
  - Generous main content area (max-width: 960px).

## Elevation & Depth

- **Card Depth:** Diffuse warm shadows (`box-shadow: 0 3px 12px -2px rgba(58, 41, 30, 0.07)`).
- **Floating Controls (FAB):** Ambient ginger glow (`box-shadow: 0 10px 25px -4px rgba(223, 104, 38, 0.28)`).
- **Modal Sheets:** Deep backdrop blur with warm scrim (`rgba(35, 27, 22, 0.45)`).

## Shapes

- Pill geometry (`border-radius: 9999px`) for segmented mode switches, currency pills, and category filters.
- Rounded corners (`8px - 24px`) for cards and transaction list items.
- Smooth tactile press transformations (`transform: translateY(1px)` or `scale(0.96)`).

## Components

- **Cat Mascot:** Dứa Con drawn as continuous-line hand-drawn illustration (Chibi Kawaii style) — an avatar face for brand identity, headers, sidebars, and browser favicons, and a relaxed sleeping sprawl for zero states, sourced from the photo in `public/image.png`. High-resolution WebP and PNG assets live in `src/assets/mascot/`, rendered responsively by `CatMascot.vue` with floating Zzz sleep marks and subtle rhythmic breathing animation. Browser icons are generated from the master avatar by `yarn icons`.
- **AppIcon:** Consistent stroke SVG icon system (24x24, 2px stroke, round caps) replacing all emojis.
- **Visual Category Picker:** Tactile category icon chips with interactive subcategory pill rows.
- **Multi-Currency Card:** Clean balance presentation with Dinero.js BigInt precision.

## Do's and Don'ts

- **DO** use bespoke SVG stroke icons with matching stroke width and line caps.
- **DO** use tabular numerals (`tabular-nums`) for currency amounts so columns align smoothly.
- **DO** keep touch targets >= 44px on mobile devices.
- **DON'T** use Unicode emoji glyphs (`🟢`, `🔴`, `📊`, `📑`, `🕒`, `📅`, etc.) as iconography.
- **DON'T** use generic Bootstrap/Tailwind saturated blue (`#2563eb`).
- **DON'T** use thick colored border-left/border-right on cards.
- **DON'T** rely on native `<select>` dropdowns for core transaction entry on mobile.
