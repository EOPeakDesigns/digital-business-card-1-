/**
 * Render card UI from card.json (single source of truth).
 */

import { getCardData, getBio, t, getLocale } from '../utils/cardData.js';
import { absoluteUrl, getDeployedUrl } from '../utils/deploy.js';
import { isFeatureVideoEnabled } from '../utils/video.js';

/**
 * Escape HTML for text nodes.
 * @param {string} str
 */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * @param {object} opts
 * @returns {string}
 */
function contactRow({ icon, href, label, text, copyLabel, copyValue, external, textDir }) {
  const copyBtn = copyValue
    ? `<button class="contact-item__copy-btn" type="button" aria-label="${esc(copyLabel)}" data-copy="${esc(copyValue)}">
        <i class="fa-solid fa-copy" aria-hidden="true"></i>
      </button>`
    : '';

  const rel = external ? ' rel="noopener noreferrer" target="_blank"' : '';
  const ext = external ? ' external' : '';

  return `
    <li class="contact-item" role="listitem">
      <div class="contact-item__icon-container" aria-hidden="true">
        <i class="${icon} contact-item__icon"></i>
      </div>
      <a href="${esc(href)}" class="contact-link${ext}" aria-label="${esc(label)}"${rel}>
        <span class="contact-item__text"${textDir ? ` dir="${textDir}"` : ''}>${esc(text)}</span>
      </a>
      ${copyBtn}
    </li>`;
}

/**
 * Update document meta for SEO / sharing.
 */
export function updateMeta() {
  const data = getCardData();
  const { person, meta } = data;
  const title = `${person.name} | ${person.title}`;
  const description = getBio().slice(0, 160);
  const url = meta.canonicalHost || getDeployedUrl() || '';
  const ogImage = absoluteUrl(meta.ogImage || 'assets/owner.webp');
  const ogAbs = ogImage.startsWith('http') ? ogImage : (meta.canonicalHost ? `${meta.canonicalHost.replace(/\/$/, '')}/${meta.ogImage}` : ogImage);

  document.title = title;

  const setMeta = (selector, content) => {
    const el = document.querySelector(selector);
    if (el) {
      el.setAttribute('content', content);
    }
  };

  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[property="og:image"]', ogAbs);
  setMeta('meta[name="twitter:image"]', ogAbs);

  if (url) {
    setMeta('meta[property="og:url"]', url);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }
}

/**
 * Render main card content into the DOM.
 */
