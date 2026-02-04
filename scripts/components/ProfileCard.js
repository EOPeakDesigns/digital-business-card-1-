/**
 * Profile Card Component
 * Main container component that manages all sub-components
 * 
 * @author Senior Web Developer
 * @version 1.0.0
 */

import { ContactItem } from './ContactItem.js';

export class ProfileCard {
  constructor() {
    this.element = null;
    this.contactItems = [];
    this.init();
  }

  /**
   * Initialize the profile card and all its components
   * @private
   */
  init() {
    this.element = document.querySelector('.card');
    this.initializeContactItems();
    this.setupAccessibility();
  }

  /**
   * Initialize all contact item components
   * @private
   */
  initializeContactItems() {
    const contactItemElements = document.querySelectorAll('.contact-item');
    
    contactItemElements.forEach(element => {
      const contactItem = new ContactItem(element);
      this.contactItems.push(contactItem);
    });
  }

  /**
   * Setup accessibility features
   * @private
   */
  setupAccessibility() {
    // Correctness: ensure we have a stable root element reference.
    // Avoid forcing tabindex on native focusables (can harm UX/accessibility).
    if (!this.element) return;
  }

  /**
   * Get all contact items
   * @returns {ContactItem[]} - Array of contact item instances
   */
  getContactItems() {
    return this.contactItems;
  }


  /**
   * Destroy component and clean up event listeners
   */
  destroy() {
    this.contactItems = [];
  }
}
