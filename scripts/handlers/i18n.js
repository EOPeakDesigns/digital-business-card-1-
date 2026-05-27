/**
 * Language toggle (EN / AR).
 */

import { getLocale, setLocale } from '../utils/cardData.js';

/**
 * Toggle locale and notify app to re-render.
 */
export function toggleLocale() {
  const next = getLocale() === 'en' ? 'ar' : 'en';
  setLocale(next);
  document.dispatchEvent(new CustomEvent('dbc:localechange', { detail: { locale: next } }));
}

