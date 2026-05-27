/**
 * Share card via Web Share API or clipboard fallback.
 */

import { getCardData, t } from '../utils/cardData.js';
import { absoluteUrl, getDeployedUrl } from '../utils/deploy.js';
import { copyToClipboard } from '../utils/clipboard.js';
import { announceToScreenReader } from '../utils/accessibility.js';

/**
 * @returns {string}
 */
function getShareUrl() {
  const deployed = getDeployedUrl();
  return deployed || window.location.href;
}

/**
 * Share digital business card.
 */
export async function shareCard() {
  const data = getCardData();
  const url = getShareUrl();
  const title = `${data.person.name} | ${data.person.title}`;
  const text = data.person.eyebrow || data.person.title;

  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return;
    }
  } catch (err) {
    if (err?.name === 'AbortError') {
      return;
    }
  }

  const copied = await copyToClipboard(url);
  announceToScreenReader(copied ? t('shareCopied') : t('shareFailed'), copied ? 'polite' : 'assertive');
}

/**
 * @returns {string}
 */
export function getOgImageUrl() {
  const data = getCardData();
  const path = data.meta?.ogImage || 'assets/owner.webp';
  const abs = absoluteUrl(path);
  if (abs.startsWith('http')) {
    return abs;
  }
  const host = data.meta?.canonicalHost?.replace(/\/$/, '');
  return host ? `${host}/${path.replace(/^\//, '')}` : path;
}
