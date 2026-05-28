/**
 * Shared modal behavior: focus trap, scroll lock, Escape, blur trigger on close.
 */

/**
 * @param {HTMLElement} modalRoot
 * @returns {() => void}
 */
export function trapFocus(modalRoot) {
  const focusableSelector =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const handleKeydown = (e) => {
    if (e.key !== 'Tab') {
      return;
    }

    const focusables = [...modalRoot.querySelectorAll(focusableSelector)].filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    );

    if (focusables.length === 0) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  modalRoot.addEventListener('keydown', handleKeydown);
  return () => modalRoot.removeEventListener('keydown', handleKeydown);
}

/**
 * Blur trigger after modal close (keyboard Escape) — avoids stuck focus ring.
 * @param {HTMLElement|null} trigger
 */
export function blurTrigger(trigger) {
  if (!trigger) {
    return;
  }
  requestAnimationFrame(() => {
    trigger.blur();
  });
}

/**
 * @param {boolean} locked
 */
export function lockBodyScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : '';
  document.body.classList.toggle('modal-open', locked);
}
