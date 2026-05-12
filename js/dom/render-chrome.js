const BANNER_ID = 'ql-offline-banner';

/** @param {boolean} online @param {string} [offlineMessage] */
export function renderConnectivityBanner(online, offlineMessage = '') {
  let el = document.getElementById(BANNER_ID);
  if (!online) {
    if (!el) {
      el = document.createElement('div');
      el.id = BANNER_ID;
      el.className = 'ql-banner';
      el.setAttribute('role', 'status');
      const mount = document.getElementById('ql-banner-slot');
      if (mount) mount.prepend(el);
    }
    el.hidden = false;
    el.textContent = offlineMessage;
  } else if (el) {
    el.remove();
  }
}
