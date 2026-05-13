# Quest Log

PWA todo list framed as an adventurer’s journal. I keep product definition in [`docs/PRD.md`](docs/PRD.md). Architecture and planning artifacts live under [`_bmad-output/planning-artifacts/`](_bmad-output/planning-artifacts/).

**Live demo:** [quest-log-amber-sigma.vercel.app](https://quest-log-amber-sigma.vercel.app)

## Run locally

Service workers require **http(s)** — do not open `index.html` as a `file://` URL.

From the repository root:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080/](http://localhost:8080/).

**Data:** there is **no backend**; quests are **mock / local-only** persistence via `localStorage` (`js/storage.js`), suitable for the training prototype.

## BMAD + Cursor (how I worked)

The workflow was conversational and iterative, not a one-shot generation:
- **Claude as thinking partner:** I used Claude to refine scope, challenge assumptions, and translate design intent into structured prompts before touching Cursor. Each feature started as a conversation, not a ticket.
- **Cursor Agent for implementation:** Once the spec was clear, I passed structured prompts to Cursor Agent to implement against the existing codebase — always scoped, always with explicit constraints (don't change unrelated files, keep existing class names, bump SW cache version).
- **BMAD for structure:** BMAD personas (PM, Architect, UX Designer) kept the artifact chain visible — PRD → user stories → architecture → code — and surfaced gaps before they became bugs. The UX Designer audit mid-project caught P0 issues (missing PWA icons, stale docs) that would have affected the submission.
- **Prompt engineering as design work:** Writing a good Cursor prompt is structurally similar to writing a good design brief — scope, constraints, acceptance criteria, examples. SDD made this explicit.

## Visual design decisions

The app uses a deliberate **dark pixel dungeon** aesthetic — a creative interpretation of the brief rather than a generic todo UI. Key decisions:

- **Palette:** Deep stone blacks, warm gold accents, and muted cream text — a warm dark mode with a fantasy RPG feel.
- **Pixel art assets:** Animated torch sprites (5-frame spritesheet, canvas-rendered at ×3 scale), a hand-crafted logo sigil, and a tiled stone background texture — all following a documented pixel art mobile workflow.

The torch spritesheet, logo sigil, and wood texture were drawn by the author — a pixel art illustrator — and integrated into the prototype as production-ready assets following a documented pixel art mobile workflow.

- **Silkscreen font:** Chosen for its pixel-grid aesthetic and mobile readability at small sizes, used consistently across UI, modals, and error states.
- **Custom modal system:** All native browser dialogs replaced with themed modals — `showConfirm()` and `showAlert()` — for a consistent in-world experience.

These choices were made to demonstrate that SDD works equally well when the designer brings a strong visual direction — the specs constrained the implementation without constraining the aesthetic.

## What I learned

- **Structured IDs reduce drift:** Publishing **FR-Q / FR-P** in the PRD and mirroring them in `architecture.md` made ownership obvious and stopped “silent” scope creep.
- **Offline still needs a story without a backend:** For a `localStorage` MVP, blocking mutations offline (banner + toast) was clearer and safer than implying a sync queue I was not going to build.
- **Tooling depends on the machine:** Full `bmad-validate-prd` automation expects Python **3.11+** for the customization resolver; when that was missing, I still got value from a structured manual validation (`PRD-validation-report-current.md`).
- **The README is part of the deliverable:** A short artifact map plus this reflection turns the folder into evidence for the course, not only runnable code.
- **SDD works with strong creative direction:** the spec chain (PRD → stories → architecture) did not constrain the visual identity — it freed it. Knowing the boundaries clearly made it easier to push creatively within them.

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
- **King completion popup:** every time a quest is marked complete, a pixel art king portrait appears with a randomly selected royal commendation. The popup auto-dismisses after 5 seconds or can be closed manually. The contrast between the king's solemnity and the mundanity of the task is intentional.
- **Animated torches:** two 5-frame pixel art torch sprites flank the title, rendered via canvas at ×2 scale with staggered timing for a natural flicker effect.
- **Wood texture empty state:** the active quest list uses a tiled pixel art wood plank texture when empty, evoking a bare notice board waiting for quests.

## PWA notes

- Icons: `assets/icons/` (generated PNGs from `assets/sprites/logo.png` for favicon and install).
- Styling is **custom CSS** (`css/theme.css`, `css/motion.css`) with shared tokens — no Tailwind/runtime CSS framework in the bundle, for a smaller critical path and simpler offline behavior.

## Verification

Follow [`_bmad-output/planning-artifacts/verification-checklist.md`](_bmad-output/planning-artifacts/verification-checklist.md) for Lighthouse (PWA + performance) and axe / keyboard checks against the PRD. Optional improvements: [`docs/optional-tasklist.md`](docs/optional-tasklist.md). Doc-quality closure log: [`docs/final-polish-tasklist.md`](docs/final-polish-tasklist.md).
