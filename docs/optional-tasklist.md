# Optional backlog — Quest Log

_Task minori o “nice to have” dopo il prototipo MVP. Nessuna voce è bloccante per la consegna SDD di base._

## Risolti (non cancellati — per audit trail)

| ID | Esito |
| --- | --- |
| OB-13 | **Fatto** — Tabella FR-Q / FR-P in [`PRD.md`](PRD.md); allineamento con `architecture.md`. |
| OB-14 | **Fatto** — [`BMAD.md`](BMAD.md) riscritto come indice + mapping file + decisioni correnti. |
| OB-15 | **Fatto** — Avvisi “storico” sui due report di validazione PRD. |

Dettaglio esecuzione: [`final-polish-tasklist.md`](final-polish-tasklist.md).

---

Priorità suggerita per il resto: **P1** utile in demo / review · **P2** qualità / manutenzione · **P3** solo se il prodotto evolve.

---

## PWA e piattaforme

| ID | Priorità | Task |
| --- | --- | --- |
| OB-01 | P2 | Meta tag **iOS** (`apple-mobile-web-app-capable`, `apple-touch-icon`, status bar style) per install / standalone più coerente su Safari — oggi non presenti in `index.html`. |
| OB-02 | P2 | **Maskable icon** dedicata (oggi il manifest riusa `icon-512` anche come `maskable`; va bene in MVP, si può rifinire per safe zone). |
| OB-03 | P3 | Strategia **aggiornamento SW** (`skipWaiting`, prompt “Nuova versione”) oltre al README “hard refresh dopo deploy”. |

## Performance e rete

| ID | Priorità | Task |
| --- | --- | --- |
| OB-04 | P2 | **Self-host** dei font (WOFF2) + `font-display: swap` già implicito — riduce dipendenza da Google a cold load e migliora coerenza offline estetica. |
| OB-05 | P3 | **Subset** delle pesature Google Fonts effettivamente usate per ridurre payload. |
| OB-06 | P3 | **Lighthouse** (mobile) con esito salvato in repo o in note di consegna — la checklist lo richiede ma non automatizza. |

## Accessibilità e UX

| ID | Priorità | Task |
| --- | --- | --- |
| OB-07 | P2 | Audit **focus order** con toast aperto (il dismiss riceve subito il focus; verificare tab cycle verso input dopo chiusura). |
| OB-08 | P2 | Allineare `role="status"` / `aria-live` sul toast (consolidare un solo live region se un audit lo chiede). |
| OB-09 | P3 | **localizzazione** `lang` / copia: oggi `html lang="en"` con tono medievale in inglese — ok per MVP; impostare `it` solo se il prodotto mira all’italiano. |

## Qualità codice e tooling

| ID | Priorità | Task |
| --- | --- | --- |
| OB-10 | P2 | **Test automatici** leggeri (es. Playwright o Vitest+jsdom) per CRUD + offline flag — oggi solo manuale + checklist. |
| OB-11 | P3 | `package.json` + script `npm run serve` / `npm test` per onboarding più familiare di `python3 -m http.server`. |
| OB-12 | P3 | **CSP** meta o header in hosting statico (citato come opzionale in architecture). |

## Documentazione e tracciabilità

| ID | Priorità | Task |
| --- | --- | --- |
| OB-16 | P3 | **Shard** PRD o architecture se superano ~500 righe e diventano difficili da citare in chat (skill `bmad-shard-doc`). |

## Sicurezza e dati

| ID | Priorità | Task |
| --- | --- | --- |
| OB-17 | P3 | Limite dimensione **localStorage** / gestione `QuotaExceededError` (messaggio toast + no crash). |
| OB-18 | P3 | **Migrazione** `questlog.v1.state` → v2 se il modello dati cambia (ADR breve in architecture). |

---

## Come usarlo

Spuntare le righe in pull request o in retro; collegare commit a `OB-xx` nella descrizione se utile per il corso / il manager.
