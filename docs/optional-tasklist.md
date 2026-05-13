# Optional backlog — Quest Log

_Minor or “nice to have” tasks after the MVP prototype. None of these block the core SDD deliverable._

## Resolved (kept for audit trail)

| ID | Outcome |
| --- | --- |
| OB-13 | **Done** — FR-Q / FR-P table in [`PRD.md`](PRD.md); aligned with `architecture.md`. |
| OB-14 | **Done** — [`BMAD.md`](BMAD.md) rewritten as index + file mapping + current decisions. |
| OB-15 | **Done** — “Historical” banners on the two archived PRD validation reports now under `_bmad-output/archive/`. |
| OB-03 | **Done** — `sw.js` already uses `skipWaiting` during install and `clients.claim()` on activate for immediate activation. |

Execution detail: [`final-polish-tasklist.md`](final-polish-tasklist.md).

---

Suggested priority for the remainder: **P1** useful for demo / review · **P2** quality / maintainability · **P3** only if the product grows.

---

## PWA and platforms

| ID | Priority | Task |
| --- | --- | --- |
| OB-01 | P2 | **iOS meta tags** (`apple-mobile-web-app-capable`, `apple-touch-icon`, status bar) for a more coherent install / standalone experience on Safari — not yet in `index.html`. |
| OB-02 | P2 | Dedicated **maskable** icon (today the manifest reuses `icon-512` as `maskable`; fine for MVP, refine safe zone later). |

## Performance and network

| ID | Priority | Task |
| --- | --- | --- |
| OB-04 | P2 | **Self-host** fonts (WOFF2) + explicit `font-display: swap` — reduces Google CDN dependency on cold load and improves offline aesthetics. |
| OB-05 | P3 | **Subset** Google Font weights actually used to shrink payload. |
| OB-06 | P3 | Save a **Lighthouse** (mobile) run in the repo or in course notes — the checklist expects it but nothing automates it. |

## Accessibility and UX

| ID | Priority | Task |
| --- | --- | --- |
| OB-07 | P2 | **Focus order** audit with toast open (dismiss receives focus immediately; verify tab cycle back to input after close). |
| OB-08 | P2 | Align `role="status"` / `aria-live` on toast (single live region if an audit asks for it). |
| OB-09 | P3 | **Locale** for `lang` / copy: today `html lang="en"` with medieval tone in English — OK for MVP; switch only if the product targets another language. |

## Code quality and tooling

| ID | Priority | Task |
| --- | --- | --- |
| OB-10 | P2 | Light **automated tests** (e.g. Playwright or Vitest + jsdom) for CRUD + offline flag — today manual + checklist only. |
| OB-11 | P3 | `package.json` + `npm run serve` / `npm test` for onboarding friendlier than `python3 -m http.server`. |
| OB-12 | P3 | **CSP** meta or hosting header (optional in architecture). |

## Documentation and traceability

| ID | Priority | Task |
| --- | --- | --- |
| OB-16 | P3 | **Shard** PRD or architecture if they grow past ~500 lines and become hard to cite in chat (`bmad-shard-doc` skill). |

## Security and data

| ID | Priority | Task |
| --- | --- | --- |
| OB-17 | P3 | **localStorage** size limits / handle `QuotaExceededError` (toast + no crash). |
| OB-18 | P3 | **Migrate** `questlog.v1.state` → v2 if the data model changes (short ADR in architecture). |

---

## How I use this list

I tick rows in PRs or retros; I reference `OB-xx` in commit messages when it helps reviewers or course staff.
