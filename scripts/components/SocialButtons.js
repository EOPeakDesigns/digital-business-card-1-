/**
 * Social Buttons Component
 * Handles social media buttons and QR button with focus return on desktop
 * 
 * @author Senior Web Developer
 * @version 1.0.0
 */

export class SocialButtons {
  constructor() {
    this.socialButtons = [];
    this.socialButtonHandlers = [];
    this.qrButton = null;
    this.isDesktop = false;
    this.desktopMediaQuery = null;
    this.lastClickedButton = null;
    this.windowFocusHandler = null;
    this.handleDesktopMediaChange = null;
    this.init();
  }

  /**
   * Initialize the social buttons component
   * @private
   */
  init() {
    this.setupDesktopDetection();
    this.initializeSocialButtons();
    this.initializeQRButton();
  }

  /**
   * Setup desktop screen detection (>768px)
   * @private
   */
  setupDesktopDetection() {
    // Check if matchMedia is supported
    if (window.matchMedia) {
      this.desktopMediaQuery = window.matchMedia('(min-width: 769px)');
      this.isDesktop = this.desktopMediaQuery.matches;
      
      // Listen for changes in screen size
      this.handleDesktopMediaChange = (e) => {
        this.isDesktop = e.matches;
      };
      this.desktopMediaQuery.addEventListener('change', this.handleDesktopMediaChange);
    } else {
      // Fallback for older browsers
      this.isDesktop = window.innerWidth > 768;
    }
  }

  /**
   * Initialize social media buttons (Facebook, Instagram, LinkedIn, X)
   * @private
   */
  initializeSocialButtons() {
    const socialButtonElements = document.querySelectorAll('.social-button:not(.qr-button)');
    
    socialButtonElements.forEach(button => {
      // Store original click handler if any
      const originalHref = button.getAttribute('href');
      
      if (originalHref && button.tagName === 'A') {
        // Add click handler for focus return on desktop
        const handler = (e) => this.handleSocialButtonClick(e, button);
        button.addEventListener('click', handler);
        this.socialButtonHandlers.push({ button, handler });
        
        this.socialButtons.push(button);
      }
    });
  }

  /**
   * Handle social button click - return focus on desktop
   * @param {Event} e - Click event
   * @param {HTMLElement} button - Button element that was clicked
   * @private
   */
  handleSocialButtonClick(e, button) {
    // Only return focus on desktop screens (>768px)
    if (this.isDesktop) {
      // Store the button for focus return
      const clickedButton = button;
      
      // Immediately blur the button to remove any active/focus state
      // This ensures button returns to normal state right after click
      requestAnimationFrame(() => {
        if (clickedButton) {
          clickedButton.blur();
        }
      });
      
      // Store button reference for window focus handler
      this.lastClickedButton = clickedButton;
      
      // Use multiple timing strategies to ensure focus return happens
      // after the new tab opens and browser processes the navigation
      requestAnimationFrame(() => {
        // First attempt - return focus briefly for accessibility
        setTimeout(() => {
          if (this.isDesktop && clickedButton) {
            try {
              // Only try to focus if document has focus (window is active)
              if (document.hasFocus()) {
                clickedButton.focus();
                
                // Blur immediately after focus to return button to normal state
                // This prevents button from staying in hover/focus state
                setTimeout(() => {
                  if (clickedButton && document.activeElement === clickedButton) {
                    clickedButton.blur();
                  }
                }, 100);
              }
            } catch (error) {
              // Silently fail - focus return is not critical
            }
          }
        }, 50);
        
        // Second attempt - after longer delay (if first didn't work)
        setTimeout(() => {
          if (this.isDesktop && clickedButton) {
            try {
              if (document.hasFocus() && document.activeElement !== clickedButton) {
                clickedButton.focus();
                
                // Blur after focus to return to normal state
                setTimeout(() => {
                  if (clickedButton && document.activeElement === clickedButton) {
                    clickedButton.blur();
                  }
                }, 100);
              }
            } catch (error) {
              // Silently fail on second attempt
            }
          }
        }, 200);
      });
      
      // Also handle window blur/focus events to return focus when user returns to window
      this.setupWindowFocusHandler(clickedButton);
    }
  }

  /**
   * Setup window focus handler to return focus when user returns to window
   * @param {HTMLElement} button - Button to return focus to
   * @private
   */
  setupWindowFocusHandler(button) {
    // Only set up handler once
    if (!this.windowFocusHandler) {
      this.windowFocusHandler = () => {
        // When window regains focus and we're on desktop, return focus to last clicked button
        if (this.isDesktop && this.lastClickedButton && document.hasFocus()) {
          requestAnimationFrame(() => {
            try {
              this.lastClickedButton.focus();
              
              // Blur after focus to return button to normal state
              setTimeout(() => {
                if (this.lastClickedButton && document.activeElement === this.lastClickedButton) {
                  this.lastClickedButton.blur();
                }
              }, 100);
            } catch (error) {
              // Silently fail
            }
          });
        }
      };
      
      window.addEventListener('focus', this.windowFocusHandler);
    }
    
    // Clear the stored button after a delay to prevent stale references
    // This ensures focus return only happens within a reasonable time window
    setTimeout(() => {
      if (this.lastClickedButton === button) {
        this.lastClickedButton = null;
      }
    }, 5000);
  }

  /**
   * Initialize QR button with focus return on desktop
   * @private
   */
  initializeQRButton() {
    this.qrButton = document.querySelector('.qr-button');
    
    if (this.qrButton) {
      // QR button is handled by QRModal component
      // We just need to ensure focus return works on desktop
      // The QRModal already handles focus return when closing
    }
  }

  /**
   * Check if current screen is desktop (>768px)
   * @returns {boolean} - True if desktop screen
   */
  isDesktopScreen() {
    return this.isDesktop;
  }

  /**
   * Get all social buttons
   * @returns {HTMLElement[]} - Array of social button elements
   */
  getSocialButtons() {
    return this.socialButtons;
  }

  /**
   * Get QR button element
   * @returns {HTMLElement|null} - QR button element
   */
  getQRButton() {
    return this.qrButton;
  }

  /**
   * Destroy component and clean up
   */
  destroy() {
    // Remove media query listener
    if (this.desktopMediaQuery && this.desktopMediaQuery.removeEventListener && this.handleDesktopMediaChange) {
      this.desktopMediaQuery.removeEventListener('change', this.handleDesktopMediaChange);
    }

    // Remove social button click handlers
    this.socialButtonHandlers.forEach(({ button, handler }) => {
      try {
        button.removeEventListener('click', handler);
      } catch {
        // No-op: safe cleanup
      }
    });
    
    // Remove window focus handler
    if (this.windowFocusHandler) {
      window.removeEventListener('focus', this.windowFocusHandler);
      this.windowFocusHandler = null;
    }
    
    // Clear references
    this.socialButtons = [];
    this.socialButtonHandlers = [];
    this.qrButton = null;
    this.isDesktop = false;
    this.desktopMediaQuery = null;
    this.lastClickedButton = null;
    this.handleDesktopMediaChange = null;
  }
}

