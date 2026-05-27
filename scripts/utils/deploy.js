/**
 * Deployment URL helpers for share, canonical, and OG meta.
 */

/**
 * @returns {string} Origin for the current deployment (no trailing slash)
 */
export function getDeployedUrl() {
  const { origin, pathname } = window.location;
  if (origin && origin !== 'null' && !origin.startsWith('file:')) {
    const base = pathname.endsWith('/') ? pathname : pathname.replace(/\/[^/]*$/, '/');
    return `${origin}${base === '/' ? '' : base}`.replace(/\/$/, '') || origin;
  }
  return '';
}

/**
 * @param {string} path
 * @returns {string}
 */
export function absoluteUrl(path) {
  const deployed = getDeployedUrl();
  const clean = path.replace(/^\//, '');
  if (deployed) {
    return `${deployed}/${clean}`;
  }
  return path;
}

/**
 * @param {string} tel - E.164 or digits with optional +
 * @returns {string}
 */
export function sanitizeTel(tel) {
  const digits = String(tel).replace(/[^\d+]/g, '');
  return digits.startsWith('+') ? digits : `+${digits.replace(/^\+/, '')}`;
}
