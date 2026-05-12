import {
  subscribe,
  getState,
  addQuest,
  completeQuest,
  deleteQuest,
  uncompleteQuest,
  hydrateFromStorage,
} from './state.js';
import { strings } from './strings.js';
import { renderQuestLists } from './dom/render-list.js';
import { renderConnectivityBanner } from './dom/render-chrome.js';
import { emptyActiveHtml, emptyCompletedHtml } from './dom/render-empty.js';
import { showToast } from './dom/render-toast.js';
import { registerServiceWorker } from './pwa/register-sw.js';

function online() {
  return navigator.onLine;
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

/** @param {string} id */
function escapeForSelector(id) {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(id);
  }
  return id.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * @param {HTMLElement} root
 * @param {string} id
 * @param {() => void} fn
 */
function runAfterMotion(root, id, fn) {
  const esc = escapeForSelector(id);
  const li =
    root.querySelector(`#ql-quest-list-active li[data-quest-id="${esc}"]`) ||
    root.querySelector(`#ql-quest-list-completed li[data-quest-id="${esc}"]`);

  if (!li || prefersReducedMotion()) {
    fn();
    return;
  }

  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    li.removeEventListener('animationend', done);
    fn();
  };

  li.addEventListener('animationend', done, { once: true });
  window.setTimeout(done, 720);
}

/** @param {HTMLElement} root */
function rerender(root) {
  const state = getState();
  renderConnectivityBanner(online(), strings.offlineBanner);

  const counts = {
    activeCount: state.active.length,
    completedCount: state.completed.length,
  };
  const activeEmpty = root.querySelector('[data-slot="active-empty"]');
  const completedEmpty = root.querySelector('[data-slot="completed-empty"]');
  if (activeEmpty) activeEmpty.innerHTML = emptyActiveHtml(counts);
  if (completedEmpty) completedEmpty.innerHTML = emptyCompletedHtml(counts);

  renderQuestLists(root, state, {
    onComplete: (id) => {
      if (!online()) return;
      const esc = escapeForSelector(id);
      const li = root.querySelector(`#ql-quest-list-active li[data-quest-id="${esc}"]`);
      if (!li || prefersReducedMotion()) {
        completeQuest(id);
        return;
      }
      li.classList.add('ql-motion-seal');
      runAfterMotion(root, id, () => completeQuest(id));
    },
    onDelete: (id) => {
      if (!online()) return;
      if (!window.confirm(strings.deleteConfirm)) return;
      const esc = escapeForSelector(id);
      const li =
        root.querySelector(`#ql-quest-list-active li[data-quest-id="${esc}"]`) ||
        root.querySelector(`#ql-quest-list-completed li[data-quest-id="${esc}"]`);
      if (!li || prefersReducedMotion()) {
        deleteQuest(id);
        return;
      }
      li.classList.add('ql-motion-delete');
      runAfterMotion(root, id, () => deleteQuest(id));
    },
    onRestore: (id) => {
      if (!online()) return;
      uncompleteQuest(id);
    },
  });

  root.querySelectorAll('button').forEach((btn) => {
    btn.toggleAttribute('disabled', !online());
  });
}

function boot() {
  const root = document.getElementById('ql-app-root');
  const form = document.getElementById('ql-form');
  const input = document.getElementById('ql-input');

  if (!root || !form || !input) return;

  input.placeholder = strings.inputPlaceholder;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!online()) {
      showToast(strings.offlineBanner, { variant: 'warn' });
      return;
    }
    const raw = input.value;
    const title = raw.trim();
    if (!title) {
      showToast(strings.validationEmpty, { variant: 'warn' });
      return;
    }
    if (title.length > 200) {
      showToast(strings.validationLong, { variant: 'warn' });
      return;
    }
    addQuest(title);
    input.value = '';
    input.focus();
    if (!prefersReducedMotion()) {
      window.requestAnimationFrame(() => {
        const first = root.querySelector('#ql-quest-list-active li[data-quest-id]');
        if (first) {
          first.classList.remove('ql-motion-unfurl');
          void first.offsetWidth;
          first.classList.add('ql-motion-unfurl');
        }
      });
    }
  });

  subscribe(() => rerender(root));
  rerender(root);

  window.addEventListener('online', () => rerender(root));
  window.addEventListener('offline', () => rerender(root));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') hydrateFromStorage();
  });

  registerServiceWorker();
}

boot();
