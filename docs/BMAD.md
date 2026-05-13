# BMAD — Quest Log (artifact index)

_Orientation doc only. The binding specifications are the **PRD**, **product brief**, **architecture**, and **user stories**; the code in this repository is the behavioral source of truth._

## Canonical artifacts

| Artifact | Path | Role |
| --- | --- | --- |
| Product brief | [`product-brief.md`](product-brief.md) | Scope, users, MVP in/out |
| PRD | [`PRD.md`](PRD.md) | Requirements, **FR-Q / FR-P** IDs, NFR summary |
| Architecture | [`../_bmad-output/planning-artifacts/architecture.md`](../_bmad-output/planning-artifacts/architecture.md) | ADRs, SW precache, FR → file mapping |
| User stories + AC | [`../_bmad-output/planning-artifacts/user-stories.md`](../_bmad-output/planning-artifacts/user-stories.md) | US-01–US-06, testable acceptance criteria |
| Verification checklist | [`../_bmad-output/planning-artifacts/verification-checklist.md`](../_bmad-output/planning-artifacts/verification-checklist.md) | Lighthouse, axe, manual checks |
| Current PRD validation | [`../_bmad-output/planning-artifacts/PRD-validation-report-current.md`](../_bmad-output/planning-artifacts/PRD-validation-report-current.md) | Report dated 2026-05-12 (Warning; refresh recommended after final doc alignment) |
| Optional backlog | [`optional-tasklist.md`](optional-tasklist.md) | Non-MVP improvements |
| Final polish checklist | [`final-polish-tasklist.md`](final-polish-tasklist.md) | Structural doc closure (completed) |
| Design / UX audit | [`design-ux-audit-tasklist.md`](design-ux-audit-tasklist.md) | Visual, usability, PWA asset, and documentation-readiness tasklist |

## Component inventory ↔ files (as implemented)

| Concept | File / entry |
| --- | --- |
| Shell + PWA meta | `index.html` |
| Layout, theme, toast | `css/theme.css` |
| Motion | `css/motion.css` |
| Bootstrap, form, connectivity | `js/main.js` |
| State + mutations | `js/state.js` |
| Browser persistence | `js/storage.js` |
| UI copy | `js/strings.js` |
| Quest lists | `js/dom/render-list.js` |
| Empty states | `js/dom/render-empty.js` |
| Offline banner | `js/dom/render-chrome.js` |
| Heraldic toast | `js/dom/render-toast.js` |
| Torch animation | `js/torch.js` |
| Custom modal | `js/modal.js` |
| King completion popup | `js/king.js` |
| Service worker registration | `js/pwa/register-sw.js` |
| Manifest | `manifest.webmanifest` |
| Service worker | `sw.js` |
| Offline fallback | `offline.html` |
| Icons | `assets/icons/*` |
| Pixel art sprites | `assets/sprites/torch-spritesheet.png`, `assets/sprites/logo.png`, `assets/sprites/stone-tile.png` |
| UI textures | `assets/ui/wood-tile.png`, `assets/ui/nail.png` |
| PWA icons | `assets/icons/icon-192.png`, `assets/icons/icon-512.png` |

## Primary flows (aligned with code)

1. **Add** — Form submit → validation (empty / length) → `addQuest` → toast on error; unfurl animation when motion is allowed.
2. **Complete** — “Seal complete” control (when online) → seal animation or immediate update if reduced motion → `completeQuest` → king completion popup.
3. **Delete** — Custom confirm modal → `deleteQuest`.
4. **Restore** — From completed back to active → `uncompleteQuest`.
5. **Offline** — Banner + disabled action buttons; toast if a mutation is attempted.

## Product / UX decisions (current)

| Topic | Choice |
| --- | --- |
| Stack | Vanilla JS, ES modules, no UI framework |
| CSS | Custom (`ql-*`, `:root` tokens); no Tailwind in the MVP bundle |
| Fonts | Silkscreen (Google Fonts CDN) |
| Completed section | Hidden until at least one completed quest exists in the current implementation |
| Manifest file | `manifest.webmanifest` (not `manifest.json`) |
| Service worker | `sw.js` at repo root, cache `questlog-shell-v27` |
| Service worker update | `skipWaiting: true`, `clients.claim()` on activate |
| Visual theme | Dark pixel dungeon — stone, gold, cream palette with pixel art assets |
