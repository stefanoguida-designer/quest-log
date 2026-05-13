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
import { showConfirm } from './modal.js';
import { registerServiceWorker } from './pwa/register-sw.js';
import { initTorches } from './torch.js';

const LOADING_DELAY_MS = 1500;

function online() {
  return navigator.onLine;
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

function demoErrorEnabled() {
  return new URLSearchParams(window.location.search).get('error') === '1';
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** @param {HTMLElement} root */
function showLoadingState(root) {
  root.innerHTML = `
<div class="ql-loading">
  <p class="ql-loading-text">Retrieving the scroll...</p>
  <div class="ql-progress-track">
    <div class="ql-progress-bar" id="ql-progress-bar"></div>
  </div>
</div>`;
  const progressBar = /** @type {HTMLElement | null} */ (root.querySelector('#ql-progress-bar'));
  window.requestAnimationFrame(() => {
    if (progressBar) progressBar.style.width = '100%';
  });
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

/**
 * @param {HTMLElement} root
 * @param {() => void} onRetry
 */
function showErrorState(root, onRetry) {
  const panel = root.querySelector('.ql-panel');
  const activeEmpty = root.querySelector('[data-slot="active-empty"]');
  const activeList = root.querySelector('[data-slot="active-list"]');
  const completedEmpty = root.querySelector('[data-slot="completed-empty"]');
  const completedList = root.querySelector('[data-slot="completed-list"]');

  if (!activeList) return;

  panel?.classList.add('ql-panel--error');
  root.querySelectorAll('.ql-section-title').forEach((heading) => {
    heading.classList.add('hidden');
  });
  if (activeEmpty) activeEmpty.innerHTML = '';
  if (completedEmpty) completedEmpty.innerHTML = '';
  if (completedList) completedList.innerHTML = '';

  activeList.innerHTML = `
<div class="ql-error-state">
  <p class="ql-error-icon">⚠</p>
  <p class="ql-error-title">The scroll could not be retrieved.</p>
  <p class="ql-error-message">A shadow has fallen upon the archive. Try again.</p>
  <button class="ql-btn ql-btn--ghost ql-error-retry" type="button">Retry</button>
</div>`;

  activeList.querySelector('.ql-error-retry')?.addEventListener('click', onRetry);
}

/** @param {HTMLElement} root */
function rerender(root) {
  const state = getState();
  root.querySelector('.ql-panel')?.classList.remove('ql-panel--error');
  root.querySelectorAll('.ql-section-title').forEach((heading) => {
    heading.classList.remove('hidden');
  });
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
    onDelete: async (id) => {
      if (!online()) return;
      if (!(await showConfirm(strings.deleteConfirm))) return;
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

/**
 * @param {HTMLElement} root
 * @param {{ initialError?: boolean }} [options]
 */
function bindApp(root, options = {}) {
  let errorStateActive = options.initialError === true;
  const form = document.getElementById('ql-form');
  const input = document.getElementById('ql-input');
  const inputError = document.getElementById('ql-input-error');

  if (!form || !input) return;

  input.placeholder = strings.inputPlaceholder;
  input.removeAttribute('required');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    input.removeAttribute('required');
    if (!online()) {
      showToast(strings.offlineBanner, { variant: 'warn' });
      return;
    }
    const raw = input.value;
    const title = raw.trim();
    if (!title) {
      if (inputError) {
        inputError.textContent = 'Quest name required.';
      }
      input.classList.add('ql-input--error');
      return;
    }
    if (inputError) inputError.textContent = '';
    input.classList.remove('ql-input--error');
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

  const rerenderIfReady = () => {
    if (!errorStateActive) rerender(root);
  };

  subscribe(rerenderIfReady);
  if (errorStateActive) {
    showErrorState(root, () => {
      errorStateActive = false;
      rerender(root);
    });
  } else {
    rerender(root);
  }

  window.addEventListener('online', rerenderIfReady);
  window.addEventListener('offline', rerenderIfReady);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') hydrateFromStorage();
  });

  registerServiceWorker();
  initTorches();
}

async function boot() {
  const root = document.getElementById('ql-app-root');

  if (!root) return;

  const appHtml = root.innerHTML;
  showLoadingState(root);
  await wait(LOADING_DELAY_MS);
  root.innerHTML = appHtml;
  const initialError = demoErrorEnabled();
  if (initialError) console.log('error param detected');
  bindApp(root, { initialError });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
