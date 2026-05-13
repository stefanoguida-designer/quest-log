---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: architecture
project_name: Quest log
user_name: Stefanoguida.nearform
date: '2026-05-12'
status: complete
completedAt: '2026-05-12'
lastStep: 8
inputDocuments:
  - docs/PRD.md
---

# Architecture Decision Document — Quest Log

_This document was produced from `docs/PRD.md` using the BMAD create-architecture workflow. Steps 1–8 are represented in a single artefact because the run was initiated non-interactively (`--prd docs/PRD.md`)._

## Project Context Analysis

### Requirements Overview

**Functional requirements (architectural view)**

| Area | IDs | Architectural implication |
| --- | --- | --- |
| Quest CRUD + persistence | FR-Q01–FR-Q04 | Single-page UI with explicit domain model for quests; synchronous persistence to browser storage on every mutation; deterministic ordering contract documented below. |
| Empty states | FR-Q05, FR-Q06 | Dedicated view states in the render layer; copy lives in a single `strings` (or similar) module to keep tone consistent. |
| PWA | FR-P01–FR-P03 | Static hosting–friendly layout: manifest, icons, and `sw.js` at known URLs; installability validated against PRD browser matrix. |
| Motion | UX-MOT-01–UX-MOT-03 | CSS-first motion with `prefers-reduced-motion` guards; no layout-thrashing animations on the main thread beyond short transitions. |

**Non-functional requirements**

| ID | Architectural response |
| --- | --- |
| NFR-PERF-01 / NFR-PERF-02 | Minimal JS, no framework runtime; small precache set; font subsetting or limited weights; avoid large third-party scripts beyond **Google Fonts** (styling is custom CSS, no utility CSS framework in the bundle). |
| NFR-A11Y-01 / NFR-A11Y-02 | Semantic HTML for lists/forms; visible focus; keyboard paths for create/complete/delete; colour tokens defined once and reused. |
| NFR-OFF-01 | **MVP decision (chosen):** After warm load, service worker serves cached shell. While offline, **mutations that require persistence are blocked** with a single inline status banner (“The realm lies beyond reach…”); no silent data loss. On reconnect, user refreshes or we dispatch a soft `visibilitychange` reload of persisted state from `localStorage`. (Fits `localStorage`-only storage; avoids fake “saved” offline state.) Document this in README and manual test script. |
| NFR-SEC-01 | No auth, no third-party keys in repo; telemetry off unless explicitly added later. |

**Scale and complexity**

- **Primary domain:** Web / installable PWA (static client only).
- **Complexity:** Low — single user, no backend, bounded FR count.
- **Major components:** Shell + UI render pipeline; domain + storage adapter; service worker registration + precache; manifest + assets.

### Technical Constraints and Dependencies

- **Stack (from PRD):** Vanilla HTML/CSS/JavaScript (ES modules), **custom CSS** (`theme.css` / `motion.css`), `localStorage` for quest entities, minimal service worker.
- **No mandatory bundler** for MVP delivery; paths below assume direct browser loads. Optional Vite later must not change public URLs of manifest/icons without updating SW precache.

### Cross-Cutting Concerns

- Persistence and render consistency (optimistic UI only when online).
- PWA update strategy (`skipWaiting` / `clients.claim` policy — see decisions).
- Accessibility + motion preferences.
- Copy tone and empty states (product/UX concern; enforce centralisation in code).

---

## Starter Template Evaluation

### Primary technology domain

**Static client PWA (vanilla)** — the PRD explicitly freezes **no SPA framework** and **no mandatory bundler** for the prototype. There is therefore **no** Next/Vite “starter CLI” as the source of truth; the starter is a **hand-authored repository layout** described in **Project structure** below.

### Starter options considered

| Option | Fit | Verdict |
| --- | --- | --- |
| Vite + vanilla template | Faster DX, but adds toolchain contrary to “no mandatory bundler” MVP | **Defer** to post-MVP optional track |
| Next.js / Remix | Conflicts with PRD (framework) | **Rejected** |
| Manual static scaffold | Matches PRD and BMAD portfolio goal | **Selected** |

### Selected starter: Manual static PWA scaffold

**Rationale:** Aligns with `mvpStack`, keeps Lighthouse surface small, and makes every file an explicit architectural choice (good for AI agents).

**Initialization command**

There is no single vendor CLI. First implementation story creates the tree under **Project structure** and wires `index.html` → ES modules.

