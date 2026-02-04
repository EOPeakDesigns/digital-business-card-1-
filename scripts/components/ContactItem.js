/**
 * Contact Item Component
 * Handles individual contact item interactions and copy functionality
 * 
 * @author Senior Web Developer
 * @version 1.0.0
 */

import { copyToClipboard, isPhoneNumber } from '../utils/clipboard.js';

export class ContactItem {
  constructor(element) {
    this.element = element;
    this.copyButton = element.querySelector('.contact-item__copy-btn');
    this.contactLink = element.querySelector('.contact-link');
    this.contactText = element.querySelector('.contact-item__text');
    
    this.init();
  }

  /**
   * Initialize contact item event listeners
   * @private
   */
  init() {
    if (this.copyButton) {
      this.copyButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleCopyClick();
      });
    }

    // Make entire contact item clickable (except copy button)
    this.element.addEventListener('click', (e) => {
      if (e.target.closest('.contact-item__copy-btn')) {
        return; // Don't trigger link if clicking copy button
      }
      
      if (this.contactLink) {
        this.contactLink.click();
        // Remove focus to prevent persistent hover effect
        setTimeout(() => {
          this.contactLink.blur();
        }, 100);
      }
    });

    // Add global click handler to remove focus from all contact elements
    this.addGlobalClickHandler();
  }

  /**
   * Add global click handler to remove focus from contact elements
   * @private
   */
  addGlobalClickHandler() {
    // Only add the handler once
    if (!document.hasGlobalContactClickHandler) {
      document.addEventListener('click', (e) => {
        // If clicking outside contact items, remove focus from all contact elements
        if (!e.target.closest('.contact-item')) {
          const contactElements = document.querySelectorAll('.contact-link, .contact-item__copy-btn');
          contactElements.forEach(element => {
            if (document.activeElement === element) {
              element.blur();
            }
          });
        }
      });
      document.hasGlobalContactClickHandler = true;
    }
  }

  /**
   * Handle copy button click
   * @private
   */
  async handleCopyClick() {
    if (!this.contactText) {
      return;
    }

    const textToCopy = this.contactText.textContent.trim();
    
    if (!textToCopy) {
      return;
    }

    try {
      const success = await copyToClipboard(textToCopy);
      
      if (success) {
        this.showCopySuccess();
      }
    } catch (error) {
      // Silently fail - copy operation errors are handled by the clipboard utility
    } finally {
      // Remove focus to prevent persistent hover effect
      this.copyButton.blur();
    }
  }

  /**
   * Show copy success visual feedback
   * @private
   */
  showCopySuccess() {
    // Add success class for visual feedback
    this.copyButton.classList.add('copied');
    
    // Change icon to checkmark temporarily
    const icon = this.copyButton.querySelector('i');
    if (icon) {
      const originalClass = icon.className;
      icon.className = 'fa-solid fa-check';
      
      // Reset after 1.5 seconds
      setTimeout(() => {
        this.copyButton.classList.remove('copied');
        icon.className = originalClass;
      }, 1500);
    }
  }

  /**
   * Get contact text content
   * @returns {string} - Contact text
   */
  getText() {
    return this.contactText ? this.contactText.textContent.trim() : '';
  }

  /**
   * Check if this is a phone number contact
   * @returns {boolean} - True if phone number
   */
  isPhone() {
    return isPhoneNumber(this.getText());
  }
}
