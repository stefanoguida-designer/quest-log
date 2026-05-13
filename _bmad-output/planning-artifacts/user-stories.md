# User stories — Quest Log (MVP)

_Artifact referenced from `docs/PRD.md` frontmatter (`inputDocuments`). Engineering IDs **FR-Q01–FR-Q07** and **FR-P01–FR-P03** are defined in the PRD (section *Requirement IDs*). Acceptance criteria below are testable checklists._

## US-01 — Add a new quest

**As an** adventurer **I want** to add a new quest **so that** I can track what must be done.

### Acceptance criteria

1. Given the app is open and online, when I enter non-empty text in the quest field and submit (button or Enter), then a new quest appears in the active list within one frame tick after the handler runs.
2. Given I submit only whitespace, then no quest is created and I see a non-destructive validation message (heraldic tone).
3. Given the title exceeds 200 characters, submission is rejected with a clear message (same tone).
4. Given I create a quest while online and `localStorage` is available, then the new quest is written immediately to `questlog.v1.state` and remains in the active list after page reload.

## US-02 — Mark a quest complete

**As an** adventurer **I want** to mark a quest complete **so that** I can celebrate my victories.

### Acceptance criteria

1. Given an active quest, when I activate its “complete” control, then it moves to the completed section and shows at least one completed visual treatment (strike, reduced luminance, or seal overlay) as required by FR-Q02.
2. Given I complete a quest while online and `localStorage` is available, then the completed state is written immediately to `questlog.v1.state` and remains in the completed section after page reload.
3. Given an active quest is sealed complete, then a king completion popup appears as celebratory feedback and can be dismissed.
4. Given reduced motion is enabled, then completion still works without relying on blocking animation.

## US-03 — Delete a quest

**As an** adventurer **I want** to delete a quest **so that** I can abandon what no longer serves the realm.

### Acceptance criteria

1. Given a quest in active or completed, when I choose delete and confirm (if enabled), then the row is removed immediately, `questlog.v1.state` is updated, and the quest does not reappear after reload.
2. Given confirm is shown, dismissing it requires at most one extra explicit action and does not remove other quests.

## US-04 — See active and completed quests

**As an** adventurer **I want** to see all active and completed quests **so that** I have a full view of my journey.

### Acceptance criteria

1. The active section is visible and labelled on mobile and desktop breakpoints; the completed section remains hidden until at least one quest is completed, then appears as a labelled, visually distinct section.
2. Order is stable: newest active first (by creation); completed ordered by completion time (newest first) unless otherwise documented.
3. Given a completed quest, when I activate “Reopen”, then the quest returns to the active list, `questlog.v1.state` is updated immediately, and the quest remains active after reload.

## US-05 — Empty states

**As an** adventurer **I want** empty states **so that** I am welcomed into the realm, not greeted by a void.

### Acceptance criteria

1. When there are zero active quests, the active empty state shows narrative copy within 80–220 characters and a visible control to create the first quest (FR-Q05).
2. When there are zero completed quests, the completed section remains hidden; once at least one quest is completed, completed quests appear in their own section (FR-Q06).

## US-06 — Install PWA

**As an** adventurer **I want** to install the app **so that** it feels like a real app, not a browser tab.

### Acceptance criteria

1. `manifest.webmanifest` is linked from `index.html` and validates in Chrome Application panel.
2. `display` is `standalone` and theme/background colours are set.
3. Icons include 192 and 512 PNG and a maskable entry passes visual mask check on at least one matrix device (manual).

## Cross-cutting — Persistence (FR-Q04)

1. Given the app is online and `localStorage` is available, create, complete, delete, and restore mutations are persisted immediately to the `questlog.v1.state` blob.
2. Given any persisted mutation has completed, reloading the page preserves the expected active/completed/deleted state.
3. Given a storage write fails, the app presents non-destructive error feedback instead of silently losing the user action.

## Cross-cutting — Offline (NFR-OFF-01 / architecture)

1. After a warm load, with network disabled, the cached shell still loads from the service worker.
2. While offline, create/complete/delete/restore actions do not persist; a single status banner explains the realm is unreachable; reconnect + refresh restores persisted state.

## Cross-cutting — Required UI states (FR-Q07)

1. Given the app boots, then a loading state simulates the scroll being retrieved before the journal renders.
2. Given `?error=1` is present, then the app shows a polished retrieval error state with a retry control.
3. Given a storage save fails, then the app presents non-destructive error feedback instead of silently losing the user action.

## Cross-cutting — Interaction states

1. Primary, ghost, quest action, toast, modal, retry, and king-popup controls expose hover, active, focus-visible, and disabled states where applicable.
2. Given the app is offline, then mutation controls are disabled and the offline banner explains why actions cannot persist.
