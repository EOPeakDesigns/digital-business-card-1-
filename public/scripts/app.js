/**
 * Digital Business Card — application bootstrap
 */

import { loadCardData, setLocale, getLocale, t, getCardData } from './utils/cardData.js';
import { renderCard, updateMeta } from './handlers/renderCard.js';
import { ProfileCard } from './components/ProfileCard.js';
import { QRModal } from './components/QRModal.js';
import { VideoModal } from './components/VideoModal.js';
import { SocialButtons } from './components/SocialButtons.js';
import { downloadVCard } from './handlers/vcard.js';
import { shareCard } from './handlers/share.js';
import { registerServiceWorker, initInstallBanner } from './handlers/pwa.js';
import { toggleLocale } from './handlers/i18n.js';
import { isFeatureVideoEnabled } from './utils/video.js';

class DigitalBusinessCardApp {
  constructor() {
    this.profileCard = null;
    this.qrModal = null;
    this.videoModal = null;
    this.socialButtons = null;
    this.isInitialized = false;
  }

  async init() {
    try {
      if (document.readyState === 'loading') {
        await new Promise((resolve) => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      const data = await loadCardData();
      setLocale(getLocale() || data.meta?.defaultLocale || 'en');

      await this.preloadBackgroundImage();
      await renderCard();
      updateMeta();
      this.syncVideoModalVisibility(data);

      this.wireChrome();
      this.wireUtilities();

      this.profileCard = new ProfileCard();
      this.profileCard.reinit();

      this.qrModal = new QRModal();
      this.videoModal = new VideoModal();
      this.socialButtons = new SocialButtons();

      registerServiceWorker();
      initInstallBanner();
      this.handlePwaShortcuts();

      document.addEventListener('dbc:localechange', async () => {
        await renderCard();
        updateMeta();
        this.syncVideoModalVisibility(getCardData());
        this.wireChrome();
        this.profileCard?.reinit();
        this.wireUtilities();
      });

      this.isInitialized = true;
      document.dispatchEvent(new CustomEvent('digitalBusinessCardReady', { detail: { app: this } }));
    } catch (error) {
      console.error('Failed to initialize Digital Business Card App:', error);
    }
  }

  wireChrome() {
    const skip = document.getElementById('skip-link');
    if (skip) {
      skip.textContent = t('skipToContent');
    }

    const langBtn = document.getElementById('btn-lang');
    if (langBtn) {
      langBtn.setAttribute('aria-label', t('langToggle'));
      langBtn.onclick = () => toggleLocale();
    }

    const installText = document.getElementById('install-banner-text');
    if (installText) {
      installText.textContent = t('installApp');
    }
  }

  /**
   * Hide video modal markup when feature is disabled (prevents empty dialog on load).
   * @param {object} data
   */
  syncVideoModalVisibility(data) {
    const modal = document.getElementById('video-modal');
    if (!modal) {
      return;
    }

    const enabled = isFeatureVideoEnabled(data.featureVideo);

    if (enabled) {
      modal.hidden = false;
    } else {
      modal.hidden = true;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  wireUtilities() {
    const saveBtn = document.getElementById('btn-save-contact');
    const shareBtn = document.getElementById('btn-share-card');
    if (saveBtn) {
      saveBtn.setAttribute('aria-label', t('saveContact'));
      saveBtn.onclick = downloadVCard;
    }
    if (shareBtn) {
      shareBtn.setAttribute('aria-label', t('shareCard'));
      shareBtn.onclick = shareCard;
    }
  }

  handlePwaShortcuts() {
    const action = new URLSearchParams(window.location.search).get('action');
    if (!action) {
      return;
    }
    const { contact } = getCardData();
    if (action === 'call' && contact.phone?.tel) {
      window.location.href = `tel:${contact.phone.tel.replace(/\s/g, '')}`;
    } else if (action === 'email' && contact.email) {
      window.location.href = `mailto:${contact.email}`;
    } else if (action === 'website' && contact.website?.url) {
      window.location.href = contact.website.url;
    }
  }

  async preloadBackgroundImage() {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = 'assets/bacground.png';
    });
  }

  destroy() {
    this.profileCard?.destroy();
    this.qrModal?.destroy();
    this.videoModal?.destroy();
    this.socialButtons?.destroy();
    this.isInitialized = false;
  }
}

const app = new DigitalBusinessCardApp();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

export default app;
