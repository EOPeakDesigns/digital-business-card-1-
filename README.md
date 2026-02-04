# Digital Business Card (Client-Ready Static Web Card)

A modern, responsive digital business card built with vanilla HTML/CSS/JS. It’s designed to load fast, look premium on any screen, and give prospects instant ways to contact you, view your QR code, and share your professional presence.

## Why order this service (business value)

You’re not buying “a webpage”. You’re buying a conversion-focused micro‑product that helps you:

- **Get contacted faster**: one tap from a phone to WhatsApp/email/website.
- **Increase trust**: professional presentation, consistent branding, and clean UI.
- **Work everywhere**: mobile-first responsive layout that fits small phones through large desktops.
- **Share instantly**: QR code users can scan and open in seconds.
- **Look professional on every platform**: proper favicons + PWA icons for browsers and mobile home screens.

## What this digital business card includes (features)

### Core sections
- **Profile header**: name, title, profile image.
- **About section**: short professional summary.
- **Contact section**:
  - WhatsApp chat link
  - Email link (opens Gmail compose in a new tab)
  - Website link
  - **Copy-to-clipboard** buttons for phone and email (with visual success feedback)
- **Social links**: Facebook, Instagram, LinkedIn, X.

### QR and sharing
- **QR modal**: opens from the QR button.
- **Download QR**: downloads the QR image for printing on cards, flyers, packaging, etc.

### UX, UI and build quality
- **Mobile-first responsive design** with extensive breakpoint coverage.
- **Touch-friendly targets** (comfortably tappable controls).
- **Semantic HTML + ARIA labels** across interactive elements.
- **Reduced motion support** via `prefers-reduced-motion`.
- **Safe external links**: `rel="noopener noreferrer"` where needed.

### Brand and platform readiness
- **Full favicon set**: SVG/PNG/ICO + Apple touch icon.
- **PWA manifest** (`assets/site.webmanifest`) with Android icons (192/512).

## Optional upgrades (common client add-ons)

These are not currently included, but are common “pro” additions to digital business cards:

- **vCard (.vcf) / Add to Contacts** button
- **Standard `tel:` / `mailto:` actions** (instead of WhatsApp-only / Gmail-only)
- **Web Share button** (native share sheet on mobile)
- **Analytics** (privacy-friendly click tracking)
- **Multi-language (i18n)** versions
- **Booking link** (Calendly), address/map CTA, company logo, portfolio section
- **Hosting + custom domain + SSL** setup

## Project structure

```
├── index.html                     # Main HTML document
├── styles/
│   ├── main.css                   # Imports the stylesheets below
│   ├── variables.css              # Design tokens (CSS custom properties)
│   ├── base.css                   # Reset + base styles
│   └── components.css             # Component styling (BEM)
├── scripts/
│   ├── app.js                     # App bootstrap
│   ├── generate-favicons.cjs       # SVG → PNG icon generator
│   ├── components/
│   │   ├── ProfileCard.js
│   │   ├── ContactItem.js
│   │   ├── SocialButtons.js
│   │   ├── QRModal.js
│   │   └── Toast.js               # Available component (not wired by default)
│   └── utils/
│       ├── clipboard.js
│       ├── accessibility.js
│       └── performance.js
└── assets/
    ├── favicon.svg
    ├── favicon.ico
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    ├── site.webmanifest
    ├── owner.webp
    ├── MYQR.png
    └── bacground.png
```

## Getting started

This is a static project (no build step required).

- **Open directly**: double-click `index.html`
- **Recommended (local server)**:

```bash
npm install
npm run dev
```

Or:

```bash
npm run start
```

## Developer commands

```bash
# Regenerate favicon PNGs from assets/favicon.svg
npm run favicons

# Lint CSS + JS
npm run lint
```

## Customization guide

### Update content
- **Edit copy + links** in `index.html` (name/title/about/contact/social URLs).
- **Replace images**:
  - Profile image: `assets/owner.webp`
  - QR code image: `assets/MYQR.png`
  - Background: `assets/bacground.png`

### Update branding (colors/spacing/type)
Edit design tokens in `styles/variables.css`.

### Favicons and PWA icons
- Source of truth: `assets/favicon.svg`
- Regenerate derived PNGs: `npm run favicons`
- `index.html` and `assets/site.webmanifest` already reference the correct files.

## Browser support

Targets modern browsers. The codebase uses conservative APIs and includes clipboard fallback logic.

- Chrome / Edge: modern versions
- Firefox: modern versions
- Safari / iOS Safari: modern versions

## Security notes (static site)

This app has no backend and doesn’t render user-generated HTML, so the risk profile is low. For production hosting, add standard security headers (CSP, HSTS, etc.) at the CDN/host level.

## License

MIT is a reasonable default if you plan to open-source this project. If this is a client deliverable, license terms are typically defined in the client agreement.
