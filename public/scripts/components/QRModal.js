/**
 * QR Code Modal Component
 */

import { getCardData, t } from '../utils/cardData.js';
import { trapFocus, blurTrigger, lockBodyScroll } from '../utils/modal.js';
import { announceToScreenReader } from '../utils/accessibility.js';

export class QRModal {
  constructor() {
    this.modal = document.getElementById('qr-modal');
    this.backdrop = this.modal?.querySelector('.modal__backdrop');
    this.closeButton = this.modal?.querySelector('.modal__close');
    this.downloadButton = this.modal?.querySelector('.qr-download-btn');
    this.qrImage = this.modal?.querySelector('.qr-code-image');
    this.trigger = null;
    this.isOpen = false;
    this.releaseTrap = null;

    this.handleDocumentClick = (e) => {
      const btn = e.target.closest('.qr-button');
      if (btn) {
        this.trigger = btn;
        this.open();
      }
    };
    this.handleClose = () => this.close();
    this.handleBackdrop = () => this.close();
    this.handleDownload = () => this.downloadQR();
    this.handleKeydown = (e) => {
      if (!this.isOpen) {
        return;
      }
      if (e.key === 'Escape') {
        this.close();
      }
    };

    this.init();
  }

  init() {
    if (!this.modal) {
      return;
    }

    document.addEventListener('click', this.handleDocumentClick);
    this.closeButton?.addEventListener('click', this.handleClose);
    this.backdrop?.addEventListener('click', this.handleBackdrop);
    this.downloadButton?.addEventListener('click', this.handleDownload);
    document.addEventListener('keydown', this.handleKeydown);

    document.addEventListener('dbc:localechange', () => {
      const title = document.getElementById('qr-modal-title');
      if (title) {
        title.textContent = t('qrTitle');
      }
      this.closeButton?.setAttribute('aria-label', t('qrClose'));
    });
  }

  open() {
    if (!this.modal) {
      return;
    }

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

  async downloadQR() {
    if (!this.qrImage) {
      return;
    }

    try {
      const data = getCardData();
      const slug = data.person.name.toLowerCase().replace(/\s+/g, '-');
      const link = document.createElement('a');
      link.href = this.qrImage.src;
      link.download = `${slug}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      announceToScreenReader(t('qrDownload'));
    } catch {
      /* download optional */
    }
  }

  destroy() {
    document.removeEventListener('click', this.handleDocumentClick);
    this.closeButton?.removeEventListener('click', this.handleClose);
    this.backdrop?.removeEventListener('click', this.handleBackdrop);
    this.downloadButton?.removeEventListener('click', this.handleDownload);
    document.removeEventListener('keydown', this.handleKeydown);
    this.close();
  }
}
