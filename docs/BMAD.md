# BMAD — Quest Log (indice artefatti)

_Documento di orientamento. Le specifiche vincolanti sono **PRD**, **product brief**, **architecture** e **user stories**; il codice in repo è la prova del comportamento._

## Artefatti canonici

| Artefatto | Percorso | Ruolo |
| --- | --- | --- |
| Product brief | [`product-brief.md`](product-brief.md) | Scope, utenti, in/out MVP |
| PRD | [`PRD.md`](PRD.md) | Requisiti, **ID FR-Q / FR-P**, NFR summary |
| Architecture | [`../_bmad-output/planning-artifacts/architecture.md`](../_bmad-output/planning-artifacts/architecture.md) | ADR, precache SW, mapping FR → file |
| User stories + AC | [`../_bmad-output/planning-artifacts/user-stories.md`](../_bmad-output/planning-artifacts/user-stories.md) | US-01–US-06, criteri testabili |
| Checklist verifica | [`../_bmad-output/planning-artifacts/verification-checklist.md`](../_bmad-output/planning-artifacts/verification-checklist.md) | Lighthouse, axe, manuali |
| Validazione PRD (corrente) | [`../_bmad-output/planning-artifacts/PRD-validation-report-current.md`](../_bmad-output/planning-artifacts/PRD-validation-report-current.md) | Report 2026-05-12 (Pass) |
| Backlog opzionale | [`optional-tasklist.md`](optional-tasklist.md) | Migliorie non MVP |
| Checklist polish finale | [`final-polish-tasklist.md`](final-polish-tasklist.md) | Chiusura issue strutturali (questo filone) |

## Inventario componenti ↔ file (implementazione)

| Concetto | File / entry |
| --- | --- |
| Shell + meta PWA | `index.html` |
| Stile + toast + layout | `css/theme.css` |
| Motion | `css/motion.css` |
| Bootstrap, form, rete | `js/main.js` |
| Stato + mutazioni | `js/state.js` |
| `localStorage` | `js/storage.js` |
| Copia UI | `js/strings.js` |
| Liste quest | `js/dom/render-list.js` |
| Stati vuoti | `js/dom/render-empty.js` |
| Banner offline | `js/dom/render-chrome.js` |
| Toast heraldico | `js/dom/render-toast.js` |
| Registrazione SW | `js/pwa/register-sw.js` |
| Manifest | `manifest.webmanifest` |
| Service worker | `sw.js` |
| Fallback offline | `offline.html` |
| Icone | `assets/icons/*` |

## Flussi principali (allineati al codice)

1. **Aggiungi** — Submit form → validazione (vuoto / lunghezza) → `addQuest` → toast se errore; animazione unfurl se motion consentita.
2. **Completa** — Pulsante “Seal complete” (online) → animazione sigillo oppure immediato se reduced motion → `completeQuest`.
3. **Elimina** — `confirm` browser → animazione delete → `deleteQuest`.
4. **Ripristina** — Da completati ad attivi → `uncompleteQuest`.
5. **Offline** — Banner + pulsanti disabilitati; toast se si tenta mutazione.

## Decisioni di prodotto / UX (stato attuale)

| Tema | Scelta |
| --- | --- |
| Stack | Vanilla JS, ES modules, nessun framework UI |
| CSS | Custom (`ql-*`, token `:root`); nessun Tailwind nel bundle MVP |
| Font | Cinzel + Source Serif 4 (Google Fonts, CDN) |
| Delete | Con conferma (`window.confirm`), coerente con PRD |
| Sezione completati | Sempre visibile con empty state dedicato (non collassata) |
| Manifest | `manifest.webmanifest` (non `manifest.json`) |
| Service worker | `sw.js` in root, cache `questlog-shell-v2` |

## Nota storica

Una bozza narrativa lunga (inventario legacy, US duplicate, riferimenti a `manifest.json` / Tailwind CDN / delete senza conferma) è stata **sostituita da questo indice** per evitare drift rispetto a PRD e codice. Le versioni precedenti restano nella cronologia Git se servono.
