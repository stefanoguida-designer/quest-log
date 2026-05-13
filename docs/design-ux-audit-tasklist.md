# Design and UX audit tasklist — Quest Log

_Auditor: Sally, UX Designer · Date: 2026-05-13_

## Scope

This audit covers the user-facing app, visual system, interaction states, accessibility, PWA/install surfaces, assets, and BMAD/documentation chain.

Primary references reviewed:

- `index.html`, `css/theme.css`, `css/motion.css`, `styles.css`
- `js/main.js`, `js/modal.js`, `js/strings.js`, `js/dom/*`, `js/torch.js`
- `manifest.webmanifest`, `sw.js`, `offline.html`, `assets/*`
- `README.md`, `docs/PRD.md`, `docs/product-brief.md`, `docs/BMAD.md`, `docs/optional-tasklist.md`
- `_bmad-output/planning-artifacts/*`

## Executive assessment

Quest Log already has a memorable identity: compact mobile layout, dark pixel-dungeon atmosphere, gold accents, animated torches, and copy that turns ordinary todo actions into ritual. The app feels distinctive rather than generic.

The main risk identified during the audit was drift: the live app had become a dark pixel-art dungeon UI while parts of the PRD still described an older visual direction. The current BMAD artifacts should now treat dark pixel dungeon as the canonical V1 direction and keep PWA asset/cache details aligned with the code.

The project can become design-complete by choosing one canonical visual direction, repairing the install/offline asset chain, tightening accessibility on controls and dialogs, and adding verification evidence to the docs.

## What is working well

- The single-screen information architecture is appropriate for the MVP: input, active quests, completed quests, and empty states are all visible without navigation.
- The pixel-art presentation in the screenshot has strong personality and clear brand recall.
- The task vocabulary mostly supports the fantasy metaphor: quests, seal complete, abandon, chronicle, realm.
- The app already respects reduced motion for list animations in `css/motion.css`.
- The documentation chain is unusually strong for a small prototype: brief, PRD, architecture, stories, verification checklist, and BMAD index are all present.

## P0 — Must fix before calling the design complete

### 1. Repair PWA install and offline asset integrity — resolved

Status: **Resolved**. `manifest.webmanifest` and `sw.js` reference the generated `/assets/icons/icon-192.png` and `/assets/icons/icon-512.png` files, and `sw.js` now precaches the live visual assets (`logo.png`, `stone-tile.png`, `torch-spritesheet.png`, `king.png`) plus UI textures (`wood-tile.png`, `nail.png`) under cache `questlog-shell-v28`.

Tasks:

- Done — keep `assets/icons/icon-192.png` and `assets/icons/icon-512.png` generated from the canonical logo source.
- Done — live visual sprites and UI textures are in the precache list so the offline shell retains its designed appearance after warm load.
- Done — service-worker cache name is `questlog-shell-v28`.
- Done — `docs/BMAD.md`, `README.md`, `architecture.md`, and `optional-tasklist.md` describe the current icon and cache behavior.

Acceptance criteria:

- Chrome Application panel shows no missing manifest icons.
- Service worker installation succeeds on a clean profile.
- After a warm load, offline reload preserves the logo, stone background, and torches or documents a deliberate fallback.
- The verification checklist has a dated sign-off row for install/offline visual integrity.

### 2. Maintain the canonical visual direction

Issue: the live app uses a dark dungeon pixel-art system with Silkscreen as the main UI font, stone/wood textures, logo sigil, torch sprites, and a king completion popup. The project should keep all specs and artifact indexes aligned to that single visual language.

Tasks:

- Treat “Dark Pixel Dungeon” as the canonical V1 direction.
- Keep PRD Design Direction, product brief wording, architecture visual notes, and README UX polish notes aligned when UI assets change.
- Add a short visual foundation section with tokens for color, typography, texture, radius, border, spacing, and motion.

Acceptance criteria:

- PRD, README, architecture, screenshot, and CSS all describe the same design system.
- The design direction can be summarized in one sentence and implemented without guessing.
- All user-facing copy examples use the same voice and action vocabulary.

## P1 — Should fix for a polished user experience

### 3. Unify core action copy — partially resolved

Status: **Resolved for add button and validation copy**. `js/strings.js` now defines `addButton: 'Add'`, `index.html` renders the submit button text from `strings.addButton`, and validation copy lives in `js/strings.js`. Remaining copy polish: modal action labels still use generic “Confirm” and “Cancel”.

Tasks:

- Done — render the submit button text from `strings.addButton` and choose “Add” deliberately.
- Done — validation labels live in `js/strings.js`; modal action labels remain a separate polish item.
- Rename modal actions to match the fantasy tone where clarity allows, for example “Abandon” / “Keep quest”.
- Keep destructive actions explicit; do not let flavour obscure consequences.

Acceptance criteria:

- No duplicated user-facing strings across feature modules.
- Create, complete, restore, delete, validation, toast, offline, and modal copy all follow the same tone.
- The primary create CTA matches the PRD and README.

### 4. Improve accessibility and touch ergonomics

