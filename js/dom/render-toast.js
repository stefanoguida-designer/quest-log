import { strings } from '../strings.js';

const TOAST_DURATION_MS = 5200;
let hideTimer = 0;
/** @type {((e: KeyboardEvent) => void) | null} */
let escapeHandler = null;

function clearTimer() {
  if (hideTimer) {
    window.clearTimeout(hideTimer);
    hideTimer = 0;
  }
}

export function dismissToast() {
  clearTimer();
  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler, true);
    escapeHandler = null;
  }
  const slot = document.getElementById('ql-toast-slot');
  if (slot) {
    slot.innerHTML = '';
    slot.hidden = true;
  }
}

/**
 * @param {string} message
 * @param {{ variant?: 'herald' | 'warn' }} [opts]
 */
export function showToast(message, opts = {}) {
  const variant = opts.variant === 'warn' ? 'warn' : 'herald';
  const slot = document.getElementById('ql-toast-slot');
  if (!slot) return;

  dismissToast();

  slot.setAttribute('aria-live', 'polite');
  slot.setAttribute('role', 'status');
  slot.hidden = false;
  slot.innerHTML = '';

  const toast = document.createElement('div');
  toast.className = `ql-toast ql-toast--${variant}`;

  const text = document.createElement('p');
  text.className = 'ql-toast-text';
  text.textContent = message;

  const actions = document.createElement('div');
  actions.className = 'ql-toast-actions';

  const dismiss = document.createElement('button');
  dismiss.type = 'button';
  dismiss.className = 'ql-toast-dismiss';
  dismiss.textContent = strings.toastDismiss;
  dismiss.addEventListener('click', () => dismissToast());

  actions.appendChild(dismiss);
  toast.appendChild(text);
  toast.appendChild(actions);
  slot.appendChild(toast);

  dismiss.focus();

  escapeHandler = (e) => {
    if (e.key === 'Escape') dismissToast();
  };
  document.addEventListener('keydown', escapeHandler, true);

  hideTimer = window.setTimeout(() => dismissToast(), TOAST_DURATION_MS);
}
