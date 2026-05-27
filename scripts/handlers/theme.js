/**
 * Theme: system / light / dark with persisted preference.
 */

const THEME_KEY = 'dbc_theme';

/**
 * @returns {'system'|'light'|'dark'}
 */
export function getStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

/**
 * @param {'system'|'light'|'dark'} mode
 */
export function setTheme(mode) {
  localStorage.setItem(THEME_KEY, mode);
  applyTheme(mode);
}

/**
 * @param {'system'|'light'|'dark'} mode
 */
export function applyTheme(mode) {
  const root = document.documentElement;
  root.dataset.themeMode = mode;

  if (mode === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = mode;
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const dark = root.dataset.theme === 'dark' ||
      (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    meta.setAttribute('content', dark ? '#0f172a' : '#F4A32D');
  }
}

/**
 * Cycle system → light → dark → system
 */
export function cycleTheme() {
  const order = ['system', 'light', 'dark'];
  const current = getStoredTheme();
  const next = order[(order.indexOf(current) + 1) % order.length];
  setTheme(next);
  return next;
}

/**
 * Initialize theme + media listener.
 */
export function initTheme() {
  applyTheme(getStoredTheme());

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system');
    }
  });
}
