/**
 * vCard (.vcf) generation and download.
 */

import { getCardData, t } from '../utils/cardData.js';
import { announceToScreenReader } from '../utils/accessibility.js';

/**
 * @returns {string}
 */
function buildVCard() {
  const data = getCardData();
  const { person, contact } = data;
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${person.name}`,
    `N:${person.name};;;;`,
    person.title ? `TITLE:${person.title}` : null,
    person.org ? `ORG:${person.org}` : null,
    contact.phone?.tel ? `TEL;TYPE=CELL:${contact.phone.tel}` : null,
    contact.email ? `EMAIL;TYPE=INTERNET:${contact.email}` : null,
    contact.website?.url ? `URL:${contact.website.url}` : null,
    contact.address?.display ? `ADR;TYPE=WORK:;;${contact.address.display};;;;` : null,
    'END:VCARD'
  ].filter(Boolean);

  return `${lines.join('\r\n')}\r\n`;
}

/**
 * Download vCard for mobile/desktop browsers.
 */
export function downloadVCard() {
  const data = getCardData();
  const slug = data.person.name.toLowerCase().replace(/\s+/g, '-');
  const blob = new Blob([buildVCard()], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slug}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  announceToScreenReader(t('vcardDownloading'));
}
