---
project_name: Quest log
status: submission-ready
date: '2026-05-13'
classification: web_app
projectType: pwa
source_artifacts:
  - docs/product-brief.md
  - docs/PRD.md
  - docs/BMAD.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/user-stories.md
  - _bmad-output/planning-artifacts/verification-checklist.md
---

# Project Context - Quest Log

## Project Summary

Quest Log is a mobile-first Progressive Web Application for tracking personal tasks as fantasy quests. It is a designer-led todo prototype that demonstrates a BMAD + Cursor artifact chain from product brief to PRD, architecture, user stories, implementation, and verification evidence.

## Current Status

Submission-ready. Core behavior is implemented and the primary BMAD artifacts are aligned with the current codebase. Remaining work, if requested by the submission process, is runtime evidence capture from Lighthouse, accessibility checks, browser smoke tests, and offline behavior checks.

## Stack

- Runtime: Vanilla JavaScript with ES modules.
- Styling: Custom CSS in `css/theme.css` and `css/motion.css`; no application JavaScript framework.
- Persistence: `localStorage` with the `questlog.v1.state` state blob.
- PWA: `manifest.webmanifest`, `sw.js`, `offline.html`, app icons, and service worker app-shell precache.
- Build: No build pipeline required; static server from repository root.

## Visual Direction

Dark pixel dungeon. The interface uses stone surfaces, dark panels, gold accents, cream text, wood texture, torch animation, a logo sigil, pixel-art sprites, and heraldic copy. Motion moments include quest unfurl, completion seal, delete fade, and reduced-motion-safe fallbacks.

## Canonical Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| Product brief | `docs/product-brief.md` | Product vision, users, MVP scope, and success signals |
| PRD | `docs/PRD.md` | Functional requirements, NFRs, browser matrix, technical constraints, and success criteria |
| BMAD index | `docs/BMAD.md` | Artifact map and current code/component inventory |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` | Architecture decisions, service worker precache, storage model, and FR ownership |
| User stories | `_bmad-output/planning-artifacts/user-stories.md` | US-01 through US-06 and cross-cutting acceptance criteria |
| PRD validation | `_bmad-output/planning-artifacts/PRD-validation-report-current.md` | Current PRD validation report; status PASS |
| Verification checklist | `_bmad-output/planning-artifacts/verification-checklist.md` | Lighthouse, accessibility, keyboard, offline, and manual verification checklist |

## Implementation Snapshot

- Shell and PWA metadata: `index.html`, `manifest.webmanifest`.
- Service worker: `sw.js`, cache `questlog-shell-v28`.
- App bootstrap and connectivity: `js/main.js`.
- State and persistence: `js/state.js`, `js/storage.js`.
- Rendering: `js/dom/render-list.js`, `js/dom/render-empty.js`, `js/dom/render-chrome.js`, `js/dom/render-toast.js`.
- UI support: `js/modal.js`, `js/king.js`, `js/torch.js`.
- Visual assets: `assets/icons/*`, `assets/sprites/*`, `assets/ui/*`.

## Product Decisions

- Core flows: create, complete, delete, restore, empty states, installable PWA.
- Completed section: hidden until at least one quest is completed.
- Offline MVP: after a successful online load, the shell is cached; while offline, mutations are blocked with banner/toast feedback instead of pretending to queue writes.
- Security guardrail: no accounts, no backend, no secrets, no telemetry unless explicitly added later.

## Submission Readiness Notes

- PRD validation status: PASS.
- Artifact alignment: current.
- Codebase alignment: service worker cache, precache list, manifest path, app icons, sprite assets, restore flow, king popup, loading/error states, and offline mutation policy are documented.
- Runtime verification: checklist exists; fields are marked N/A for prototype submission unless the reviewer requires captured Lighthouse or axe evidence.
