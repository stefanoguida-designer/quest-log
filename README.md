# Quest Log

PWA todo list framed as an adventurer’s journal. Product definition lives in [`docs/PRD.md`](docs/PRD.md). Architecture and planning artefacts live under [`_bmad-output/planning-artifacts/`](_bmad-output/planning-artifacts/).

## Run locally

Service workers require **http(s)** — do not open `index.html` as a `file://` URL.

From the repository root:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080/](http://localhost:8080/).

## AI / BMAD integration

| Artefact | Path |
| --- | --- |
| Product brief | `docs/product-brief.md` |
| PRD | `docs/PRD.md` |
| Architecture | `_bmad-output/planning-artifacts/architecture.md` |
| User stories + AC | `_bmad-output/planning-artifacts/user-stories.md` |
| Verification checklist | `_bmad-output/planning-artifacts/verification-checklist.md` |
| BMAD index (artefatti + mapping) | [`docs/BMAD.md`](docs/BMAD.md) |
| Final polish (checklist chiusura) | [`docs/final-polish-tasklist.md`](docs/final-polish-tasklist.md) |
| Latest PRD validation | [`_bmad-output/planning-artifacts/PRD-validation-report-current.md`](_bmad-output/planning-artifacts/PRD-validation-report-current.md) |
| Optional backlog | [`docs/optional-tasklist.md`](docs/optional-tasklist.md) |

## Offline behaviour (MVP)

After a successful load, the service worker precaches the app shell. While **offline**, create / complete / delete / restore actions are **disabled** and a banner explains that persistence is unavailable until the connection returns — see architecture doc (NFR-OFF-01 decision).

## UX polish in the app

- **Motion:** completing a quest plays a short seal animation; deleting fades the row. New quests can play an unfurl animation after submit. All respect `prefers-reduced-motion`.
- **Toasts:** validation and offline messages use an in-page heraldic toast (not `window.alert`); dismiss with **Understood** or **Escape**.

## PWA notes

- Icons: `assets/icons/` (SVG + generated PNGs for install).
- Styling is **custom CSS** (`css/theme.css`, `css/motion.css`) with shared tokens — no Tailwind/runtime CSS framework in the bundle, for a smaller critical path and simpler offline behaviour.

## Verification

Follow [`_bmad-output/planning-artifacts/verification-checklist.md`](_bmad-output/planning-artifacts/verification-checklist.md) for Lighthouse (PWA + performance) and axe / keyboard checks against the PRD. Optional improvements: [`docs/optional-tasklist.md`](docs/optional-tasklist.md). Doc-quality closure log: [`docs/final-polish-tasklist.md`](docs/final-polish-tasklist.md).
