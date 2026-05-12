const STORAGE_KEY = 'questlog.v1.state';

/** @typedef {{ id: string, title: string, createdAt: string, completedAt: string | null }} Quest */

/** @typedef {{ version: 1, active: Quest[], completed: Quest[] }} AppState */

function defaultState() {
  return { version: 1, active: [], completed: [] };
}

/** @returns {AppState} */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.active) || !Array.isArray(parsed.completed)) {
      return defaultState();
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

/** @param {AppState} state */
export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export { STORAGE_KEY };