**Styling (current implementation)**

- **Custom CSS only** in MVP: design tokens and layout live in `css/theme.css` and `css/motion.css` (no Tailwind or other runtime utility framework in `index.html`).
- **Optional later:** introduce Tailwind or another build-time pipeline only if the PRD is amended; precache and CSP implications must be revisited.

**Architectural decisions already implied by this “starter”**

- **Language:** Modern JavaScript (ES2020+ baseline), modules.
- **Styling:** Component-oriented class names (`ql-*`) + `:root` variables; keep copy in `js/strings.js`.
- **Testing:** Optional manual + Lighthouse/axe; no default test runner until added.
- **Build:** None required for MVP.

---

## Core Architectural Decisions

### Decision priority analysis

**Critical (block implementation if undefined)**

1. Canonical **precache URL list** for the service worker (unblocks FR-P02 / NFR-OFF-01).
2. **`localStorage` schema + key name** (unblocks FR-Q04).
3. **Offline mutation policy** (fixed above for NFR-OFF-01).

**Important**

4. Service worker update policy: **Manual refresh** after deploy — `skipWaiting: false` on `install` unless user confirms update (simplest for MVP). Document “hard refresh after deploy” in README.
5. Font loading: **Google Fonts link** in `index.html` with `font-display: swap`; limit to display + body weights documented in README.

**Deferred**

- IndexedDB sync, multi-device, backend — explicitly out of PRD scope.

### Data architecture

- **Storage engine:** `window.localStorage` only.
- **Key:** `questlog.v1.state` (single JSON blob) *or* split keys — **Decision:** single JSON blob `{ version: 1, active: Quest[], completed: Quest[] }` to keep writes atomic at MVP size.
- **Quest shape:** `{ id: string (uuid v4), title: string, createdAt: ISO string, completedAt: ISO string | null }`.
- **Validation:** Trim title; reject empty after trim; max length 200 chars (architecture default; align with UX).

### Authentication and security

- **None** for MVP (per PRD). No cookies, no secrets in repo.
- **Content Security Policy:** Optional meta/CSP header when hosted — start with restrictive default if deploying to static host (document in README).

### API and communication

- **No server APIs.** In-browser events only (`CustomEvent` optional; default: direct module calls).

### Frontend architecture

- **Modules:** `main.js` orchestrates; `state.js` + `storage.js` for persistence; `js/dom/*` builds DOM from state snapshot.
- **State:** Single source of truth in memory mirroring last successful read/write to `localStorage`; re-read on `pageshow`/`visibilitychange` if another tab could exist (document single-tab assumption for MVP).
- **Rendering:** Native DOM APIs (no virtual DOM library).

### Infrastructure and deployment

- **Hosting:** Any static host (GitHub Pages, Netlify, Cloudflare Pages, S3+CloudFront). **Decision:** document “static root = repo root” and required MIME types for `.webmanifest` / service worker scope.
- **CI:** None required for MVP; optional GitHub Action for Lighthouse later.

### Decision impact analysis

- **Implementation sequence:** (1) HTML shell + layout, (2) storage module + model, (3) CRUD UI, (4) manifest + icons, (5) service worker + precache list, (6) motion/a11y polish, (7) README + Lighthouse proof.

---

## Implementation Patterns and Consistency Rules

### Naming

- **JS modules:** `camelCase` exports; one primary `create*` / `render*` verb per file where practical.
- **DOM ids:** `kebab-case`, prefixed `ql-` (e.g. `ql-quest-list-active`) to avoid collisions.
- **CSS files:** `kebab-case.css`.
- **Storage:** single key `questlog.v1.state` — do not introduce ad hoc keys without ADR update.

### Structure

- **Tests:** When added, prefer `tests/` at repo root mirroring `js/` (co-location optional later).
- **Strings:** `js/strings.js` (or `js/copy.js`) exports all user-visible copy; agents must not hardcode duplicate marketing strings in components.

### Format

- **Dates:** ISO-8601 strings in UTC internally; display formatting is presentation-only.
- **IDs:** `crypto.randomUUID()` when available; fallback documented in `storage.js` if needed for older browsers (PRD matrix may make fallback unnecessary — verify against browser matrix).

### Process

- **Errors:** User-facing errors use `showToast()` in `js/dom/render-toast.js` with copy from `strings.js` (heraldic tone per PRD).
- **Logging:** `console.*` only behind `DEBUG` flag default false.

