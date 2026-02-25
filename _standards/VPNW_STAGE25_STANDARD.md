# VPNW Stage 2.5 Standard Reference (Constitution)

> **This file is the single source of truth** for how VPN World articles are built, edited, and QA’d.
> Every change must be checked against this standard **before** delivering a final HTML file.

---

## 0) What this standard is for

VPN World is a 7‑locale GitHub Pages project. For every topic/slug we usually ship **7 localized pages**:

- **pl** (root): `/blog/<slug>.html`
- **en-gb**: `/en-gb/blog/<slug>.html`
- **en-us**: `/en-us/blog/<slug>.html`
- **de**: `/de/blog/<slug>.html`
- **es**: `/es/blog/<slug>.html`
- **fr**: `/fr/blog/<slug>.html`
- **nl-be**: `/nl-be/blog/<slug>.html`

**Hard rule:** if you don’t know a path **exactly**, you must **scan the repo** and confirm the real file before proceeding.
No “best guess” URLs. No invented slugs. No fake paths.

---

## 1) HARD RULES (non‑negotiable)

### 1.1 Do not touch hreflang & language switcher
- **NEVER** modify, regenerate, reorder, or “improve”:
  - `<!-- HREFLANG (7× + x-default) -->` block
  - the visible language switcher `<nav class="lang-switch">…</nav>`
- These blocks must remain **byte‑identical** unless Denys explicitly tells you to change them.
- `x-default` always points to **en-gb**.

### 1.2 No hallucinations / no AI voice / no “AI meta”
- **No writing “as an AI”**. No “this article was generated”. No “I’m ChatGPT”.
- Content voice is always written as **VPN World** and/or **Denys Shchur** (author),
  unless a specific task says otherwise (e.g., SmartAdvisorOnline editorial voice).
- **No filler** or “AI mush”. Be specific, practical, and human.

### 1.3 Locale purity
- One page = one language. **No mixing languages**.
- Not a machine translation. Every locale must read like a native, current (2026) article.

### 1.4 Repo truth only
- **NEVER** invent:
  - internal links
  - file paths
  - hero image names
  - policy URLs
  - author page URLs
  - JS/CSS file locations
- If uncertain: **scan again** (search file tree, grep, open real files) and proceed only when confirmed.

### 1.5 Visual baseline (do not reinvent)
- Use the existing canonical visual standard from:
  - `/nl-be/blog/vpn-voor-smart-tv.html`
- Use the repo’s `/assets/css/style.css`. Avoid new custom styling unless fixing a real bug.

### 1.6 Cookie + GA (Consent Mode v2)
- Cookie consent is one canonical layer:
  - `<div id="cookie-consent-layer">` + `<div id="cookie-banner">`
  - Buttons `#cookie-accept` / `#cookie-reject`
  - Calls `acceptConsent()` / `rejectConsent()` only
  - Locale‑correct text and localized policy links
- GA4 measurement ID: **G-EMR8C4TLVM**
- GA page_view fires only after Accept (default denied).
- Never add legacy banners or duplicate consent UI.

### 1.7 CTA blocks (exact structure)
- Every article must contain **exactly two** CTA blocks:
  - one early (after intro or early section)
  - one late (near the end, before conclusion/FAQ end)
- Structure must match `vpn-netflix.html` pattern:
  - wrapper: `<div class="cta-buttons">`
  - anchors: `<a class="nordvpn">`, `<a class="surfshark">`, `<a class="proton">`
- All affiliate links: `rel="nofollow sponsored noopener noreferrer" target="_blank"`
- Proton VPN is a **required 3rd partner**.

### 1.8 YouTube embed (nocookie + fallback)
- Embed the official author video:
  - `https://www.youtube.com/watch?v=rzcAKFaZvhE`
- Use `youtube-nocookie.com` iframe + a visible fallback link.

### 1.9 Links limits
- In the **main article text**: max **15 contextual internal links**.
- Do not count links in: language switcher, CTA, related block, footer, policies.

### 1.10 Accessibility / validity / contrast
- Never nest `<p>` inside headings (`<h1>…</h1>` etc.).
- Hero `alt` must be locale language and topical.
- Diagrams + tables must be readable on dark shell:
  - tables in `.table-scroll`, white background, black text, strong borders
  - SVG in `.svg-card > .svg-scroll`, forced black text (`font-weight:800`)
- Avoid low contrast grays.

---

## 2) Projects context (VPN World + SmartAdvisorOnline)

We operate two connected projects:

### VPN World (this repo)
- Multi‑locale static GitHub Pages site.
- Focus: practical VPN use, privacy, checklists, comparisons, leak tests, troubleshooting.

### SmartAdvisorOnline (separate site)
- Domain: `smartadvisoronline.com`
- Has tools (e.g. leak test): `https://smartadvisoronline.com/tools/leak-test.html`
- Sometimes we cross‑link between projects **only if the task/TZ explicitly allows it**.
  Never add cross‑site links by default.

---

## 3) Known paths (repo‑confirmed baseline)

> If any of these are missing in the current repo, re‑scan and update this section.

- PL articles live in: `/blog/*.html`
- Other locales live in: `/<locale>/blog/*.html`
- Author pages:
  - `/about-denys-shchur.html`
  - `/<locale>/about-denys-shchur.html`
- Policy pages:
  - `/privacy.html` and `/<locale>/privacy.html`
  - `/disclosure.html` and `/<locale>/disclosure.html`
- Assets (shared):
  - `/assets/css/style.css`
  - `/assets/js/main.js`
  - `/assets/js/cookie-consent.js`
  - `/assets/img/author/denys-shchur.webp`
  - `/assets/img/hero/*-uk.webp` (same filename used across locales)

