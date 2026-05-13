# Quest Log

PWA todo list framed as an adventurer’s journal. I keep product definition in [`docs/PRD.md`](docs/PRD.md). Architecture and planning artifacts live under [`_bmad-output/planning-artifacts/`](_bmad-output/planning-artifacts/).

## Run locally

Service workers require **http(s)** — do not open `index.html` as a `file://` URL.

From the repository root:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080/](http://localhost:8080/).

**Data:** there is **no backend**; quests are **mock / local-only** persistence via `localStorage` (`js/storage.js`), suitable for the training prototype.

## BMAD + Cursor (how I worked)

1. **Specs first:** I wrote the product brief and PRD under `docs/`, then architecture and user stories under `_bmad-output/planning-artifacts/`, so I always had one trace chain before touching UI code (goals → FR/US IDs → files).
2. **Cursor as editor + agent:** I used chats and Composer to implement the vanilla PWA (`js/`, `css/`, `sw.js`) against those specs; BMAD skills (for example PRD validation and architecture) helped me keep structure and quality gates visible.
3. **Iteration:** When validation flagged gaps (dedicated NFR section, measurability), I tightened the PRD and checklists before adding behavior, instead of coding ahead of the spec.

## What I learned

- **Structured IDs reduce drift:** Publishing **FR-Q / FR-P** in the PRD and mirroring them in `architecture.md` made ownership obvious and stopped “silent” scope creep.
- **Offline still needs a story without a backend:** For a `localStorage` MVP, blocking mutations offline (banner + toast) was clearer and safer than implying a sync queue I was not going to build.
- **Tooling depends on the machine:** Full `bmad-validate-prd` automation expects Python **3.11+** for the customization resolver; when that was missing, I still got value from a structured manual validation (`PRD-validation-report-current.md`).
- **The README is part of the deliverable:** A short artifact map plus this reflection turns the folder into evidence for the course, not only runnable code.

## AI / BMAD integration

| Artifact | Path |
| --- | --- |
| Product brief | `docs/product-brief.md` |
| PRD | `docs/PRD.md` |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` |
| User stories + AC | `_bmad-output/planning-artifacts/user-stories.md` |
| Verification checklist | `_bmad-output/planning-artifacts/verification-checklist.md` |
| BMAD index (artifacts + mapping) | [`docs/BMAD.md`](docs/BMAD.md) |
| Final polish checklist | [`docs/final-polish-tasklist.md`](docs/final-polish-tasklist.md) |
| Design / UX audit | [`docs/design-ux-audit-tasklist.md`](docs/design-ux-audit-tasklist.md) |
| Latest PRD validation | [`_bmad-output/planning-artifacts/PRD-validation-report-current.md`](_bmad-output/planning-artifacts/PRD-validation-report-current.md) |
| Optional backlog | [`docs/optional-tasklist.md`](docs/optional-tasklist.md) |

## Offline behavior (MVP)

After a successful load, the service worker precaches the app shell. While **offline**, create / complete / delete / restore actions are **disabled** and a banner explains that persistence is unavailable until the connection returns — see architecture doc (NFR-OFF-01 decision).

## UX polish in the app

- **Motion:** completing a quest plays a short seal animation; deleting fades the row. New quests can play an unfurl animation after submit. All respect `prefers-reduced-motion`.
- **Toasts:** validation and offline messages use an in-page heraldic toast (not `window.alert`); dismiss with **Understood** or **Escape**.

## PWA notes

- Icons: `assets/icons/` (generated PNGs from `assets/sprites/logo.png` for favicon and install).
- Styling is **custom CSS** (`css/theme.css`, `css/motion.css`) with shared tokens — no Tailwind/runtime CSS framework in the bundle, for a smaller critical path and simpler offline behavior.

## Verification

Follow [`_bmad-output/planning-artifacts/verification-checklist.md`](_bmad-output/planning-artifacts/verification-checklist.md) for Lighthouse (PWA + performance) and axe / keyboard checks against the PRD. Optional improvements: [`docs/optional-tasklist.md`](docs/optional-tasklist.md). Doc-quality closure log: [`docs/final-polish-tasklist.md`](docs/final-polish-tasklist.md).
