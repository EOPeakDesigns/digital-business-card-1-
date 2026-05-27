/**
 * PWA install banner + service worker registration.
 */

import { t } from '../utils/cardData.js';

const DISMISS_KEY = 'dbc_install_dismissed';
let deferredPrompt = null;

/**
 * @returns {boolean}
 */
export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

/**
 * Register service worker when supported.
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const swPath = new URL('sw.js', window.location.href).pathname;
  navigator.serviceWorker.register(swPath).catch(() => {
    /* SW optional for local file:// */
  });
}

/**
 * Wire install banner UI.
 */
export function initInstallBanner() {
  const banner = document.getElementById('install-banner');
  const installBtn = document.getElementById('install-accept');
  const dismissBtn = document.getElementById('install-dismiss');

  if (!banner || !installBtn || !dismissBtn) {
    return;
  }

  const updateLabels = () => {
    installBtn.textContent = t('installApp');
    dismissBtn.textContent = t('installDismiss');
    const text = document.getElementById('install-banner-text');
    if (text) {
      text.textContent = t('installApp');
    }
  };

  updateLabels();
  document.addEventListener('dbc:localechange', updateLabels);

  const showIfEligible = () => {
    if (
      isStandalone() ||
      localStorage.getItem(DISMISS_KEY) === '1' ||
      !deferredPrompt
    ) {
      banner.hidden = true;
      return;
    }
    banner.hidden = false;
  };

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showIfEligible();
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    banner.hidden = true;
  });

  dismissBtn.addEventListener('click', () => {
    localStorage.setItem(DISMISS_KEY, '1');
    banner.hidden = true;
  });

  if (!isStandalone() && localStorage.getItem(DISMISS_KEY) !== '1') {
    /* Banner appears when beforeinstallprompt fires */
  }
}
