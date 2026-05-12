import { loadState, saveState } from './storage.js';

/** @typedef {import('./storage.js').Quest} Quest */
/** @typedef {import('./storage.js').AppState} AppState */

/** @type {AppState} */
let state = loadState();

const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  listeners.forEach((fn) => fn(state));
}

/** @returns {AppState} */
export function getState() {
  return state;
}

export function hydrateFromStorage() {
  state = loadState();
  emit();
}

/**
 * @param {(s: AppState) => AppState} updater
 * @param {{ persist?: boolean }} [opts]
 */
export function dispatch(updater, opts = {}) {
  const persist = opts.persist !== false;
  const next = updater(structuredClone(state));
  state = next;
  if (persist) saveState(state);
  emit();
}

/** @param {string} title */
export function addQuest(title) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  /** @type {Quest} */
  const quest = { id, title, createdAt, completedAt: null };
  dispatch(
    (s) => ({
      ...s,
      active: [quest, ...s.active],
    }),
    { persist: true }
  );
}

/** @param {string} id */
export function completeQuest(id) {
  const now = new Date().toISOString();
  dispatch((s) => {
    const idx = s.active.findIndex((q) => q.id === id);
    if (idx === -1) return s;
    const moved = { ...s.active[idx], completedAt: now };
    const active = s.active.filter((_, i) => i !== idx);
    return {
      ...s,
      active,
      completed: [moved, ...s.completed],
    };
  }, { persist: true });
}

/** @param {string} id */
export function uncompleteQuest(id) {
  dispatch((s) => {
    const idx = s.completed.findIndex((q) => q.id === id);
    if (idx === -1) return s;
    const moved = { ...s.completed[idx], completedAt: null };
    const completed = s.completed.filter((_, i) => i !== idx);
    return {
      ...s,
      completed,
      active: [moved, ...s.active],
    };
  }, { persist: true });
}

/** @param {string} id */
export function deleteQuest(id) {
  dispatch(
    (s) => ({
      ...s,
      active: s.active.filter((q) => q.id !== id),
      completed: s.completed.filter((q) => q.id !== id),
    }),
    { persist: true }
  );
}
