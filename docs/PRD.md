---
classification: web_app
projectType: pwa
date: '2026-05-12'
inputDocuments:
  - docs/product-brief.md
  - _bmad-output/planning-artifacts/user-stories.md
mvpStack: "Vanilla JS (ES modules) + custom CSS + localStorage + service worker precache"
---

# Product Requirements Document

## Quest Log — A Todo Application for the Valiant and Organised

_Prepared by: Stefano, Product Designer_  
_Version: 1.0 — May 2026_

### Traceability

- **Product brief:** [`docs/product-brief.md`](product-brief.md)
- **User stories + acceptance criteria:** [`_bmad-output/planning-artifacts/user-stories.md`](../_bmad-output/planning-artifacts/user-stories.md)
- **Architecture (component inventory, NFR decisions):** [`_bmad-output/planning-artifacts/architecture.md`](../_bmad-output/planning-artifacts/architecture.md)
- **Latest PRD validation report:** [`_bmad-output/planning-artifacts/PRD-validation-report-current.md`](../_bmad-output/planning-artifacts/PRD-validation-report-current.md)

---

## Overview

**Quest Log** is a Progressive Web Application (PWA) for tracking personal tasks, disguised as the adventurer's journal it was always meant to be. Every todo is a quest. Every completed task, a victory worthy of song.

The application is built for mobile-first use, installable on the home screen of any device, and designed to make the mundane act of ticking off a list feel like the stuff of legend.

---

## Problem Statement

The realm of personal productivity is vast and largely joyless. Applications that help citizens manage their daily duties are numerous, but few inspire the weary adventurer to rise from their bedroll and face the day with courage. Quest Log addresses this grievous oversight.

---

## Goals

- Provide a fully functional todo application covering create, complete, delete, restore, and empty-state experiences.
- Deliver a visually cohesive RPG fantasy aesthetic — parchment textures, medieval typography, heraldic details — without relying on heavy custom illustration.
- Ship as a PWA: installable, offline-capable shell, home-screen-ready.
- Ensure a **responsive, polished** primary experience on mobile (touch targets, readable type), while remaining usable on desktop.
- **Styling:** custom CSS with shared design tokens (colours, type, spacing); no mandatory CSS utility framework in the MVP bundle.

---

## Non-Goals

- Backend integration or user accounts (mock/local data only for this prototype).
- Quest categories, priorities, or due dates (out of scope for V1).
- Multiplayer guild features (a man can dream).

---

## Target User

**The Overwhelmed Adventurer** — a person aged 20–40 who uses their phone as their primary productivity device, appreciates craft and humour in software, and is tired of apps that feel like spreadsheets wearing a hoodie.

Secondary persona: **The Designer Presenting a Portfolio Piece** — someone who needs to demonstrate SDD and BMAD methodology through a prototype that is memorable enough to be worth showing.

---

## User Stories (Summary)

Full stories with acceptance criteria: [`_bmad-output/planning-artifacts/user-stories.md`](../_bmad-output/planning-artifacts/user-stories.md).

| ID | As a... | I want to... | So that... |
| --- | --- | --- | --- |
| US-01 | Adventurer | Add a new quest | I can track what must be done |
| US-02 | Adventurer | Mark a quest as complete | I can celebrate my victories |
| US-03 | Adventurer | Delete a quest | I can abandon what no longer serves the realm |
| US-04 | Adventurer | See all active and completed quests | I have a full view of my journey |
| US-05 | Adventurer | See an empty state when no quests exist | I am welcomed into the realm, not greeted by a void |
| US-06 | Adventurer | Install the app on my home screen | It feels like a real app, not a browser tab |

---

## Functional Requirements

### Quest Management

- **Create:** A text input field allows the user to enter a quest name and submit it (via button or Enter key). The quest appears immediately in the active list. Empty or whitespace-only submission is rejected with non-blocking feedback. Maximum title length **200 characters** (aligned with validation and UX copy).
- **Complete:** An action on an active quest marks it complete; it moves to a "Completed Quests" section with a visual distinction (struck through, faded, and/or seal metaphor). Optional short motion; must respect reduced-motion preference.
- **Delete:** Each quest has an abandon/delete action. A **confirmation** step is permitted (browser confirm or inline pattern) to prevent accidental loss.
- **Restore:** A completed quest may return to the active list (product decision for parity with list state).
- **Persistence:** Quest state persists across full page reloads on the same device and browser profile (storage mechanism as specified in **Technical Constraints**).

### Empty States

- Active list empty: flavour text encouraging the adventurer to inscribe a first quest, plus a clear path to the input control.
- Completed list empty: distinct copy when there are active quests but no completed ones.

### PWA Requirements

- **`manifest.webmanifest`** (linked from HTML as `manifest`) with name, short name, icons (including 192 and 512), theme/background colours, `display: standalone`, `start_url` and `scope`.
- **Service worker** precaching the app shell; navigation fallback to **`offline.html`** when appropriate.
- App icons: heraldic / scroll motif PNGs generated from the in-app logo as required by the manifest.

### Requirement IDs (engineering traceability)

These IDs are **stable** and align with [`_bmad-output/planning-artifacts/architecture.md`](../_bmad-output/planning-artifacts/architecture.md) (FR → module mapping) and manual verification.

