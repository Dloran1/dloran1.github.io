# VPN World — STRUCTURE INDEX (SOURCE OF TRUTH)
# This file defines the exact structure of the VPN World repository.
# Claude MUST read this file before creating or modifying any article.

LAST UPDATED: 2026-02-25
AUTHORITY: ABSOLUTE
PRIORITY: CRITICAL

---

# ROOT STRUCTURE

/
├── index.html
├── knowledge-base.html
├── about-denys-shchur.html
├── privacy.html
├── disclosure.html
├── CLAUDE.md
│
├── blog/                     ← POLISH ROOT LOCALE (pl)
│   ├── article-slug.html
│   └── ...
│
├── en-gb/blog/              ← ENGLISH UK
│   ├── article-slug.html
│   └── ...
│
├── en-us/blog/              ← ENGLISH US
│   ├── article-slug.html
│   └── ...
│
├── de/blog/                 ← GERMAN
│   ├── article-slug.html
│   └── ...
│
├── es/blog/                 ← SPANISH
│   ├── article-slug.html
│   └── ...
│
├── fr/blog/                 ← FRENCH
│   ├── article-slug.html
│   └── ...
│
├── nl-be/blog/              ← DUTCH BELGIUM
│   ├── article-slug.html
│   └── ...
│
├── assets/
│   ├── css/style.css
│   ├── js/cookie-consent.js
│   ├── img/hero/
│   └── img/author/
│
├── _standards/
│   ├── CLAUDE_BOOT.md
│   ├── VPNW_STAGE25_STANDARD.md
│   ├── VPNW_LOCALIZATION_STANDARD.md
│   └── SLUG_INDEX_FROM_HREFLANG_FLAT.json
│
└── standards/
    └── STRUCTURE_INDEX.md   ← THIS FILE (YOU ARE HERE)

---

# LOCALE RULES (CRITICAL)

POLISH IS ROOT LOCALE:

Polish article path:
    /blog/article-slug.html

Other locales MUST use subfolder:

    /en-gb/blog/article-slug.html
    /en-us/blog/article-slug.html
    /de/blog/article-slug.html
    /es/blog/article-slug.html
    /fr/blog/article-slug.html
    /nl-be/blog/article-slug.html

NEVER invent new folder structure.

---

# HREFLANG AND SWITCHER RULE

Every article already contains:

• hreflang block
• language switcher

Claude MUST:

DO NOT regenerate hreflang  
DO NOT modify hreflang  
DO NOT search for hreflang  
DO NOT rebuild language switcher  

Preserve existing block EXACTLY.

---

# SLUG RESOLUTION RULE

Slug relationships are defined ONLY in:

    /_standards/SLUG_INDEX_FROM_HREFLANG_FLAT.json

Claude MUST use this file.

DO NOT scan entire repository to find slug relationships.

DO NOT guess slug names.

---

# AUTHOR PAGE PATHS

ROOT:
    /about-denys-shchur.html

LOCALIZED:
    /en-gb/about-denys-shchur.html
    /en-us/about-denys-shchur.html
    /de/about-denys-shchur.html
    /es/about-denys-shchur.html
    /fr/about-denys-shchur.html
    /nl-be/about-denys-shchur.html

---

# HERO IMAGE PATH RULE

Hero images always use:

    /assets/img/hero/article-topic-uk.webp

Suffix "-uk.webp" is used for ALL locales.

Never invent image names.

---

# CTA RULE

CTA buttons appear EXACTLY twice:

1. After introduction
2. Before conclusion

Structure must be:

<div class="cta-buttons">
  NordVPN
  Surfshark
  ProtonVPN
</div>

Never add more.
Never remove.

---

# WIDGET RULE

Widgets must be placed AFTER Quick Answer section and BEFORE first H2.

Never place widget above H1.

---

# FINAL ABSOLUTE RULE

Claude MUST trust:

1. CLAUDE_BOOT.md
2. VPNW_STAGE25_STANDARD.md
3. VPNW_LOCALIZATION_STANDARD.md
4. SLUG_INDEX_FROM_HREFLANG_FLAT.json
5. STRUCTURE_INDEX.md

These files override Claude training.

Claude MUST NOT guess structure.
Claude MUST read these files first.

END OF STRUCTURE INDEX