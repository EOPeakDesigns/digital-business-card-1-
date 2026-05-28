/**
 * Owner showcase video modal — YouTube iframe (lazy) or legacy local <video>.
 */

import { getCardData, t } from '../utils/cardData.js';
import { trapFocus, blurTrigger, lockBodyScroll } from '../utils/modal.js';
import { isFeatureVideoEnabled, normalizeEmbedUrl } from '../utils/video.js';

export class VideoModal {
  /**
   * @param {{ profileVideo?: HTMLIFrameElement|null, profileVideoSource?: null }} [options]
   */
  constructor(options = {}) {
    this.modal = document.getElementById('video-modal');
    this.embedHost = this.modal?.querySelector('.video-embed');
    this.profileVideo = options.profileVideo ?? document.getElementById('profileVideoFrame');
    this.closeButton = this.modal?.querySelector('.modal__close');
    this.backdrop = this.modal?.querySelector('.modal__backdrop');
    this.trigger = null;
    this.isOpen = false;
    this.releaseTrap = null;
    this.legacyVideo = null;

    this.handleClose = () => this.close();
    this.handleBackdrop = () => this.close();
    this.handleDocumentClick = (e) => {
      const btn = e.target.closest('#avatar-video-trigger');
      if (btn) {
        this.trigger = btn;
        this.open();
      }
    };
    this.handleKeydown = (e) => {
      if (this.isOpen && e.key === 'Escape') {
        this.close();
      }
    };

    this.init();
  }

  init() {
    if (!this.modal) {
      return;
    }

    this.syncEmbedDataSrc();
    this.closeButton?.addEventListener('click', this.handleClose);
    this.backdrop?.addEventListener('click', this.handleBackdrop);
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('dbc:localechange', () => this.updateLabels());

    this.updateLabels();
  }

  /**
   * Keep iframe data-src aligned with card.json (no network until modal opens).
   */
  syncEmbedDataSrc() {
    const data = getCardData();
    const video = data.featureVideo;
    const useLocal = video?.type === 'local' && video.localSrc;

    if (!this.profileVideo || useLocal) {
      return;
    }

    const embedSrc = video.embedUrl ? normalizeEmbedUrl(video.embedUrl) : '';
    if (embedSrc) {
      this.profileVideo.setAttribute('data-src', embedSrc);
    }
  }

  updateLabels() {
    const eyebrow = document.getElementById('video-modal-eyebrow');
    const title = document.getElementById('video-modal-title');
    const caption = document.getElementById('video-modal-caption');

    if (eyebrow) {
      eyebrow.textContent = t('videoEyebrow');
    }
    if (title) {
      title.textContent = t('videoTitle');
    }
    if (caption) {
      caption.textContent = t('videoCaption');
    }

    if (this.profileVideo) {
      this.profileVideo.title = t('videoTitle');
    }

    this.closeButton?.setAttribute('aria-label', t('videoClose'));
  }

  /**
   * Lazy-load YouTube iframe when modal is visible.
   */
  loadEmbed() {
    if (!this.profileVideo) {
      return;
    }

    const src = this.profileVideo.getAttribute('data-src');
    if (src) {
      this.profileVideo.src = src;
    }
  }

  /**
   * Unload iframe to stop playback and background audio.
   */
  unloadEmbed() {
    if (!this.profileVideo) {
      return;
    }

    this.profileVideo.removeAttribute('src');
  }

  /**
   * @private
   */
  teardownLegacyVideo() {
    if (!this.legacyVideo) {
      return;
    }

    try {
      this.legacyVideo.pause();
      this.legacyVideo.removeAttribute('src');
      this.legacyVideo.load();
    } catch {
      /* ignore */
    }

    this.legacyVideo.remove();
    this.legacyVideo = null;
  }

  /**
   * @private
   */
  mountLegacyVideo(src, poster) {
    if (!this.embedHost) {
      return;
    }

    this.teardownLegacyVideo();
    this.unloadEmbed();

    if (this.profileVideo) {
      this.profileVideo.hidden = true;
    }

    const vid = document.createElement('video');
    vid.src = src;
    vid.controls = true;
    vid.playsInline = true;
    vid.setAttribute('playsinline', '');
    vid.preload = 'metadata';
    if (poster) {
      vid.poster = poster;
    }
    vid.title = t('videoTitle');
    this.embedHost.appendChild(vid);
    this.legacyVideo = vid;
  }

  /**
   * @private
   */
  showYouTubeEmbed() {
    this.teardownLegacyVideo();

    if (this.profileVideo) {
      this.profileVideo.hidden = false;
    }
  }

  open() {
    const data = getCardData();
    const video = data.featureVideo;

    if (!isFeatureVideoEnabled(video) || !this.modal) {
      return;
    }

    this.syncEmbedDataSrc();
    this.updateLabels();

    const useLocal = video.type === 'local' && video.localSrc;

    this.modal.hidden = false;
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    lockBodyScroll(true);

    if (useLocal) {
      this.mountLegacyVideo(video.localSrc, video.poster);
    } else {
      this.showYouTubeEmbed();
      this.loadEmbed();
    }

    this.releaseTrap = trapFocus(this.modal);
    this.closeButton?.focus();
    blurTrigger(this.trigger);
  }

  close() {
    if (!this.modal) {
      return;
    }

    this.modal.querySelector(':focus')?.blur();
    this.unloadEmbed();
    this.teardownLegacyVideo();

    if (this.profileVideo) {
      this.profileVideo.hidden = false;
    }

    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    lockBodyScroll(false);

    if (this.releaseTrap) {
      this.releaseTrap();
      this.releaseTrap = null;
    }

    blurTrigger(this.trigger);
  }

  destroy() {
    this.close();
    this.closeButton?.removeEventListener('click', this.handleClose);
    this.backdrop?.removeEventListener('click', this.handleBackdrop);
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('click', this.handleDocumentClick);
  }
}
