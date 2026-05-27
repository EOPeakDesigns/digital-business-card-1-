/**
 * Profile Card Component — wires contact rows after render.
 */

import { ContactItem } from './ContactItem.js';

export class ProfileCard {
  constructor() {
    this.contactItems = [];
  }

  /**
   * Re-bind contact items after DOM render.
   */
  reinit() {
    this.contactItems = [];
    const contactItemElements = document.querySelectorAll('.contact-item');
    contactItemElements.forEach((element) => {
      this.contactItems.push(new ContactItem(element));
    });
  }

  getContactItems() {
    return this.contactItems;
  }

  destroy() {
    this.contactItems = [];
  }
}