export async function renderCard() {
  const data = getCardData();
  const { person, contact, socials } = data;
  const locale = getLocale();
  const isAr = locale === 'ar';
  const personName = isAr && person.nameDisplayAr ? person.nameDisplayAr : (person.nameDisplay || person.name);
  const personTitle = isAr && person.titleAr ? person.titleAr : person.title;
  const personEyebrow = isAr && person.eyebrowAr ? person.eyebrowAr : person.eyebrow;
  const ltr = 'ltr';
  const root = document.getElementById('card-root');
  if (!root) {
    return;
  }

  const avatarSrc = person.avatar?.[0] || 'assets/owner.webp';
  const videoEnabled = isFeatureVideoEnabled(data.featureVideo);

  const avatarInner = videoEnabled
    ? `<button type="button" class="profile__avatar-btn profile__avatar-btn--video" id="avatar-video-trigger" aria-label="${esc(t('playOnAvatar'))}">
        <img src="${esc(avatarSrc)}" alt="" class="profile__image" width="90" height="90" loading="eager" decoding="async" data-avatar>
        <span class="profile__play-overlay" aria-hidden="true">
          <span class="profile__play-icon"><i class="fa-solid fa-play"></i></span>
        </span>
      </button>`
    : `<img src="${esc(avatarSrc)}" alt="${esc(`Profile picture of ${person.name}, ${person.title}`)}"
        class="profile__image" width="90" height="90" loading="eager" decoding="async" data-avatar>`;

  const avatarHtml = `<div class="profile__media">${avatarInner}</div>`;

  const contactRows = [];

  if (contact.phone?.tel) {
    contactRows.push(
      contactRow({
        icon: 'fa-solid fa-phone',
        href: `tel:${contact.phone.tel.replace(/\s/g, '')}`,
        label: `${t('phoneLabel')} ${contact.phone.display}`,
        text: contact.phone.display,
        copyLabel: t('copyPhone'),
        copyValue: contact.phone.display,
        textDir: ltr
      })
    );
  }

  if (contact.whatsapp?.number) {
    contactRows.push(
      contactRow({
        icon: 'fa-brands fa-whatsapp',
        href: `https://wa.me/${contact.whatsapp.number}`,
        label: `${t('whatsappLabel')} ${contact.whatsapp.display}`,
        text: contact.whatsapp.display,
        copyLabel: t('copyPhone'),
        copyValue: contact.whatsapp.display,
        external: true,
        textDir: ltr
      })
    );
  }

  if (contact.email) {
    contactRows.push(
      contactRow({
        icon: 'fa-solid fa-envelope',
        href: `mailto:${contact.email}`,
        label: `${t('emailLabel')} ${contact.email}`,
        text: contact.email,
        copyLabel: t('copyEmail'),
        copyValue: contact.email,
        textDir: ltr
      })
    );
  }

  if (contact.website?.url) {
    contactRows.push(
      contactRow({
        icon: 'fa-solid fa-globe',
        href: contact.website.url,
        label: `${t('websiteLabel')} ${contact.website.display}`,
        text: contact.website.display,
        external: true,
        textDir: ltr
      })
    );
  }

  if (contact.address?.mapsUrl && contact.address?.display) {
    contactRows.push(
      contactRow({
        icon: 'fa-solid fa-location-dot',
        href: contact.address.mapsUrl,
        label: `${t('addressLabel')} ${contact.address.display}`,
        text: contact.address.display,
        external: true
      })
    );
  }

  const socialHtml = (socials || [])
    .map(
      (s) => `
      <a href="${esc(s.url)}" class="social-button" aria-label="${esc(t(s.labelKey))}"
         target="_blank" rel="noopener noreferrer">
        <i class="${esc(s.icon)}" aria-hidden="true"></i>
      </a>`
    )
    .join('');

  root.innerHTML = `
    <div class="card__content">
      <p class="profile__eyebrow">${esc(personEyebrow || '')}</p>
      <header class="profile" role="banner">
        <div class="profile__info">
          <h1 class="profile__name">${esc(personName)}</h1>
          <p class="profile__title">${esc(personTitle)}</p>
        </div>
        ${avatarHtml}
      </header>

      <div class="utility-bar" role="group" aria-label="Card actions">
        <button type="button" class="utility-bar__btn utility-bar__btn--icon" id="btn-save-contact" aria-label="${esc(t('saveContact'))}">
          <i class="fa-solid fa-address-card" aria-hidden="true"></i>
        </button>
        <button type="button" class="utility-bar__btn utility-bar__btn--icon" id="btn-share-card" aria-label="${esc(t('shareCard'))}">
          <i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
        </button>
        <button type="button" class="utility-bar__btn utility-bar__btn--lang" id="btn-lang" aria-label="${esc(t('langToggle'))}">
          <span class="lang-switch" aria-hidden="true">
            <span class="lang-switch__opt${locale === 'en' ? ' is-active' : ''}" data-lang="en">EN</span>
            <span class="lang-switch__opt lang-switch__opt--ar${locale === 'ar' ? ' is-active' : ''}" data-lang="ar">عربي</span>
          </span>
        </button>
      </div>

      <section aria-labelledby="about-heading">
        <h2 id="about-heading" class="section-header">${esc(t('aboutHeading'))}</h2>
        <p class="about-content">${esc(getBio())}</p>
      </section>

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading" class="section-header">${esc(t('contactHeading'))}</h2>
        <ul class="contact-list" role="list">
          ${contactRows.join('')}
        </ul>
      </section>

      <footer class="footer" role="contentinfo">
        <div class="social-buttons">
          ${socialHtml}
          <button class="social-button qr-button" type="button" aria-label="${esc(t('viewQr'))}">
            <i class="fa-solid fa-qrcode" aria-hidden="true"></i>
          </button>
        </div>
      </footer>
    </div>`;

  const qrImg = document.querySelector('.qr-code-image');
  if (qrImg && person.qrImage) {
    qrImg.src = person.qrImage;
    qrImg.alt = t('qrAlt');
  }

  const qrTitle = document.getElementById('qr-modal-title');
  if (qrTitle) {
    qrTitle.textContent = t('qrTitle');
  }

  const qrDownload = document.querySelector('.qr-download-btn');
  if (qrDownload) {
    const label = qrDownload.querySelector('span') || qrDownload;
    if (label.tagName === 'SPAN') {
      label.textContent = t('qrDownload');
    } else {
      qrDownload.innerHTML = `<i class="fa-solid fa-download" aria-hidden="true"></i> ${esc(t('qrDownload'))}`;
    }
    qrDownload.setAttribute('aria-label', t('qrDownload'));
  }

  const closeQr = document.querySelector('.modal__close');
  if (closeQr) {
    closeQr.setAttribute('aria-label', t('qrClose'));
  }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });

  setupAvatarFallback();
}

/**
 * Avatar src fallback chain.
 */
function setupAvatarFallback() {
  const data = getCardData();
  const candidates = data.person.avatar || ['assets/owner.webp'];
  const img = document.querySelector('[data-avatar]');
  if (!img) {
    return;
  }

  let index = 0;
  img.onerror = () => {
    index += 1;
    if (index < candidates.length) {
      img.src = candidates[index];
    }
  };
}
