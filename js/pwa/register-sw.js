export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  const registerSW = () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
      /* localhost file:// or blocked */
    });
  };

  if (document.readyState === 'complete') {
    registerSW();
  } else {
    window.addEventListener('load', registerSW);
  }
}
