# Quest Log — verification checklist (Lighthouse & axe)

_Use after `python3 -m http.server` and opening `http://localhost:8080/` (HTTPS optional for full install tests). Record run date and browser in your release notes._

## Lighthouse (Chrome DevTools)

| Check | Steps | Pass criteria |
| --- | --- | --- |
| PWA | Run Lighthouse → category **PWA** (desktop or mobile) | No errors that block installability; manifest + icons + SW detected |
| Performance | Same run, category **Performance** | Compare to PRD **Non-Functional Requirements**: LCP ≤ 2.5s on simulated Slow 4G for the main journal view, and no application JavaScript framework in the MVP bundle |
| Best practices | Optional same run | No critical red flags for MVP |

**Tips**

- Use an **incognito** profile and/or clear storage between runs for cold-load numbers.
- Run **mobile emulation** for PRD primary persona.

## axe DevTools (or Lighthouse accessibility category)

| Area | Steps | Pass criteria |
| --- | --- | --- |
| Automated | axe full page scan on: empty list, list with active + completed quests | **Zero** serious / critical issues, aligned to PRD NFR-A11Y-01 / NFR-A11Y-02 |
| Keyboard | Tab through: input → Add → first quest actions | Visible focus ring; no keyboard traps |
| Contrast | Spot-check body text + buttons vs background (default theme) | Targets WCAG 2.2 Level AA for body text and interactive controls on the dark pixel-dungeon theme |

## Manual / PRD-specific

| ID | Check |
| --- | --- |
| US-01–US-04 | Create, complete, reopen (restore), delete; reload persistence — details in `user-stories.md` |
| US-05 | Empty active + empty completed copy when applicable |
| Offline MVP | Offline: banner + disabled actions / no new persistence on mutations; online again + interaction restores from `localStorage` (see PRD NFR-OFF-01 + `architecture.md` NFR-OFF-01) |
| US-06 | Install prompt / installed app opens standalone (matrix browser) |

## Sign-off

| Field | Value |
| --- | --- |
| Tester | Stefano Guida |
| Date | 2026-05-13 |
| Browser / OS | Chrome 124 / macOS, incognito mode |
| Lighthouse Performance | 93 |
| Lighthouse Accessibility | 98 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |
| axe serious/critical | 0 violations (axe-core 4.7.0, empty-list state) |
| Notes | Two moderate landmark violations (landmark-one-main, region) found and fixed before final run. App wraps content in semantic main element. |
