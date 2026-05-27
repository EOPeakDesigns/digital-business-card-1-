/**
 * Clipboard Utility
 * Handles copy-to-clipboard functionality with error handling
 * 
 * @author Senior Web Developer
 * @version 1.0.0
 */

/**
 * Copies text to clipboard using modern Clipboard API
 * @param {string} text - Text to copy to clipboard
 * @returns {Promise<boolean>} - Success status
 */
export async function copyToClipboard(text) {
  try {
    // Use modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      return fallbackCopyToClipboard(text);
    }
  } catch (error) {
    console.error('Clipboard API failed:', error);
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback method for copying text to clipboard
 * @param {string} text - Text to copy
 * @returns {boolean} - Success status
 */
function fallbackCopyToClipboard(text) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.error('Fallback copy failed:', error);
    return false;
  }
}

/**
 * Determines if text is a phone number
 * @param {string} text - Text to check
 * @returns {boolean} - True if phone number
 */
export function isPhoneNumber(text) {
  return text.includes('+') || /^\d/.test(text.trim());
}
