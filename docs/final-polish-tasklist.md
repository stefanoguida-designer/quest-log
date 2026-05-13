# Final polish — completed checklist

_Checklist I used to close the last documentation-quality gaps (FR traceability, obsolete `BMAD.md`, cross-links). Every item below is done in this repository._

## Structure and traceability

- [x] **FR-Q / FR-P in the PRD** — I added the “Requirement IDs (engineering traceability)” table in [`PRD.md`](PRD.md), aligned with `architecture.md` (module mapping) and the manual verification checklist.
- [x] **`docs/BMAD.md`** — I replaced the obsolete body with a **canonical index** plus file table, flows, and decisions that match the prototype (no `manifest.json` / `service-worker.js` / mandatory Tailwind / unconfirmed delete as stated truth).

## Cross-documentation

- [x] **README / product brief** — They already pointed at `optional-tasklist.md`; links to `BMAD.md` are valid (`docs/`, now an index).
- [x] **Current PRD validation report** — I added [`_bmad-output/planning-artifacts/PRD-validation-report-current.md`](../_bmad-output/planning-artifacts/PRD-validation-report-current.md) (2026-05-12, **Pass** with minor warnings). The `bmad-validate-prd` CLI plus `resolve_customization.py` needs **Python 3.11+**; where that was unavailable I still ran an equivalent structured review.
- [x] **Historical PRD validation reports** — I added “historical” banners and archived them at `_bmad-output/archive/PRD-validation-report.md` and `_bmad-output/archive/PRD-v2-validation-report.md`.

## Optional (outside this checklist)

Further improvements live in [`optional-tasklist.md`](optional-tasklist.md) (iOS meta tags, automated tests, self-hosted fonts, …).

---

_After this checklist, the **PRD ↔ architecture ↔ code** triangle shares the same FR IDs and the same PWA filenames._
