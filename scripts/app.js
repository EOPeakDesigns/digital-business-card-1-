/**
 * Main Application Entry Point
 * Initializes the digital business card application
 * 
 * @author Senior Web Developer
 * @version 1.0.0
 */

import { ProfileCard } from './components/ProfileCard.js';
import { QRModal } from './components/QRModal.js';
import { SocialButtons } from './components/SocialButtons.js';

/**
 * Application class that manages the entire digital business card
 */
class DigitalBusinessCardApp {
  constructor() {
    this.profileCard = null;
    this.qrModal = null;
    this.socialButtons = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Preload background image to resolve preload warnings
      await this.preloadBackgroundImage();

      // Initialize main components
      this.profileCard = new ProfileCard();
      this.qrModal = new QRModal();
      this.socialButtons = new SocialButtons();
      this.isInitialized = true;
      
      // Dispatch custom event for other modules to listen to
      this.dispatchInitEvent();
      
    } catch (error) {
      console.error('Failed to initialize Digital Business Card App:', error);
      this.handleInitError(error);
    }
  }

  /**
   * Preload background image to resolve preload warnings
   * @private
   */
  async preloadBackgroundImage() {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve();
      };
      img.onerror = () => {
        // Silently fail - continue with fallback background
        resolve();
      };
      img.src = 'assets/bacground.png';
    });
  }

  /**
   * Dispatch initialization complete event
   * @private
   */
  dispatchInitEvent() {
    const event = new CustomEvent('digitalBusinessCardReady', {
      detail: { app: this }
    });
    document.dispatchEvent(event);
  }

  /**
   * Handle initialization errors
   * @param {Error} error - Error object
   * @private
   */
  handleInitError(error) {
    // Could show user-friendly error message
    console.error('Application initialization failed:', error);
  }

  /**
   * Get the profile card instance
   * @returns {ProfileCard|null} - Profile card instance
   */
  getProfileCard() {
    return this.profileCard;
  }

  /**
   * Get the QR modal instance
   * @returns {QRModal|null} - QR modal instance
   */
  getQRModal() {
    return this.qrModal;
  }

  /**
   * Get the social buttons instance
   * @returns {SocialButtons|null} - Social buttons instance
   */
  getSocialButtons() {
    return this.socialButtons;
  }

  /**
   * Check if application is initialized
   * @returns {boolean} - Initialization status
   */
  isAppInitialized() {
    return this.isInitialized;
  }

  /**
   * Destroy the application and clean up resources
   */
  destroy() {
    if (this.profileCard) {
      this.profileCard.destroy();
      this.profileCard = null;
    }
    if (this.qrModal) {
      this.qrModal.destroy();
      this.qrModal = null;
    }
    if (this.socialButtons) {
      this.socialButtons.destroy();
      this.socialButtons = null;
    }
    this.isInitialized = false;
  }
}

// Create and initialize the application
const app = new DigitalBusinessCardApp();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for potential external use
export default app;
