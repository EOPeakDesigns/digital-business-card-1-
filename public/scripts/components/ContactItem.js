/**
 * Contact Item Component
 */

import { copyToClipboard } from '../utils/clipboard.js';
import { t } from '../utils/cardData.js';
import { announceToScreenReader } from '../utils/accessibility.js';
import { showToast } from './Toast.js';

export class ContactItem {
  constructor(element) {
    this.element = element;
    this.copyButton = element.querySelector('.contact-item__copy-btn');
    this.contactLink = element.querySelector('.contact-link');
    this.contactText = element.querySelector('.contact-item__text');
    this.init();
  }

  init() {
    if (this.copyButton) {
      this.copyButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleCopyClick();
      });
    }

    this.element.addEventListener('click', (e) => {
      if (e.target.closest('.contact-item__copy-btn')) {
        return;
      }
      if (this.contactLink) {
        this.contactLink.click();
        setTimeout(() => this.contactLink.blur(), 100);
      }
    });
  }

  async handleCopyClick() {
    const textToCopy =
      this.copyButton?.getAttribute('data-copy') ||
      this.contactText?.textContent.trim();

    if (!textToCopy) {
      return;
    }

    const isPhone = textToCopy.includes('+') || /^\d/.test(textToCopy.trim());
    const success = await copyToClipboard(textToCopy);

    if (success) {
      this.showCopySuccess();
      const msg = isPhone ? t('copiedPhone') : t('copiedEmail');
      announceToScreenReader(msg);
      showToast(msg);
    } else {
      announceToScreenReader(t('copyFailed'), 'assertive');
      showToast(t('copyFailed'));
    }

    this.copyButton?.blur();
  }

  showCopySuccess() {
    if (!this.copyButton) {
      return;
    }
    this.copyButton.classList.add('copied');
    const icon = this.copyButton.querySelector('i');
    if (icon) {
      const originalClass = icon.className;
      icon.className = 'fa-solid fa-check';
      setTimeout(() => {
        this.copyButton.classList.remove('copied');
        icon.className = originalClass;
      }, 1500);
    }
  }
}
