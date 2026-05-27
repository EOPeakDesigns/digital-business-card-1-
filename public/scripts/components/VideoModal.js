/**
 * Owner showcase video modal (embed or local file from card.json).
 */

import { getCardData, t } from '../utils/cardData.js';
import { trapFocus, blurTrigger, lockBodyScroll } from '../utils/modal.js';
import { isFeatureVideoEnabled, normalizeEmbedUrl } from '../utils/video.js';

export class VideoModal {
  constructor() {
    this.modal = document.getElementById('video-modal');
    this.mediaHost = document.getElementById('video-media-host');
    this.closeButton = this.modal?.querySelector('.modal__close');
    this.backdrop = this.modal?.querySelector('.modal__backdrop');
    this.trigger = null;
    this.isOpen = false;
    this.releaseTrap = null;
    this.activeMedia = null;

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

    this.closeButton?.addEventListener('click', this.handleClose);
    this.backdrop?.addEventListener('click', this.handleBackdrop);
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('dbc:localechange', () => this.updateLabels());

    this.updateLabels();
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

    this.closeButton?.setAttribute('aria-label', t('videoClose'));
  }

  /**
   * Stop and remove all media to prevent background audio.
   * @private
   */
  teardownMedia() {
    if (!this.mediaHost) {
      return;
    }

    const iframe = this.mediaHost.querySelector('iframe');
    const vid = this.mediaHost.querySelector('video');

    if (iframe) {
      iframe.src = 'about:blank';
    }

    if (vid) {
      try {
        vid.pause();
        vid.removeAttribute('src');
        vid.load();
      } catch {
        /* ignore */
      }
    }

    this.mediaHost.innerHTML = '';
    this.activeMedia = null;
  }

  open() {
    const data = getCardData();
    const video = data.featureVideo;

    if (!isFeatureVideoEnabled(video) || !this.modal || !this.mediaHost) {
      return;
    }

    this.teardownMedia();

    const useLocal = video.type === 'local' && video.localSrc;
    const embedSrc = !useLocal && video.embedUrl ? normalizeEmbedUrl(video.embedUrl) : '';

    if (useLocal) {
      const vid = document.createElement('video');
      vid.src = video.localSrc;
      vid.controls = true;
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.preload = 'metadata';
      if (video.poster) {
        vid.poster = video.poster;
      }
      vid.title = t('videoTitle');
      this.mediaHost.appendChild(vid);
      this.activeMedia = vid;
    } else if (embedSrc) {
      const iframe = document.createElement('iframe');
      iframe.src = embedSrc;
      iframe.title = t('videoTitle');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      );
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      this.mediaHost.appendChild(iframe);
      this.activeMedia = iframe;
    } else {
      return;
    }

    this.updateLabels();
    this.modal.hidden = false;
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    lockBodyScroll(true);
    this.releaseTrap = trapFocus(this.modal);
    this.closeButton?.focus();
    blurTrigger(this.trigger);
  }

  close() {
    if (!this.modal) {
      return;
    }

    this.modal.querySelector(':focus')?.blur();
    this.teardownMedia();

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