### Enforcement (for AI agents)

- Agents **MUST NOT** add a framework (`react`, `vue`, etc.) without PRD amendment.
- Agents **MUST** update the **precache list** in `sw.js` whenever they add/remove root assets.
- Agents **MUST** keep quest persistence logic in `storage.js` only.

---

## Project Structure and Boundaries

```
quest-log/
├── README.md
├── index.html                 # shell, fonts, module entry (custom CSS links)
├── manifest.webmanifest       # PWA manifest (PRD also allows manifest.json naming)
├── sw.js                      # service worker — precache + fetch handler
├── offline.html               # optional fallback shell (include in precache if present)
├── css/
│   ├── theme.css              # CSS variables, parchment/noise base
│   └── motion.css             # UX-MOT-* animations + reduced-motion overrides
├── js/
│   ├── main.js                # entry: bootstrap, listeners
│   ├── state.js               # in-memory state + reducer-style mutations
│   ├── storage.js             # localStorage read/write + migrate
│   ├── strings.js             # copy / tone
│   ├── dom/
│   │   ├── render-list.js     # active + completed sections
│   │   ├── render-empty.js
│   │   ├── render-chrome.js   # connectivity banner
│   │   └── render-toast.js    # heraldic toasts (validation / offline)
│   └── pwa/
│       └── register-sw.js     # registration + update UX hook
└── assets/
    └── icons/
        ├── icon-192.png
        └── icon-512.png
```

### Precache list (authoritative for FR-P02)

**Version:** `questlog-shell-v22` (bump when precache set changes).

**URLs to precache (relative to origin `/`):**

- `/`
- `/index.html`
- `/offline.html`
- `/manifest.webmanifest`
- `/css/theme.css`
- `/css/motion.css`
- `/js/main.js`
- `/js/modal.js`
- `/js/state.js`
- `/js/storage.js`
- `/js/strings.js`
- `/js/torch.js`
- `/js/dom/render-list.js`
- `/js/dom/render-empty.js`
- `/js/dom/render-chrome.js`
- `/js/dom/render-toast.js`
- `/js/pwa/register-sw.js`
- `/assets/icons/icon-192.png`
- `/assets/icons/icon-512.png`

*Note:* Font CSS from Google Fonts is **not** precached as first-party files; expect first online load to fetch fonts (acceptable for MVP; document in perf notes).

### FR → component mapping

| FR | Primary owner |
| --- | --- |
| FR-Q01 | `main.js` + `dom/render-list.js` + `state.js` |
| FR-Q02 | `state.js` + `dom/render-list.js` + `css/motion.css` |
| FR-Q03 | `state.js` + `dom/render-list.js` |
| FR-Q04 | `storage.js` + `state.js` |
| FR-Q05, FR-Q06 | `dom/render-empty.js` + `strings.js` |
| FR-P01 | `manifest.webmanifest` + `index.html` `<link rel="manifest">` |
| FR-P02 | `sw.js` + `js/pwa/register-sw.js` |
| FR-P03 | `assets/icons/*` |

---

## Architecture Validation

### Coherence

- Stack choices are mutually compatible (static hosting + ES modules + SW).
- Offline policy avoids contradicting `localStorage`-only constraint.

### Requirements coverage

- All FR-Q / FR-P rows have a owning module or asset path (IDs **defined in `docs/PRD.md`** — section *Requirement IDs*).
- NFR-PERF / A11Y / OFF / SEC addressed in decisions above or explicitly deferred with rationale.

### Gaps / follow-ups

- **Product:** Resolve NFR-OFF-01 long-term (queue vs disable) if scope expands.
- **Engineering:** If font CDN or hosting CSP hurts Lighthouse scores, document mitigations (subset fonts, self-host WOFF2, tighten CSP) in README.

---

## Completion and handoff

Architecture for **Quest log** MVP is **complete** relative to `docs/PRD.md`.

**Suggested next steps**

1. Run **`bmad-create-story`** / implementation skill to generate the first dev story: “Static shell + `storage.js` + list render”.
2. Keep [`_bmad-output/planning-artifacts/user-stories.md`](user-stories.md) aligned with PRD acceptance criteria as scope changes.
3. After first deploy, attach Lighthouse + axe artefacts to release notes per NFR success methods.

If you want this broken into the per-step A/P/C collaborative run instead of a single artefact, say so and we can replay any step with deeper options.
