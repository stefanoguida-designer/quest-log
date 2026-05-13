import { strings } from '../strings.js';

/**
 * @param {import('../storage.js').AppState} state
 * @param {{ onComplete: (id: string) => void, onDelete: (id: string) => void | Promise<void>, onRestore: (id: string) => void }} handlers
 */
export function renderQuestLists(root, state, handlers) {
  const activeHtml =
    state.active.length === 0
      ? ''
      : `<ul class="ql-list" id="ql-quest-list-active" aria-label="${strings.activeHeading}">
      ${state.active
        .map((q) => {
          const title = escapeHtml(q.title);
          return `
        <li class="ql-quest" data-quest-id="${q.id}">
          <div class="ql-quest-body">
            <span class="ql-quest-title">${title}</span>
            <p class="ql-quest-meta">${formatWhen(q.createdAt)}</p>
          </div>
          <div class="ql-quest-actions">
            <button type="button" data-action="toggle-complete" data-id="${q.id}" aria-label="Mark ${title} as complete">${strings.complete}</button>
            <button type="button" class="ql-btn--ghost" data-action="abandon" data-id="${q.id}" aria-label="Abandon ${title}">${strings.delete}</button>
          </div>
        </li>`;
        })
        .join('')}
    </ul>`;

  const completedHtml =
    state.completed.length === 0
      ? ''
      : `<ul class="ql-list" id="ql-quest-list-completed" aria-label="${strings.completedHeading}">
      ${state.completed
        .map((q) => {
          const title = escapeHtml(q.title);
          return `
        <li class="ql-quest ql-quest--complete" data-quest-id="${q.id}">
          <div class="ql-quest-body">
            <span class="ql-quest-title">${title}</span>
            <p class="ql-quest-meta">${formatWhen(q.completedAt || q.createdAt)}</p>
          </div>
          <div class="ql-quest-actions">
            <button type="button" data-action="toggle-complete" data-id="${q.id}" aria-label="Reopen ${title}">${strings.restore}</button>
            <button type="button" class="ql-btn--ghost" data-action="abandon" data-id="${q.id}" aria-label="Abandon ${title}">${strings.delete}</button>
          </div>
        </li>`;
        })
        .join('')}
    </ul>`;

  const activeSlot = root.querySelector('[data-slot="active-list"]');
  const completedSlot = root.querySelector('[data-slot="completed-list"]');
  if (!activeSlot || !completedSlot) return;

  activeSlot.innerHTML = activeHtml;
  completedSlot.innerHTML = completedHtml;

  root.querySelectorAll('button[data-action]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const el = /** @type {HTMLButtonElement} */ (e.currentTarget);
      const id = el.dataset.id;
      const action = el.dataset.action;
      if (!id || !action) return;
      if (action === 'toggle-complete') {
        const questEl = el.closest('.ql-quest');
        if (questEl?.classList.contains('ql-quest--complete')) {
          handlers.onRestore(id);
        } else {
          handlers.onComplete(id);
        }
      }
      if (action === 'abandon') handlers.onDelete(id);
    });
  });
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatWhen(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '';
  }
}
