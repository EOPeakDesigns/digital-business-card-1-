## Audit Summary

- **Project:** Digital Business Card (design7/v0)
- **Date:** 2026-05-27
- **Overall:** **Ready for deployment testing** (HTTPS on Vercel). Optional owner content: enable showcase video URL in `data/card.json`.

---

## Passed (no change / already OK)

| Area | Status | Notes |
|------|--------|-------|
| Profile image + dimensions | ✅ | WebP, width/height, fallback chain via `card.json` |
| Social links + `rel="noopener"` | ✅ | Rendered from JSON |
| QR modal centered + download | ✅ | Uses `MYQR.png`, download works |
| Responsive breakpoints | ✅ | Existing mobile-first CSS retained |
| Favicon / PWA icons | ✅ | 16/32/180/192/512 + SVG |
| Copy visual feedback (icon pulse) | ✅ | Retained + screen reader + toast |
| Reduced motion (base) | ✅ | Extended in `base.css` |
| Component architecture | ✅ | ES modules, handlers split |
| Vercel build (`public/`) | ✅ | Build copies `data/`, `sw.js`, handlers |

---

## Fixed in this pass

| Area | Status | Notes |
|------|--------|-------|
| Single source of truth | ✅ | `data/card.json` drives UI, meta, labels |
| `tel:` / `mailto:` / website | ✅ | Phone uses `tel:`; email uses `mailto:`; WhatsApp separate row |
| vCard download | ✅ | Save contact button → `.vcf` blob |
| Share card | ✅ | Web Share API + clipboard fallback |
| Clipboard a11y | ✅ | `aria-live` toast + `announceToScreenReader` |
| QR modal a11y | ✅ | `aria-modal`, focus trap, Escape, blur trigger |
| Skip link | ✅ | `#main-content`, focus-visible |
| PWA service worker | ✅ | `sw.js` shell cache `dbc-shell-v2` |
| Install banner | ✅ | Dismiss persists in `localStorage` |
| EN / AR i18n | ✅ | `dir`/`lang`, labels from JSON |
| Dark / light / system theme | ✅ | Theme button + `theme-color` meta |
| SEO / sharing meta | ✅ | OG/Twitter/canonical updated from JSON |
| Safe area + `100dvh` | ✅ | Viewport + body padding |
| Utility bar | ✅ | Save contact + Share |
| Manifest shortcuts | ✅ | Call / Email / Website query handlers |
| Focus-visible | ✅ | Restored on key controls (was disabled on links) |

---

## Partial / owner follow-ups

| Area | Status | Notes |
|------|--------|-------|
| Owner showcase video | ⚠️ | Infrastructure ready; set `featureVideo.enabled: true` + `embedUrl` in `data/card.json` |
| Address / maps row | ⚠️ | Renders only if `contact.address.display` + `mapsUrl` filled |
| Lighthouse 90+ | ⚠️ | Run on deployed HTTPS URL; Font Awesome CDN is main external cost |
| `og:image` absolute URL | ⚠️ | Uses `meta.canonicalHost` when set; auto on live Vercel domain via `getDeployedUrl()` |

---

## Owner follow-ups

1. **Deploy over HTTPS** (Vercel) so PWA install, clipboard, and service worker work reliably.
2. **Set real domain** in `data/card.json` → `meta.canonicalHost` (e.g. your Vercel URL).
3. **Optional video:** In `data/card.json`, set:
   ```json
   "featureVideo": {
     "enabled": true,
     "type": "embed",
     "embedUrl": "https://www.youtube.com/embed/YOUR_ID"
   }
   ```
4. **Optional address:** Add `contact.address.display` and `contact.address.mapsUrl`.
5. **After deploy:** Test on iPhone Safari + Android Chrome — call, email, copy, QR, install dismiss, offline reload.
6. **Bump cache** when you change shell files: edit `CACHE_NAME` in `sw.js`.

---

## Files touched

- `data/card.json` (new)
- `index.html`
- `sw.js` (new)
- `assets/site.webmanifest`
- `styles/main.css`, `styles/base.css`, `styles/utilities.css` (new)
- `scripts/app.js`
- `scripts/build.cjs`
- `scripts/handlers/` — `renderCard.js`, `vcard.js`, `share.js`, `pwa.js`, `theme.js`, `i18n.js`
- `scripts/utils/` — `cardData.js`, `deploy.js`, `modal.js`, `accessibility.js`
- `scripts/components/` — `QRModal.js`, `ContactItem.js`, `ProfileCard.js`, `Toast.js`, `VideoModal.js` (new)

---

## Deployment (Vercel)

- **Build command:** `npm run build`
- **Output directory:** `public`
- Push to GitHub → redeploy.
