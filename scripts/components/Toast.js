/**
 * Toast Notification Component
 * Handles display of temporary notifications to users
 * 
 * @author Senior Web Developer
 * @version 1.0.0
 */

export class Toast {
  constructor() {
    this.toastElement = null;
    this.init();
  }

  /**
   * Initialize toast element
   * @private
   */
  init() {
    this.toastElement = document.querySelector('.toast');
    if (!this.toastElement) {
      console.warn('Toast element not found in DOM');
    }
  }

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {number} duration - Duration in milliseconds (default: 2500)
   */
  show(message, duration = 2500) {
    if (!this.toastElement) {
      console.error('Toast element not available');
      return;
    }

    // Clear any existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Set message and show
    this.toastElement.textContent = message;
    this.toastElement.classList.add('toast--show');

    // Auto-hide after duration
    this.timeoutId = setTimeout(() => {
      this.hide();
    }, duration);
  }

  /**
   * Hide toast notification
   * @private
   */
  hide() {
    if (this.toastElement) {
      this.toastElement.classList.remove('toast--show');
    }
  }

  /**
   * Show success message for copy operation
   * @param {string} text - Text that was copied
   */
  showCopySuccess(text) {
    const isPhone = text.includes('+') || /^\d/.test(text.trim());
    const message = isPhone ? 'Copied phone number' : 'Copied email';
    this.show(message);
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message = 'Failed to copy') {
    this.show(message);
  }
}
