/**
 * Feature video helpers — embed URL normalization and availability checks.
 */

const YOUTUBE_EMBED_PARAMS = 'playsinline=1&rel=0&modestbranding=1';

/**
 * @param {string} videoId
 * @returns {string}
 */
export function buildYouTubeEmbedUrl(videoId) {
  const id = String(videoId || '').trim();
  if (!id) {
    return '';
  }
  return `https://www.youtube.com/embed/${id}?${YOUTUBE_EMBED_PARAMS}`;
}

/**
 * @param {object|undefined} featureVideo
 * @returns {boolean}
 */
export function isFeatureVideoEnabled(featureVideo) {
  if (!featureVideo?.enabled) {
    return false;
  }
  return Boolean(
    String(featureVideo.embedUrl || '').trim() ||
      String(featureVideo.localSrc || '').trim()
  );
}

/**
 * Convert common YouTube/Vimeo share URLs to embeddable iframe src.
 * @param {string} url
 * @returns {string}
 */
export function normalizeEmbedUrl(url) {
  const raw = String(url || '').trim();
  if (!raw) {
    return '';
  }

  try {
    const parsed = new URL(raw, window.location.origin);

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return id ? buildYouTubeEmbedUrl(id) : raw;
    }

    if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtube-nocookie.com')) {
      const id = parsed.searchParams.get('v');
      if (id) {
        return buildYouTubeEmbedUrl(id);
      }
      if (parsed.pathname.includes('/embed/')) {
        const embedId = parsed.pathname.split('/embed/')[1]?.split('/')[0];
        return embedId ? buildYouTubeEmbedUrl(embedId) : raw;
      }
    }

    if (parsed.hostname.includes('vimeo.com') && !parsed.hostname.includes('player.')) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      const id = parts.pop();
      return id ? `https://player.vimeo.com/video/${id}` : raw;
    }

    return raw;
  } catch {
    return raw;
  }
}