---

## 4) Article structure (must be consistent)

Below is the **canonical page layout order**. Do not reorder unless Denys says so.

### 4.1 Head (SEO & metadata)
- `<title>` and `<meta name="description">` are locale‑specific, 2026‑current, and human.
- `canonical` points to self.
- OG/Twitter tags with correct hero and locale/alternates.
- JSON‑LD blocks (required):
  - Article
  - FAQPage
  - BreadcrumbList
  - ItemList (Related)

### 4.2 Body (top → bottom)

1) **Header / Top nav**
- Includes brand + **Blog** link in top navigation.

2) **Hero section**
- Hero image: `/assets/img/hero/<topic>-uk.webp` (confirmed in repo)
- H1 title

3) **Under H1: REQUIRED SNIPPET**
- Immediately under H1, include a visible snippet block (Quick Answer / TL;DR).
- Must be short, punchy, locale‑native, not “AI”.

4) **Intro (human but expert)**
- 2–4 short paragraphs, includes 1–2 “human” phrases.
- Set expectation: what user will learn, who this is for.

5) **Early CTA block**
- `<div class="cta-buttons">` with Nord/Surf/Proton.

6) **TOC (if present in template)**
- Keep the existing TOC pattern from the baseline file for that locale.

7) **Core sections (H2 clusters)**
- Each important H2 should include:
  - a **Key takeaway** mini‑line under the heading or early in the section
  - practical steps, pitfalls, and local realities
- Required content patterns (when relevant):
  - “When it makes sense”
  - “Limitations / when it won’t help”
  - leak test guidance (DNS/IPv6/WebRTC) if topic touches privacy
  - troubleshooting checklist if topic touches setup/streaming/work

8) **Widgets placement (only when the page has a widget)**
- The widget must have a real container ID in HTML that matches JS.
- Place widgets after 2–3 sections (after user understands the context), unless TZ says otherwise.

9) **Tables (1–3 per article)**
- Always wrap in `.table-scroll`
- Always use `<caption>` (not loose text above)
- Force white bg + black text + strong borders

10) **SVG diagrams (4–5 per article, diverse)**
- Always wrap in:
  - `.svg-card` + `.svg-scroll` (overflow-x)
- SVG rules:
  - `viewBox`
  - `svg{color:#000}`
  - `svg text{fill:#000 !important;font-weight:800}`
  - strokes `#000` and 3–4px

11) **Progress duplication inside cards (for checklist widgets)**
- If the widget shows a global progress bar at top, also add a compact per‑card progress:
  - a tiny bar or badge inside each card
  - immediate feedback text under the action area
- Must be readable on dark theme (no white-on-white or black-on-black).

12) **Related block (end of article)**
- Use the wide dark full‑width “Related:” card with green left accent (per baseline).
- Related URLs must exist in the same locale. Never link to 404.
- Typical target: 4–7 related items (or per matrix/TZ).

13) **FAQ (visible + JSON‑LD)**
- 6–10 questions that match user intent and locale reality.
- No fluff.

14) **Author box**
- Denys Shchur author box with working author page link (locale‑correct).
- Use the repo’s author image path.

15) **Footer**
- Must contain localized links to:
  - Privacy
  - Disclosure
  - Contact (if present in repo)
- No broken paths.

---

## 5) Writing style (quality rules)

### Human + expert tone
- Short sentences mixed with occasional longer explanation.
- Add 2–3 natural human phrases per article (not cringe, not overdone).
- Explain “why” and “when it fails”, not just “do X”.

### Region adaptation (per locale)
Each locale must include:
- local ISPs/providers where relevant
- local streaming services/platform quirks where relevant
- local legal/regulatory context when relevant (GDPR/RODO/CNIL etc.)
- local devices and store ecosystems (Android TV, iOS, Windows, routers)

### Uniqueness
- Do not reuse paragraphs across locales.
- No “template translation”. Re‑express the idea natively.

---

## 6) Internal linking rules (context links)

- In‑text links: max 15.
- Prefer linking to:
  1) prerequisite guides (“what is VPN”, “how to install”, “leak tests”)
  2) troubleshooting (“VPN not working”, “DNS leak”, “IPv6 leak”)
  3) adjacent topic comparisons (“proxy vs VPN”, “VPN vs Tor”)
- Related block: use existing locale pages only. If any target is missing → do not link.

---

## 7) Workflow & memory refresh

### 7.1 Before editing any article
1) Open the target locale file.
2) Open the baseline reference file for that locale (or `/nl-be/blog/vpn-voor-smart-tv.html`).
3) Confirm:
   - hreflang block untouched
   - language switcher untouched
   - cookie banner structure unchanged
   - policy links exist

### 7.2 If unsure — scan
If any path or slug is unclear:
- STOP that part.
- Scan repo (search tree, grep strings, open files).
- Proceed only after confirmation by actual repo content.

### 7.3 Scheduled refresh
- Every **2 days** (or when you feel uncertainty about structure), re‑scan the repo:
  - verify policy pages, author pages, assets, and at least 1 baseline article per locale
  - update this file only if repo truth changed

---

## 8) Output requirements (delivery)

When delivering a result:
1) Provide **one complete updated HTML file** (not fragments).
2) Provide a short **WHAT CHANGED** bullet list.
3) Include the **final page URL** at the end (absolute).
4) Explicitly confirm:
   - hreflang block unchanged (byte‑identical)
   - language switcher unchanged (byte‑identical)

---

## 9) Fail‑safe (if you lack info)

If at any point you do not know an exact path/link/slug/filename:
- STOP
- scan the repo again
- never “guess”
- only proceed when confirmed by real file existence
