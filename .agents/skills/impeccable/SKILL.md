---
name: impeccable
description: >-
  Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden,
  optimize, adapt, animate, colorize, extract, or otherwise improve the FLN Expense frontend. Covers visual
  hierarchy, information architecture, accessibility, responsive behavior, theming, anti-patterns, typography,
  spacing, layout, color, motion, micro-interactions, UX copy, error and empty states, i18n, mascot and icon
  artwork, and the design-token system. Not for backend-only or non-UI tasks.
argument-hint: "[shape · audit|critique · animate|bolder|colorize|delight|layout|overdrive|quieter|typeset · adapt|clarify|distill · harden|onboard|optimize|polish · init|document|extract|live] [target]"
---

# Impeccable — design workflow for FLN Expense

The full skill (playbooks, detectors, comp tooling, ~180 files) is vendored **once** per working copy at
`.claude/skills/impeccable/`. It is not duplicated per agent — every agent reads the same copy, so the
design system, detector rules, and generated artifacts never drift apart. That directory is installed
locally and is not tracked in git; if it is missing, say so and ask the user to install the skill rather
than free-handing the design work. The committed outputs it produces — `DESIGN.md`, `PRODUCT.md`,
`.impeccable/` — *are* in the repo and remain authoritative either way.

## How to use it

1. **Read the skill body first:** [`.claude/skills/impeccable/SKILL.md`](../../../.claude/skills/impeccable/SKILL.md).
   It defines the principles, modes, and the commands table. Follow it as written; treat
   `<skill-base-dir>` in that file as `.claude/skills/impeccable`.
2. **Run setup once per session,** with cwd at the repo root:
   ```bash
   node .claude/skills/impeccable/scripts/context.mjs --target <file-or-route>
   ```
   It loads `PRODUCT.md`, `DESIGN.md`, and the matching surface brief from `.impeccable/surfaces/`.
   Follow its directives and do not rerun it.
3. **Load the playbook** for the requested sub-command from `.claude/skills/impeccable/reference/`
   (`shape.md`, `audit.md`, `polish.md`, `delight.md`, `colorize.md`, `document.md`, `live.md`, …), or
   `reference/new-work.md` for a brand-new surface.
4. **Before editing any UI,** load `.claude/skills/impeccable/reference/craft-floor.md` — the quality floor
   and the absolute bans.

## Project-specific facts

- Committed design system: [`DESIGN.md`](../../../DESIGN.md). Product truth: [`PRODUCT.md`](../../../PRODUCT.md).
- Surface briefs and config live in `.impeccable/`.
- Domain rules (money, i18n, categories, component conventions) are in
  [`.agents/skills/fln-expense/SKILL.md`](../fln-expense/SKILL.md) — a design change must not break them.
- Dev server: `yarn dev` (Vite). Verification gate: `yarn type-check && yarn build && yarn lint`.

## Subagents

Claude Code loads four helper agents from `.claude/agents/`: `impeccable-asset-producer`,
`impeccable-documenter`, `impeccable-finish-reviewer`, `impeccable-manual-edit-applier`.

Agents without subagent support should not skip that work — perform it inline instead, using the
degraded-mode instructions written for exactly this case:
`.claude/skills/impeccable/reference/degraded/{asset-producer,documenter,finish-reviewer,manual-edit-applier}.md`.

## Hooks

`.claude/settings.local.json` wires `scripts/hook.mjs` into Claude Code (immediate checks after
Edit/Write on UI files, a full-rule pass on Stop). On a runtime without hooks, run the detector by hand
after touching UI:

```bash
node .claude/skills/impeccable/scripts/detect.mjs --json <files you changed>
```