| ID | Capability |
| --- | --- |
| **FR-Q01** | Create quest: submit from input (button or Enter); trim / length validation; new row in active list. |
| **FR-Q02** | Complete quest: move active → completed with distinct visuals; optional seal motion when allowed. |
| **FR-Q03** | Delete or restore: delete from active or completed (with confirm as implemented); restore completed → active. |
| **FR-Q04** | Persistence: all user-visible mutations survive a full reload on the same device and profile; storage engine as specified under **Technical Constraints**. |
| **FR-Q05** | Empty state when there are zero active quests (welcoming copy + affordance to add). |
| **FR-Q06** | Empty state for completed section when nothing completed yet (distinct from FR-Q05). |
| **FR-P01** | PWA manifest (`manifest.webmanifest`) correctly linked; metadata for install. |
| **FR-P02** | Service worker: versioned precache of shell URLs; offline navigation fallback where applicable. |
| **FR-P03** | Icon set (SVG + 192/512 PNG, maskable entry for the manifest) for install surfaces. |

---

## Non-Functional Requirements

Measurable NFRs below complement **Technical Constraints** (stack choices). Verification: `_bmad-output/planning-artifacts/verification-checklist.md` and Lighthouse mobile profile where noted.

| ID | Requirement | Verification hint |
| --- | --- | --- |
| **NFR-PERF-01** | **LCP** on a cold load over **simulated Slow 4G** (Chrome DevTools) shall be **≤ 2.5 s** on the main journal view after first meaningful paint of shell + list chrome. | Lighthouse Performance run; repeat in incognito. |
| **NFR-PERF-02** | No application JavaScript framework in the MVP bundle; third-party script surface limited to **font stylesheet** (and static hosting only). | Network panel + repo tree review. |
| **NFR-OFF-01** | After a successful online load, the service worker serves a precached shell. **While offline, mutations that persist to storage are blocked**; banner + in-app toast explain the state — no silent data loss. On reconnect, persisted state reloads from storage (e.g. on `visibilitychange`). | Manual offline toggle + checklist row “Offline MVP”. |
| **NFR-A11Y-01** | Primary flows (create, complete, delete, restore, dismiss toast) are **fully operable with keyboard**; visible **`:focus-visible`** affordances. | Manual tab path; optional axe serious/critical = 0. |
| **NFR-A11Y-02** | **WCAG 2.2 Level AA** is the **target** for text and interactive contrast on default theme (body copy and controls). | Contrast spot-check + axe. |
| **NFR-MOT-01** | Motion for unfurl / seal / delete shall respect **`prefers-reduced-motion: reduce`** (no blocking animation-only paths). | OS/browser reduced-motion toggle. |

### Browser matrix (MVP)

| Engine | Context | Support level |
| --- | --- | --- |
| Chromium | Chrome Android, Chrome desktop | **Primary** — full manual regression each release. |
| WebKit | Safari iOS, Safari macOS | **Primary** — install + offline shell smoke test. |
| Gecko | Firefox desktop | **Secondary** — smoke test (load, CRUD, offline banner). |

### SEO

**Out of scope for v1** (internal prototype / training deliverable hosted ad hoc): no sitemap, structured data, or SEO engineering required unless the app is later deployed on a public marketing URL — then add indexing policy as a follow-up PRD amendment.

---

## Design Direction

### Visual Language

**Fantasy classic.** Warm parchment backgrounds, aged paper textures achieved through CSS (gradients — optional noise). Gold and deep burgundy as primary accent colours. Forest green for success/completion accents where needed.

### Typography

- Display / headings: **Cinzel** (or similar) from Google Fonts.
- Body / UI: **Source Serif 4** (or similar) for legibility at small sizes.

### Tone of Voice

The application speaks in the manner of a royal herald or ancient tome. Task creation is "Inscribe." Empty states are narrated, not labelled. Validation and offline messages use the same register (toast/banner, not blocking system dialogs except optional delete confirm).

### Key Interaction Moments

- Adding a quest: brief unfurl animation (when motion is allowed).
- Completing: seal/stamp effect (within ~600ms budget when motion is allowed).
- Deleting: fade from the record (when motion is allowed).

---

## Technical Constraints

- **Framework:** **Vanilla JavaScript** with ES modules — no React/Vue runtime for this MVP.
- **Styling:** Custom CSS (`theme.css`, `motion.css`); design tokens in `:root`.
- **Fonts:** Google Fonts via CDN (first load online; shell still usable offline after cache).
- **No build pipeline** required for the prototype phase — static server + browser module graph.
- **Data:** `localStorage` only, no backend.

---

## Success Criteria

| Criterion | Definition of Done |
| --- | --- |
| All core flows prototyped | Create, complete, delete, restore, empty states functional with mock/local data |
| BMAD artifacts | Product brief, PRD, architecture / component inventory, user stories with AC — paths referenced in README |
| Responsive | Works well at **375px** (mobile) and **1280px** (desktop) |
| PWA installable | Valid manifest + registered service worker; basic Lighthouse PWA checks pass locally |
| README present | Setup instructions (`http.server` or equivalent), offline MVP behavior, AI/BMAD integration notes |
| Aesthetic coherence | Visual language and heraldic tone consistent across UI, empty states, and toasts |
