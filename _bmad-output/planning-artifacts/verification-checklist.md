# Quest Log — verification checklist (Lighthouse & axe)

_Use after `python3 -m http.server` and opening `http://localhost:8080/` (HTTPS optional for full install tests). Record run date and browser in your release notes._

## Lighthouse (Chrome DevTools)

| Check | Steps | Pass criteria |
| --- | --- | --- |
| PWA | Run Lighthouse → category **PWA** (desktop or mobile) | No errors that block installability; manifest + icons + SW detected |
| Performance | Same run, category **Performance** | Compare to PRD “Non-functional summary” (snappy mobile, minimal third-party scripts); use Slow 4G / throttling as realistic baseline |
| Best practices | Optional same run | No critical red flags for MVP |

**Tips**

- Use an **incognito** profile and/or clear storage between runs for cold-load numbers.
- Run **mobile emulation** for PRD primary persona.

## axe DevTools (or Lighthouse accessibility category)

| Area | Steps | Pass criteria |
| --- | --- | --- |
| Automated | axe full page scan on: empty list, list with active + completed quests | **Zero** serious / critical issues (PRD accessibility row in NFR summary) |
| Keyboard | Tab through: input → Inscribe → first quest actions | Visible focus ring; no keyboard traps |
| Contrast | Spot-check body text + buttons vs background (default theme) | Meets PRD accessibility intent (body text and controls readable on parchment) |

## Manual / PRD-specific

| ID | Check |
| --- | --- |
| US-01–US-04 | Create, complete, reopen (restore), delete; reload persistence — details in `user-stories.md` |
| US-05 | Empty active + empty completed copy when applicable |
| Offline MVP | Offline: banner + disabled actions / no new persistence on mutations; online again + interaction restores from `localStorage` (see PRD NFR summary + `architecture.md` NFR-OFF-01) |
| US-06 | Install prompt / installed app opens standalone (matrix browser) |

## Sign-off

| Field | Value |
| --- | --- |
| Tester | |
| Date | |
| Browser / OS | |
| Lighthouse PWA score | |
| axe serious/critical | |
| Notes | |
