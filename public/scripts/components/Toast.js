/**
 * Toast notifications
 */

let timeoutId = null;

/**
 * @param {string} message
 * @param {number} duration
 */
export function showToast(message, duration = 2500) {
  const el = document.getElementById('toast');
  if (!el) {
    return;
  }

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  el.textContent = message;
  el.classList.add('toast--show');

  timeoutId = setTimeout(() => {
    el.classList.remove('toast--show');
    timeoutId = null;
  }, duration);
}
