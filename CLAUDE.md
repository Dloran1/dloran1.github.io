# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Default Operating Mode

**Analyze and report only.** Do not modify, create, or delete any files unless the user explicitly says "APPLY CHANGES". When asked to fix, improve, or update something, describe what you would do and wait for the instruction to apply it.

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
# MEMORY REFRESH PROTOCOL — STRUCTURE AWARENESS SYSTEM

Purpose:
Ensure Claude always works with the current, real project structure and never relies on stale memory.

Claude must treat the filesystem as the only source of truth.

---

# RULE 1 — PERIODIC STRUCTURE REFRESH

Claude MUST refresh its understanding of the project structure regularly.

Trigger conditions:

• At least once every 48 hours  
• At the start of any new article generation  
• At the start of any modification task  
• After any git pull, git merge, or project update  
• If ANY uncertainty exists about structure, paths, or files  

Claude must NEVER rely on old memory when filesystem is available.

Filesystem always overrides memory.

---

# RULE 2 — STRUCTURE SCAN PROCESS (MANDATORY WHEN REFRESHING)

Claude must scan these directories:

/blog/
/en-gb/blog/
/en-us/blog/
/de/blog/
/es/blog/
/fr/blog/
/nl-be/blog/

/assets/
/assets/img/
/assets/css/
/assets/js/

/about-denys-shchur.html
/privacy.html
/disclosure.html

and localized equivalents.

Claude must build a fresh internal map of:

• available articles
• slug structure
• asset paths
• author pages
• widget scripts
• standards files

---

# RULE 3 — STANDARD FILE IS PRIMARY AUTHORITY

Claude must always read and respect:

/_standards/VPNW_STAGE25_STANDARD.md

This file is the constitution.

If structure conflicts with memory → follow standard file.

---

# RULE 4 — PRE-TASK VALIDATION (MANDATORY)

Before generating or modifying any article, Claude MUST internally verify:

• slug exists
• correct locale path
• correct asset paths
• correct author path
• correct related articles availability
• correct widget compatibility

If uncertain → perform structure scan again.

Never guess.

---

# RULE 5 — NEVER CACHE STRUCTURE PERMANENTLY

Claude must treat structure memory as temporary.

Structure must be refreshed periodically.

Filesystem is always authoritative.

---

# RULE 6 — DOUBT HANDLING PROTOCOL

If Claude is unsure about:

• paths
• slugs
• assets
• linking targets
• structure rules

Claude MUST:

1. pause assumptions
2. scan filesystem
3. rebuild structure awareness
4. then proceed

Never invent.

Never assume.

---

# RULE 7 — ARTICLE GENERATION ALWAYS USES LIVE STRUCTURE

Before generating an article, Claude MUST:

• scan locale directory
• identify related articles
• identify available assets
• identify correct author page
• identify correct policy pages

Only then generate.

---

# RULE 8 — SMARTADVISORONLINE STRUCTURE REFRESH

When SmartAdvisorOnline is involved, Claude must scan:

/tools/
/data/
/status/
/blog/

and verify tool paths.

---

# RULE 9 — STRUCTURE REFRESH PRIORITY LEVEL

Structure refresh is HIGH PRIORITY.

Structure correctness overrides speed.

Correct structure is more important than fast output.

---

# FINAL PRINCIPLE

Claude must always operate using current filesystem state, not memory assumptions.

Memory is temporary.

Filesystem is truth.