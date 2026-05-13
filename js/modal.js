let dialogQueue = Promise.resolve();

function getModalElements() {
  let overlay = document.getElementById('ql-modal-overlay');

  if (!overlay) {
    const template = document.createElement('template');
    template.innerHTML = `
<div class="ql-modal-overlay" id="ql-modal-overlay">
  <div class="ql-modal" role="dialog" aria-modal="true" aria-labelledby="ql-modal-message">
    <p class="ql-modal-message" id="ql-modal-message"></p>
    <div class="ql-modal-actions">
      <button type="button" class="ql-btn ql-modal-confirm">Confirm</button>
      <button type="button" class="ql-btn ql-btn--ghost ql-modal-cancel">Cancel</button>
    </div>
  </div>
</div>`;
    overlay = /** @type {HTMLElement} */ (template.content.firstElementChild);
    document.body.appendChild(overlay);
  }

  return {
    overlay,
    message: /** @type {HTMLElement} */ (overlay.querySelector('#ql-modal-message')),
    confirm: /** @type {HTMLButtonElement} */ (overlay.querySelector('.ql-modal-confirm')),
    cancel: /** @type {HTMLButtonElement} */ (overlay.querySelector('.ql-modal-cancel')),
  };
}

/**
 * @param {string} message
 * @param {{ confirmLabel: string, showCancel: boolean }} options
 */
function queueDialog(message, options) {
  const result = dialogQueue.then(() => showDialog(message, options));
  dialogQueue = result.catch(() => undefined).then(() => undefined);
  return result;
}

/**
 * @param {string} message
 * @param {{ confirmLabel: string, showCancel: boolean }} options
 * @returns {Promise<boolean>}
 */
function showDialog(message, options) {
  const { overlay, message: messageEl, confirm, cancel } = getModalElements();
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  messageEl.textContent = message;
  confirm.textContent = options.confirmLabel;
  cancel.hidden = !options.showCancel;
  overlay.hidden = false;
  const firstButton = overlay.querySelector('button:not([hidden])');
  if (firstButton instanceof HTMLButtonElement) firstButton.focus();

  return new Promise((resolve) => {
    const close = (value) => {
      confirm.onclick = null;
      cancel.onclick = null;
      document.removeEventListener('keydown', onKeyDown);
      overlay.hidden = true;
      if (previousFocus?.isConnected) previousFocus.focus();
      resolve(value);
    };

    const onConfirm = () => {
      close(true);
    };
    const onCancel = () => {
      close(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close(false);
    };

    confirm.onclick = onConfirm;
    cancel.onclick = onCancel;
    document.addEventListener('keydown', onKeyDown);
  });
}

/** @param {string} message */
export function showConfirm(message) {
  return queueDialog(message, { confirmLabel: 'Confirm', showCancel: true });
}

/** @param {string} message */
export function showAlert(message) {
  return queueDialog(message, { confirmLabel: 'Dismiss', showCancel: false }).then(() => undefined);
}
