/**
 * Load and expose card.json as single source of truth.
 */

let cardCache = null;
let locale = 'en';

const LOCALE_KEY = 'dbc_locale';

/**
 * @returns {Promise<object>}
 */
export async function loadCardData() {
  if (cardCache) {
    return cardCache;
  }

  const response = await fetch('data/card.json', { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Failed to load card.json (${response.status})`);
  }

  cardCache = await response.json();
  const stored = localStorage.getItem(LOCALE_KEY);
  locale = stored || cardCache.meta?.defaultLocale || 'en';
  return cardCache;
}

/**
 * @returns {object}
 */
export function getCardData() {
  if (!cardCache) {
    throw new Error('Card data not loaded. Call loadCardData() first.');
  }
  return cardCache;
}

/**
 * @returns {string}
 */
export function getLocale() {
  return locale;
}

/**
 * @param {string} next
 */
export function setLocale(next) {
  locale = next === 'ar' ? 'ar' : 'en';
  localStorage.setItem(LOCALE_KEY, locale);
  const root = document.documentElement;
  root.lang = locale;
  root.dir = locale === 'ar' ? 'rtl' : 'ltr';
  root.classList.toggle('locale-ar', locale === 'ar');
  root.classList.toggle('locale-en', locale !== 'ar');
}

/**
 * @param {string} key
 * @returns {string}
 */
export function t(key) {
  const data = getCardData();
  const labels = data.labels?.[locale] || data.labels?.en || {};
  return labels[key] ?? data.labels?.en?.[key] ?? key;
}

/**
 * @returns {string}
 */
export function getBio() {
  const data = getCardData();
  return data.person.bio[locale] || data.person.bio.en;
}
