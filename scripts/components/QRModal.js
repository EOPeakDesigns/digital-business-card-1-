/**
 * QR Code Modal Component
 * Handles QR code modal display and download functionality
 * 
 * @author Senior Web Developer
 * @version 1.0.0
 */

export class QRModal {
  constructor() {
    this.modal = null;
    this.backdrop = null;
    this.closeButton = null;
    this.downloadButton = null;
    this.qrImage = null;
    this.qrButtonElement = null;
    this.qrButton = null;
    this.isOpen = false;
    
    // Stable handler references for add/removeEventListener correctness
    this.handleQrButtonClick = null;
    this.handleCloseClick = null;
    this.handleBackdropClick = null;
    this.handleDownloadClick = null;
    this.handleDocumentKeydown = null;
    
    this.init();
  }

  /**
   * Initialize the QR modal component
   */
  init() {
    this.modal = document.querySelector('.qr-modal');
    this.backdrop = document.querySelector('.modal__backdrop');
    this.closeButton = document.querySelector('.modal__close');
    this.downloadButton = document.querySelector('.qr-download-btn');
    this.qrImage = document.querySelector('.qr-code-image');
    this.qrButton = document.querySelector('.qr-button');

    if (!this.modal) {
      return;
    }

    this.bindEvents();
  }

  /**
   * Bind event listeners
   * @private
   */
  bindEvents() {
    // Create stable handler references once
    this.handleQrButtonClick = () => this.open();
    this.handleCloseClick = () => this.close();
    this.handleBackdropClick = () => this.close();
    this.handleDownloadClick = () => this.downloadQR();
    this.handleDocumentKeydown = (e) => this.handleKeydown(e);

    // QR button click
    if (this.qrButton) {
      this.qrButton.addEventListener('click', this.handleQrButtonClick);
    }

    // Close button click
    if (this.closeButton) {
      this.closeButton.addEventListener('click', this.handleCloseClick);
    }

    // Backdrop click
    if (this.backdrop) {
      this.backdrop.addEventListener('click', this.handleBackdropClick);
    }

    // Download button click
    if (this.downloadButton) {
      this.downloadButton.addEventListener('click', this.handleDownloadClick);
    }

    // Keyboard events
    document.addEventListener('keydown', this.handleDocumentKeydown);
  }

  /**
   * Open the QR modal
   */
  open() {
    if (!this.modal) return;

    // Store QR button reference for focus return on desktop
    this.qrButtonElement = document.querySelector('.qr-button');
    
    // Immediately blur QR button to remove any active/focus state
    // This ensures button returns to normal state right after click
    if (this.qrButtonElement) {
      requestAnimationFrame(() => {
        if (this.qrButtonElement) {
          this.qrButtonElement.blur();
        }
      });
    }

    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    
    // Focus management
    this.closeButton.focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the QR modal
   */
  close() {
    if (!this.modal || !this.isOpen) return;

    // Blur any focused elements inside the modal before setting aria-hidden
    // This prevents ARIA warnings about focused elements being hidden
    const focusedElement = this.modal.querySelector(':focus');
    if (focusedElement) {
      focusedElement.blur();
    }

    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to QR button (only on desktop screens >768px)
    this.returnFocusToQRButton();
  }

  /**
   * Return focus to QR button on desktop screens only
   * @private
   */
  returnFocusToQRButton() {
    // Check if screen is desktop (>768px)
    const isDesktop = window.matchMedia ? window.matchMedia('(min-width: 769px)').matches : window.innerWidth > 768;
    
    if (isDesktop) {
      const qrButton = this.qrButtonElement || document.querySelector('.qr-button');
      if (qrButton) {
        // Use requestAnimationFrame to ensure focus happens after modal closes
        requestAnimationFrame(() => {
          try {
            // Return focus briefly for accessibility
            qrButton.focus();
            
            // Blur after focus to return button to normal state
            // This prevents button from staying in hover/focus state
            setTimeout(() => {
              if (qrButton && document.activeElement === qrButton) {
                qrButton.blur();
              }
            }, 100);
          } catch (error) {
            // Silently fail - focus return is not critical
          }
        });
      }
    }
  }

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} e - Keyboard event
   * @private
   */
  handleKeydown(e) {
    if (!this.isOpen) return;

    if (e.key === 'Escape') {
      this.close();
    }
  }

  /**
   * Download QR code image
   * @private
   */
  async downloadQR() {
    if (!this.qrImage) {
      return;
    }

    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = this.qrImage.src;
      link.download = 'alexander-martinez-qr-code.png';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success feedback (optional)
      this.showDownloadFeedback();
      
    } catch (error) {
      // Silently handle download errors
      this.showDownloadError();
    }
  }

  /**
   * Show download success feedback
   * @private
   */
  showDownloadFeedback() {
    // You can integrate with the existing toast system here
    // Download feedback is handled visually by the browser
  }

  /**
   * Show download error feedback
   * @private
   */
  showDownloadError() {
    // You can integrate with the existing toast system here
    // Download errors are handled silently
  }

  /**
   * Check if modal is open
   * @returns {boolean} - Modal open state
   */
  isModalOpen() {
    return this.isOpen;
  }

  /**
   * Destroy the component and clean up
   */
  destroy() {
    // Remove event listeners
    if (this.qrButton && this.handleQrButtonClick) {
      this.qrButton.removeEventListener('click', this.handleQrButtonClick);
    }

    if (this.closeButton && this.handleCloseClick) {
      this.closeButton.removeEventListener('click', this.handleCloseClick);
    }

    if (this.backdrop && this.handleBackdropClick) {
      this.backdrop.removeEventListener('click', this.handleBackdropClick);
    }

    if (this.downloadButton && this.handleDownloadClick) {
      this.downloadButton.removeEventListener('click', this.handleDownloadClick);
    }

    if (this.handleDocumentKeydown) {
      document.removeEventListener('keydown', this.handleDocumentKeydown);
    }

    // Reset state
    this.isOpen = false;
    document.body.style.overflow = '';

    // Clear handler refs
    this.handleQrButtonClick = null;
    this.handleCloseClick = null;
    this.handleBackdropClick = null;
    this.handleDownloadClick = null;
    this.handleDocumentKeydown = null;
  }
}