Issue: The app has good foundations, but several interaction details need an audit pass. Quest action buttons appear below the 44px touch-target target, the modal lacks a labelled dialog title/description relationship, focus is not trapped inside the modal, and toast focus behavior may be disruptive. **Resolved:** decorative torches now check `prefers-reduced-motion: reduce` and render a static first frame instead of animating.

Tasks:

- Set quest action controls to a minimum 44px touch target or provide equivalent spacing.
- Add dialog labelling (`aria-labelledby` or `aria-describedby`) and a focus trap for the custom modal.
- Re-check toast semantics: one live announcement path, dismissable by keyboard, no surprise focus steal unless the message requires immediate action.
- Done — stop torch animation and render a static first frame when `prefers-reduced-motion: reduce` is active.
- Verify that offline disabled states do not make important controls such as toast dismiss impossible to operate.

Acceptance criteria:

- Keyboard path covers input, add, complete, restore, abandon, modal confirm/cancel, toast dismiss, and retry.
- Axe/Lighthouse accessibility has zero serious or critical issues on empty and populated states.
- Touch controls remain comfortable at 320px, 375px, and 430px widths.

### 5. Polish responsive layout and readability

Issue: The screenshot is visually strong at a narrow mobile width, but the all-pixel typography and small metadata/actions can become tiring. Long quest titles wrap, actions consume horizontal space, and desktop behavior is documented but not evidenced.

Tasks:

- Review layouts at 320, 375, 430, 768, and 1280px.
- Decide whether body/UI copy should stay fully pixel-font or use a more readable secondary font for metadata and longer empty states.
- Stress-test long quest names, many quests, empty active list, active-only list, completed list, loading state, error state, and offline banner.
- Capture reference screenshots for approved states.

Acceptance criteria:

- Body copy and metadata remain readable without zoom on mobile.
- Quest titles and action rows do not visually collapse with long content.
- Desktop layout feels intentionally framed, not just a stretched mobile card.

### 6. Reduce performance and loading friction

Issue: The app loads three font families but uses Silkscreen for nearly all visible UI. It also waits 1.5 seconds before restoring the app shell, which creates drama but may make a small utility feel slower than it is.

Tasks:

- Remove unused font families or document why they are retained for the chosen visual direction.
- Consider self-hosting/subsetting WOFF2 fonts if offline visual fidelity matters.
- Re-evaluate the artificial loading delay; keep it only if it adds enough delight to justify the wait.
- Add a Lighthouse run result to release notes or verification docs.

Acceptance criteria:

- Cold-load performance target from the PRD is checked and recorded.
- Font loading does not create a jarring fallback or unnecessary network cost.
- Loading animation does not block the primary task longer than intended.

## P2 — Nice to have, but important for “perfect” docs

### 7. Add a compact UX state inventory

Tasks:

- Document each state: first run empty, active quests, completed quests, empty completed, validation error, long-title error, delete modal, toast, offline banner, offline fallback page, loading state, demo error state, reduced-motion state, and install state.
- For each state, record purpose, trigger, copy source, visual treatment, accessibility notes, and verification method.

Acceptance criteria:

- A future agent can update a state without searching multiple files to infer design intent.
- Every state maps to one or more files and at least one manual verification step.

### 8. Refresh documentation truthfulness — resolved for current validation/cache refs

Status: **Resolved for current PRD validation and service-worker cache references**. `_bmad-output/planning-artifacts/PRD-validation-report-current.md` now reports `overallStatus: PASS`, and architecture / `docs/BMAD.md` align with `sw.js` cache `questlog-shell-v28`.

Tasks:

- Done — current PRD validation report is refreshed.
- Done — architecture cache version references match `sw.js`.
- Done — historical validation reports are being kept as archive/audit trail material.
- Add a design-decision note for the selected visual direction.

Acceptance criteria:

- “Current” validation findings match the current PRD.
- Cache names, asset paths, icon paths, and file mappings agree across code and docs.
- Historical reports remain useful but cannot be mistaken for open defects.

### 9. Clean stale or misleading implementation artifacts

Issue: `styles.css` appears to be a legacy stylesheet, is not linked from `index.html`, and references asset paths that do not match the current sprite/UI asset layout. These are small, but they reduce confidence in the polish level.

Tasks:

- Remove `styles.css` if it is no longer used, or rename/archive it as design history.
- Keep modal interaction handlers free of routine console logging.
- Done — `strings.addButton` is used for the chosen “Add” CTA.

Acceptance criteria:

- No stale stylesheet points to nonexistent assets.
- No routine user interaction emits console noise.
- No unused or duplicate create-CTA copy remains.

## Final design-readiness checklist

The project is design-ready when all of the following are true:

- One canonical visual direction is reflected in app, docs, and screenshots.
- PWA install/offline behavior works on a clean browser profile.
- Manifest icons and offline visual assets are resolved.
- All UI states have documented copy, purpose, accessibility notes, and verification steps.
- Primary flows are comfortable by touch and fully operable by keyboard.
- Motion respects reduced-motion preferences, including decorative torch animation.
- Lighthouse/axe/manual checks have dated evidence.
- Historical docs are clearly separated from current truth.

