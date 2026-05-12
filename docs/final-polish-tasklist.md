# Final polish — checklist eseguita

_Checklist per chiudere le ultime issue di qualità (traceabilità FR, `BMAD.md` obsoleto, riferimenti incrociati). Tutte le voci sotto sono state completate in repo._

## Struttura e tracciabilità

- [x] **FR-Q / FR-P nel PRD** — Aggiunta tabella “Requirement IDs (engineering traceability)” in [`PRD.md`](PRD.md), allineata a `architecture.md` (mapping moduli) e alla checklist manuale.
- [x] **`docs/BMAD.md`** — Sostituito il corpo obsoleto con **indice canonico** + tabella file + flussi + decisioni allineate al prototipo (niente `manifest.json` / `service-worker.js` / Tailwind obbligatorio / delete senza conferma come verità dichiarata).

## Documentazione incrociata

- [x] **README / product-brief** — Già puntano a `optional-tasklist.md`; nessun link rotto verso `BMAD.md` (resta sotto `docs/`, ora come indice).
- [x] **Report validazione PRD (corrente)** — Creato [`_bmad-output/planning-artifacts/PRD-validation-report-current.md`](../_bmad-output/planning-artifacts/PRD-validation-report-current.md) (2026-05-12, **Pass** con warning minori). Lo skill CLI `bmad-validate-prd` + `resolve_customization.py` richiedono **Python 3.11+**; qui la validazione è stata eseguita come revisione strutturata equivalente.
- [x] **Report validazione PRD (storici)** — Intestazioni “storico” già presenti su `docs/PRD-validation-report.md` e `docs/PRD-v2-validation-report.md`.

## Opzionale (fuori scope di questa checklist)

Migliorie successive restano in [`optional-tasklist.md`](optional-tasklist.md) (iOS meta, test auto, self-host font, …).

---

_Completamento logico: dopo questa checklist, la triade **PRD ↔ architecture ↔ codice** condivide gli stessi ID FR e gli stessi nomi file PWA._
