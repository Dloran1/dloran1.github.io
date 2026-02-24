# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VPN World is a multilingual VPN affiliate content site — 411 pre-generated static HTML files, deployed to GitHub Pages at `dloran1.github.io`. There is no build step, no framework, and no package manager.

## Deployment

```bash
git add .
git commit -m "..."
git push origin main
```

GitHub Actions (`.github/workflows/pages.yml`) auto-deploys the entire repo root to GitHub Pages on every push to `main`.

## Architecture

### No Build System
All HTML is hand-authored and pre-generated. There are no templates, markdown pipelines, or SSG involved. The `/docs/` and `/posts/` markdown files are reference/draft content only — they are not processed or published.

### Multilingual Structure
Seven locales, each with an identical page structure:

| Directory | Locale |
|-----------|--------|
| `/` | Polish (default) |
| `/en-gb/` | English (UK) |
| `/en-us/` | English (US) |
| `/de/` | German |
| `/es/` | Spanish |
| `/fr/` | French |
| `/nl-be/` | Dutch (Belgian) |

Each locale has:
- `index.html` — homepage
- `blog/` — ~54–55 blog post HTML files

Root-level utility pages: `privacy.html`, `disclosure.html`, `knowledge-base.html`, `about-denys-shchur.html`

### Shared Assets
- `assets/css/style.css` — single stylesheet, dark theme, CSS custom properties, no preprocessor
- `assets/js/cookie-consent.js` — GA4 Consent Mode v2 integration, cookie banner with accept/reject, locale-aware i18n strings keyed off `<html lang>`
- `assets/js/main.js` — minimal stub
- `assets/img/hero/` — full-res WebP hero images (~2.4 MB each)
- `assets/img/thumbs/` — blog thumbnail WebPs

### SEO / Metadata Pattern (on every page)
Each HTML file includes:
- `<link rel="canonical">` per locale
- Full `hreflang` cluster (7 locales + `x-default`) pointing to all alternate versions
- Open Graph + Twitter Card tags
- JSON-LD: `Organization`, `WebSite`, and `BreadcrumbList` schemas
- GA4 tag (`G-RD6M691ZWD`) loaded via `cookie-consent.js`

### Affiliate Links
NordVPN and Surfshark CTA links use UTM parameters:
```
?utm_source=vpw&utm_medium=affiliate&utm_campaign=2025
```

## Key Conventions

- When adding or editing a page in one locale, the corresponding pages in all other locales typically need matching updates (hreflang clusters, navigation links, sitemap entries).
- `sitemap.xml` contains `<xhtml:link>` alternates for every URL — update it when adding/removing pages.
- `rss.xml` covers the Polish (root) blog feed — update when adding Polish posts.
- Language detection in `cookie-consent.js` reads `document.documentElement.lang` to select i18n strings — keep `<html lang="...">` accurate per locale.
