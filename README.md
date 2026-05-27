# Digital Business Card — Freelancer Showcase

A production-ready, mobile-first digital business card built with vanilla HTML, CSS, and JavaScript. Designed as a portfolio piece and client deliverable: fast to load, polished on smartphones, bilingual (EN/AR), and deployable to Vercel in minutes.

> **Portfolio blurb (149 chars):** see [`SHOWCASE_DESCRIPTION.md`](SHOWCASE_DESCRIPTION.md)

---

## Live demo

Replace with your deployed URL after publishing:

`https://digital-business-card-1-phi.vercel.app/`

---

## Why this project stands out

| Area | What you get |
|------|----------------|
| **Mobile UX** | Touch-friendly controls, safe-area padding, `100dvh` layout, breakpoints from 320px up |
| **Conversion** | One-tap call, WhatsApp, email, website, copy phone/email, vCard download, Web Share |
| **Trust** | QR modal + download, owner showcase video, semantic HTML, ARIA labels, focus management |
| **Global reach** | English / Arabic with RTL layout polish and Noto Sans Arabic |
| **Platform-ready** | PWA manifest, install banner, service worker offline shell, full favicon set |
| **Maintainability** | Single source of truth in `data/card.json` — no scattered HTML edits |

---

## Feature checklist

- Profile header with optional avatar video trigger (embed or local MP4)
- About + contact sections rendered from JSON
- Social links + QR code modal (view & download)
- Utility actions: **Save contact (vCard)**, **Share card**, **EN / عربي** language toggle
- Toast feedback for copy/share actions
- SEO meta tags updated at runtime from `card.json`
- Service worker cache for repeat visits and flaky networks
- Lint pipeline (ESLint + Stylelint) and Vercel build script

---

## Tech stack

- **HTML5** — semantic structure, skip link, dialog modals
- **CSS3** — design tokens, BEM components, RTL stylesheet, reduced-motion support
- **Vanilla JS (ES modules)** — no framework dependency
- **Font Awesome 6** — icons (CDN)
- **Google Fonts** — Noto Sans Arabic
- **Node.js (dev only)** — build, favicon generation, lint

---

## Project structure

```
├── index.html              # App shell + modals
├── data/card.json          # Content, links, labels (EN/AR), video config
├── sw.js                   # Service worker (offline shell)
├── vercel.json             # Deploy settings + security headers
├── styles/
│   ├── main.css            # Imports all stylesheets
│   ├── variables.css       # Design tokens
│   ├── base.css            # Reset, layout, touch polish
│   ├── components.css      # Card, profile, contact, modals
│   ├── utilities.css       # Utility bar, toast, video modal
│   └── rtl.css             # Arabic RTL overrides
├── scripts/
│   ├── app.js              # Bootstrap
│   ├── build.cjs           # Copies site → public/
│   ├── components/         # QRModal, VideoModal, Toast, etc.
│   ├── handlers/           # render, vCard, share, PWA, i18n
│   └── utils/              # cardData, modal, video, clipboard
└── assets/                 # Images, favicons, manifest, QR
```

---

## Quick start (local)

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`. For a static server without live reload:

```bash
npm run start
```

---

## Customize for a client (or your portfolio)

Edit **`data/card.json`** only for most changes:

| Section | Purpose |
|---------|---------|
| `person` | Name, title, bio, avatar, QR image |
| `contact` | Phone, WhatsApp, email, website |
| `socials` | Social profile URLs |
| `featureVideo` | Owner intro video (`embedUrl` or `localSrc`) |
| `labels.en` / `labels.ar` | All UI strings |
| `meta.canonicalHost` | Production URL for SEO / sharing |

Replace assets:

- `assets/owner.webp` — profile photo
- `assets/MYQR.png` — QR code
- `assets/bacground.png` — card background
- `assets/favicon.svg` — brand icon (run `npm run favicons` to regenerate PNGs)

Brand colors: `styles/variables.css`

---

## Deploy to Vercel (recommended)

1. Push the project to GitHub (exclude `node_modules/` and `public/` — both are gitignored).
2. Import the repo in [Vercel](https://vercel.com).
3. Settings are preconfigured in `vercel.json`:
   - **Build command:** `npm run build`
   - **Output directory:** `public`
4. Deploy. Update `meta.canonicalHost` in `card.json` to your live domain.

### What to commit

```
index.html, sw.js, vercel.json, package.json, package-lock.json
data/, styles/, scripts/, assets/
.eslintrc.cjs, .stylelintrc.json, .gitignore
README.md, SHOWCASE_DESCRIPTION.md
```

Do **not** commit `node_modules/` or `public/` (Vercel builds `public/` on each deploy).

---

## Quality commands

```bash
npm run lint      # CSS + JS lint
npm run build     # Output production site to public/
npm run favicons  # Regenerate PNG/ICO from assets/favicon.svg
```

---

## Smartphone readiness

Verified patterns in this build:

- `viewport-fit=cover` + `env(safe-area-inset-*)` padding (notch / home indicator)
- Minimum 44px touch targets on primary actions
- `touch-action: manipulation` and tuned tap highlight
- Responsive grid from 320px (small Android) through large desktop
- PWA: add to home screen on iOS/Android with themed splash colors
- Offline: cached shell via service worker after first load

**Pre-launch phone test (5 min):**

1. Tap Save contact → vCard downloads / opens Contacts
2. Tap Share → native share sheet or clipboard fallback
3. Switch EN ↔ AR → layout mirrors correctly
4. Open QR modal → download works
5. Tap avatar play chip (if video enabled) → modal opens/closes without background audio
6. Add to Home Screen → icon and standalone mode look correct

---

## Browser support

Modern evergreen browsers:

- Chrome / Edge (Android & desktop)
- Safari / iOS Safari
- Firefox

Clipboard and Web Share use progressive enhancement with fallbacks.

---

## License

MIT — suitable for open-source portfolio use. Client deliverables may use separate commercial terms.

---

## Author

Built as a freelancer portfolio showcase — premium static web card engineering with deployment, accessibility, and bilingual UX baked in.
