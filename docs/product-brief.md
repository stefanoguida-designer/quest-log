# Product brief — Quest Log

_Version 1.0 — May 2026 · Author: Stefano_

## One-liner

Quest Log is a **mobile-first PWA** that behaves like a personal todo list but reads and feels like an **adventurer’s journal** — parchment tones, heraldic tone of voice, short motion beats on complete/delete/add.

## Problem

Mainstream todo apps are competent but emotionally flat. A designer-led prototype should show that **spec-driven development** can still deliver something memorable: clear flows (create, complete, delete, empty states) wrapped in a coherent fantasy metaphor without a backend.

## Target users

- **Primary:** People who live on their phone for quick capture and want a bit of delight, not another grey list.
- **Secondary:** Reviewers assessing **BMAD + Cursor** workflow — the artefact chain (PRD → architecture → stories → code) must be easy to follow.

## MVP scope (in)

- Single-page app: active + completed sections, local persistence (`localStorage`), installable PWA (manifest + service worker shell).
- Core flows: add quest (with validation), complete (with optional motion), delete (with confirm), restore completed to active, empty states for both sections.
- Offline **MVP:** after a successful online load, shell is cached; while offline, **mutations are disabled** with clear banner/toast — no fake “saved offline” queue for v1.

## Out of scope (v1)

- Accounts, sync, server API.
- Categories, due dates, priorities.
- Full offline write queue (documented as future if product direction changes).

## Success signals

- All core flows demonstrable on **375px** and **1280px** widths.
- PWA install path and offline shell behaviour explainable in README + verification checklist.
- Tone and motion respect **`prefers-reduced-motion`**.

## Related documents

| Document | Path |
| --- | --- |
| PRD | `docs/PRD.md` |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` |
| User stories + AC | `_bmad-output/planning-artifacts/user-stories.md` |
| BMAD index | `docs/BMAD.md` |
| Final polish checklist | `docs/final-polish-tasklist.md` |
| Latest PRD validation | `_bmad-output/planning-artifacts/PRD-validation-report-current.md` |
| Optional backlog | `docs/optional-tasklist.md` |
