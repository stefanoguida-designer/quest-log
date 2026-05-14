# Quest Log

Quest Log is a **mobile-first PWA** that behaves like a personal todo list but reads and feels like an **adventurer's journal**: dark pixel-dungeon visuals, heraldic copy, local quest persistence, and small motion beats for create / complete / delete.

The project exists to show that **spec-driven development can still produce a memorable, designer-led interface**. The core flows are intentionally simple, but the visual language is specific: a mundane task list reframed as a fantasy quest board.

## Run locally

Service workers require **http(s)**. Do not open `index.html` as a `file://` URL.

From the repository root:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080/](http://localhost:8080/).

**Data:** there is **no backend**. Quests are mock / local-only persistence via `localStorage` (`js/storage.js`), suitable for the training prototype.

## Product context

The product brief frames the app as a small, delightful alternative to emotionally flat todo apps. The primary user is someone capturing quick tasks on a phone who wants a bit of personality rather than another gray list. The secondary user is the reviewer following the BMAD + Cursor artifact chain.

The MVP scope is intentionally bounded:

- **In scope:** add, complete, restore, delete, active/completed sections, validation, empty states, local persistence, installable PWA shell, offline read behavior after a warm load, and fantasy-themed visual polish.
- **Out of scope:** accounts, sync, backend APIs, categories, priorities, due dates, and a full offline write queue.

For the canonical product definition, see [`docs/product-brief.md`](docs/product-brief.md) and [`docs/PRD.md`](docs/PRD.md).

## What was built

| Area | Files / assets |
| --- | --- |
| Shell + PWA metadata | `index.html`, `manifest.webmanifest` |
| Layout, theme, toast styles | `css/theme.css` |
| Motion | `css/motion.css` |
| Bootstrap, form, connectivity | `js/main.js` |
| State + mutations | `js/state.js` |
| Browser persistence | `js/storage.js` |
| UI copy | `js/strings.js` |
| Quest lists and empty states | `js/dom/render-list.js`, `js/dom/render-empty.js` |
| Offline banner + toasts | `js/dom/render-chrome.js`, `js/dom/render-toast.js` |
| Modal, king popup, torches | `js/modal.js`, `js/king.js`, `js/torch.js` |
| Service worker | `sw.js`, `js/pwa/register-sw.js`, `offline.html` |
| Visual assets | `assets/icons/*`, `assets/sprites/*`, `assets/ui/*` |

Primary flows are:

1. **Add** — Form submit validates empty / length cases, saves through `addQuest`, and can play an unfurl animation when motion is allowed.
2. **Complete** — The "Seal complete" control runs the completion mutation, plays the seal animation when allowed, then opens the king completion popup.
3. **Delete** — A themed confirm modal replaces native browser confirmation before deletion.
4. **Restore** — Completed quests can move back to active.
5. **Offline** — Mutating controls are disabled while offline and the user gets banner/toast feedback instead of a fake sync promise.

The implementation inventory is mirrored in [`docs/BMAD.md`](docs/BMAD.md); architectural ownership and the service worker precache list live in [`_bmad-output/planning-artifacts/architecture.md`](_bmad-output/planning-artifacts/architecture.md).

## Visual design decisions

The app uses a deliberate **dark pixel dungeon** aesthetic: a creative interpretation of the brief rather than a generic todo UI. Key decisions:

- **Palette:** Deep stone blacks, warm gold accents, and muted cream text create a warm dark mode with a fantasy RPG feel.
- **Pixel art assets:** Animated torches, a logo sigil, king/easter egg portraits, a stone tile, and a wood notice-board texture support the world without adding a heavy runtime.
- **Silkscreen font:** Chosen for its pixel-grid aesthetic and mobile readability at small sizes, used consistently across UI, modals, and error states.
- **Custom modal system:** Native browser dialogs are replaced with themed `showConfirm()` and `showAlert()` flows for a consistent in-world experience.

The torch spritesheet, logo sigil, and wood texture were drawn by the author — a pixel art illustrator — and integrated into the prototype as production-ready assets following a documented pixel art mobile workflow.

These choices were made to demonstrate that SDD works equally well when the designer brings a strong visual direction: the specs constrained the implementation without constraining the aesthetic.

## UX polish in the app

- **Motion:** completing a quest plays a short seal animation; deleting fades the row. New quests can play an unfurl animation after submit. All respect `prefers-reduced-motion`.
- **Toasts:** validation and offline messages use an in-page heraldic toast, not `window.alert`; dismiss with **Understood** or **Escape**.
- **King completion popup:** every time a quest is marked complete, a pixel art king portrait appears with a randomly selected royal commendation. The popup auto-dismisses after 5 seconds or can be closed manually. The contrast between the king's solemnity and the mundanity of the task is intentional.
- **Easter eggs:** two rare popup variants (`jester`, `hacker`) can appear with 1/20 probability each on quest completion. They reuse the king popup mechanics and were manually verified.
- **Animated torches:** two 5-frame pixel art torch sprites flank the title, rendered via canvas at ×2 scale with staggered timing for a natural flicker effect.
- **Wood texture empty state:** the active quest list uses a tiled pixel art wood plank texture when empty, evoking a bare notice board waiting for quests.
- **Accessibility polish:** modal focus trapping, toast focus restoration, decorative torch treatment, and landmark fixes were reviewed through iterative BMAD code review and axe checks.

## Offline behavior (MVP)

After a successful online load, the service worker precaches the app shell. While **offline**, create / complete / delete / restore actions are **disabled** and a banner explains that persistence is unavailable until the connection returns.

This is deliberate for a `localStorage`-only MVP: blocking mutations is clearer than implying a sync queue that does not exist. The fuller decision is recorded in [`_bmad-output/planning-artifacts/architecture.md`](_bmad-output/planning-artifacts/architecture.md).

## PWA notes

- The app is a static vanilla JavaScript PWA: no application framework, no mandatory bundler, and no backend.
- Styling is **custom CSS** (`css/theme.css`, `css/motion.css`) with shared tokens; no Tailwind/runtime CSS framework is bundled.
- The manifest is `manifest.webmanifest`; generated install icons live in `assets/icons/`.
- The service worker is `sw.js` at the repository root and uses immediate activation (`skipWaiting`, `clients.claim()`).
- The documented cache version is `questlog-shell-v34`; update the service worker and architecture precache list together when root assets change.

## BMAD + Cursor (how I worked)

The workflow was conversational and iterative, not a one-shot generation:

- **Claude as thinking partner:** Claude refined scope, challenged assumptions, translated design intent into structured Cursor instructions, and helped maintain awareness of the artifact chain across sessions.
- **BMAD for structure:** BMAD personas and skills produced the planning chain: product brief → PRD → architecture → user stories → verification evidence.
- **Cursor Agent for implementation:** Each feature was implemented from scoped prompts derived from the BMAD specs, with constraints and acceptance criteria defined before code changes.
- **Prompt engineering as design work:** Writing a good Cursor prompt proved structurally similar to writing a design brief: scope, constraints, acceptance criteria, examples, and explicit non-goals.

## AI integration logs

- The full BMAD planning pipeline was AI-driven: product brief, PRD, architecture, and user stories were generated via the corresponding BMAD skills / personas.
- `bmad-check-implementation-readiness` was run twice mid-project, catching doc drift and stale references before submission.
- `bmad-code-review` was run iteratively across four passes, surfacing and resolving accessibility gaps (modal focus trap, toast focus restoration, aria-hidden torches, landmark violations), PWA issues (SW registration timing, missing sprite precache), and interaction-state coverage.
- `bmad-review-adversarial-general` audited the document set for redundancy and staleness, resulting in two historical validation reports being archived and four artifacts updated.
- Lighthouse and axe audits were run against the live deployment; two moderate axe violations (`landmark-one-main`, `region`) were found and fixed before the final verification run.
- AI handled single-feature changes well; prompts spanning multiple files required tighter scoping and explicit "do not change unrelated files" constraints to avoid unintended side effects.

## What I learned

- **Structured IDs reduce drift:** Publishing **FR-Q / FR-P** in the PRD and mirroring them in `architecture.md` made ownership obvious and stopped silent scope creep.
- **Offline still needs a story without a backend:** For a `localStorage` MVP, blocking mutations offline with a banner and toast was clearer than pretending to queue writes.
- **Tooling depends on the machine:** Full `bmad-validate-prd` automation expects Python **3.11+** for the customization resolver; when that was missing, structured manual validation still added value.
- **The README is part of the deliverable:** A reviewer-facing README turns the folder into evidence for the course, not only runnable code.
- **SDD works with strong creative direction:** the spec chain (PRD → stories → architecture) did not constrain the visual identity — it freed it. Knowing the boundaries clearly made it easier to push creatively within them.

## Verification

Final verification was run against the live deployment in Chrome 124 / macOS incognito mode by Stefano Guida on 2026-05-13.

| Check | Result |
| --- | --- |
| Lighthouse Performance | 93 |
| Lighthouse Accessibility | 98 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |
| axe serious/critical | 0 violations (axe-core 4.7.0, empty-list state) |

Two moderate axe landmark violations (`landmark-one-main`, `region`) were found during review and fixed before the final run. The app now wraps content in a semantic `main` element. The full manual checklist, including keyboard, offline, install, and easter egg checks, is in [`_bmad-output/planning-artifacts/verification-checklist.md`](_bmad-output/planning-artifacts/verification-checklist.md).

## AI / BMAD integration

| Artifact | Path | Purpose |
| --- | --- | --- |
| Product brief | [`docs/product-brief.md`](docs/product-brief.md) | One-liner, problem, users, MVP scope |
| PRD | [`docs/PRD.md`](docs/PRD.md) | Functional requirements, NFRs, browser matrix |
| BMAD index | [`docs/BMAD.md`](docs/BMAD.md) | Component inventory, flows, current product / UX decisions |
| Architecture | [`_bmad-output/planning-artifacts/architecture.md`](_bmad-output/planning-artifacts/architecture.md) | ADRs, storage model, FR ownership, service worker precache |
| User stories + AC | [`_bmad-output/planning-artifacts/user-stories.md`](_bmad-output/planning-artifacts/user-stories.md) | US-01–US-06 and testable acceptance criteria |
| Verification checklist | [`_bmad-output/planning-artifacts/verification-checklist.md`](_bmad-output/planning-artifacts/verification-checklist.md) | Lighthouse, axe, keyboard, offline, install, manual checks |
| Project context | [`_bmad-output/planning-artifacts/project-context.md`](_bmad-output/planning-artifacts/project-context.md) | Submission-ready context snapshot for future agents |
| Latest PRD validation | [`_bmad-output/planning-artifacts/PRD-validation-report-current.md`](_bmad-output/planning-artifacts/PRD-validation-report-current.md) | Current validation report; status PASS |
| Final polish checklist | [`docs/final-polish-tasklist.md`](docs/final-polish-tasklist.md) | Documentation closure log |
| Design / UX audit | [`docs/design-ux-audit-tasklist.md`](docs/design-ux-audit-tasklist.md) | Visual, usability, PWA asset, and documentation-readiness audit |
| Optional backlog | [`docs/optional-tasklist.md`](docs/optional-tasklist.md) | Non-MVP follow-up ideas |
