# VPNW Stage 2.5 Standard Reference

> Canonical reference file for VPN World HTML article production.
> Compare every article output against this checklist before finalising.

---

## HARD RULES (non-negotiable)

- **NEVER** modify the `<!-- HREFLANG (7× + x-default) -->` block or the visible `<nav class="lang-switch">` element.
- **NEVER** invent paths, slugs, image names, or URLs. Scan the repo and cite existing files only.
- The visual baseline is `/nl-be/blog/vpn-voor-smart-tv.html` ("dark shell + white article card" layout).
- Cookie consent: single layer — `<div id="cookie-consent-layer">` + `<div id="cookie-banner">` with locale-correct text. No duplicate banners.
- GA4 ID is **G-EMR8C4TLVM**, loaded only via `/assets/js/cookie-consent.js` (never inline). Page-view fires only after Accept (Consent Mode v2 default-denied).

---

## KNOWN PATHS (repo-confirmed)

| Item | Path |
|------|------|
| Stylesheet | `../../assets/css/style.css` (from `/locale/blog/`) |
| Cookie consent JS | `/assets/js/cookie-consent.js` |
| Main JS | `../../assets/js/main.js` |
| Author image | `../../assets/img/author/denys-shchur.webp` |
| Hero images | `../../assets/img/hero/<slug>-uk.webp` (all use -uk suffix) |
| FR author page | `/fr/about-denys-shchur.html` |
| FR privacy | `/fr/privacy.html` |
| FR disclosure | `/fr/disclosure.html` |
| Root about | `/about-denys-shchur.html` |
| Contact email | `mailto:u1797008805@gmail.com` |
| GA4 ID | `G-EMR8C4TLVM` |
| Affiliate NordVPN | `https://go.nordvpn.net/aff_c?aff_id=2495&offer_id=312&url_id=2584` |
| Affiliate Surfshark | `https://www.tkqlhce.com/click-101525886-17061430` |
| Affiliate Proton VPN | `https://www.dpbolvw.net/click-101525886-15834536` |
| YouTube video (nocookie) | `https://www.youtube-nocookie.com/embed/rzcAKFaZvhE?rel=0&modestbranding=1` |
| YouTube fallback link | `https://www.youtube.com/watch?v=rzcAKFaZvhE` |

---

## PAGE SKELETON ORDER (strict)

```html
<!DOCTYPE html>
<html lang="{locale}">
<head>
  <!-- 1. charset + viewport + robots -->
  <!-- 2. title + description (locale) -->
  <!-- 3. canonical (locale) -->
  <!-- 4. HREFLANG (7× + x-default) — DO NOT EDIT -->
  <!-- 5. style.css link (correct relative depth) -->
  <!-- 6. preconnect / dns-prefetch (GTM + GA) -->
  <!-- 7. OG + Twitter (locale; hero image: existing -uk.webp filename) -->
  <!--    include article:published_time + article:modified_time -->
  <!-- 8. JSON-LD: Article + FAQPage + BreadcrumbList + ItemList(Related) -->
  <!-- 9. GA4 comment: "GA4 + Consent Mode v2 (DEFAULT DENIED)" -->
  <!-- 10. Page-only inline <style> (table/SVG high-contrast + related-card) -->
  <!-- 11. cookie-consent.js defer -->
</head>
<body>
  <!-- 12. site-header: brand + primary-nav ("Blog") -->
  <!-- 13. lang-switch nav — DO NOT EDIT -->
  <!-- HERO SECTION (strict order inside hero-copy): -->
  <!--   a. H1 -->
  <!--   b. Quick Answer block (.note or .key-takeaway) -->
  <!--   c. Short intro paragraph (2–4 lines) -->
  <!--   d. hero-author (image + name link + meta date/reading time) -->
  <!--   e. Early CTA block (div.cta-buttons with nordvpn/surfshark/proton) -->
  <!--   f. Widget container (if applicable) — AFTER CTA, never inside H tags -->
  <!--   g. meta-points ul (optional highlight list) -->
  <!-- hero-media: hero image -->
  <!-- TOC (.note block with ul links) -->
  <!-- ARTICLE CONTENT (min 1200 words): -->
  <!--   - H2 sections, each with Key takeaway immediately after H2 -->
  <!--   - 1–3 tables (each in .table-scroll, with <caption>) -->
  <!--   - 4–5 SVG diagrams (each in .svg-card > .svg-scroll, white bg) -->
  <!--   - ≥1 .related-card inside content (not just footer) -->
  <!-- VIDEO BLOCK (youtube-nocookie + fallback link) -->
  <!-- FAQ SECTION (visible DL/DD + JSON-LD FAQPage already in head) -->
  <!-- CONCLUSION -->
  <!-- LATE CTA BLOCK (same structure as early CTA, div.cta-buttons) -->
  <!-- RELATED SECTION (≥4 .related-card items, confirmed slugs only) -->
  <!-- AUTHOR BOX (div.author-box, image + bio + locale author page link) -->
  <!-- FOOTER (footer.site-footer > div.container.footer-grid > div + nav) -->
  <!-- main.js script -->
  <!-- Cookie consent HTML (cookie-consent-layer + cookie-banner, locale text) -->
</body>
</html>
```

---

## SNIPPET RULE (iron law)

- **Under H1**: visible Quick Answer block — concrete: what to do, what to expect, what to check.
- **Under every H2**: visible "Key takeaway" snippet — 1–2 actionable sentences.
- Use `.note` class or inline styled block. No hidden/collapsed snippets.
- Locale language only (no mixed languages).

---

## CTA RULES

- Exactly **2 CTA blocks** per article: one early (after intro/author in hero), one late (end of article, before related section).
- Both must use exactly:
  ```html
  <div class="cta-buttons" aria-label="Offres partenaires">
    <a href="https://go.nordvpn.net/..." class="nordvpn" target="_blank" rel="nofollow sponsored noopener noreferrer">...</a>
    <a href="https://www.tkqlhce.com/..." class="surfshark" target="_blank" rel="nofollow sponsored noopener noreferrer">...</a>
    <a href="https://www.dpbolvw.net/..." class="proton" target="_blank" rel="nofollow sponsored noopener noreferrer">...</a>
  </div>
  ```
- Wrap late CTA in `div.cta-box` with `h2` and `p.cta-note` for context.

---

## WIDGET RULES (DNS Control Center)

- Container IDs must be prefixed `{locale}-dns-*` (e.g. `fr-dns-grid`, `fr-dns-prev`, `fr-dns-next`, `fr-dns-pageinfo`, `fr-dns-progressbar`, `fr-dns-progresslabel`).
- Progress bar required at top of widget.
- **Per-card progress badge** (`div.dns-card-progress-badge`) must be injected inside every card and updated live by `updateProgress()`.
- localStorage key: `vpnworld_{locale}_dns_widget_v1` (e.g. `vpnworld_fr_dns_widget_v1`).
- Whole-card clickable (except summary, .dns-hint, a, pre, code, checkbox, text-selection).
- Keyboard a11y: Enter/Space on top bar toggles done state.
- No external libraries. No console errors.
- Hints use `<details class="dns-hint"><summary>…</summary><div class="dns-hint-body">…</div></details>`.

---

## DIAGRAMS / SVG RULES

Minimum **4 SVGs** per article (target 4–5). Each must:
- Be wrapped: `<div class="svg-card" aria-label="…"><div class="svg-scroll"><svg …></svg></div></div>`
- Have an explicit white background rect: `<rect x="0" y="0" width="W" height="H" fill="#ffffff"/>`
- Have readable text: all `<text>` elements use `fill="#000"` (or override via CSS)
- Use `stroke="#000"` with `stroke-width="3"` or `4` for all lines/borders
- Use soft colour fills for boxes (e.g. `#eaf2ff`, `#eafff1`, `#fff6cc`, `#ffecec`) — NEVER dark fill with white text
- `role="img" aria-label="…"` on the `<svg>` element

CSS pattern (inline in page `<style>`):
```css
.svg-card{margin:18px 0;border-radius:14px;background:#fff;border:1px solid #e5e7eb;box-shadow:0 8px 20px rgba(0,0,0,.12)}
.svg-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;padding:12px}
.svg-scroll svg{display:block;max-width:100%;height:auto;color:#000}
.svg-scroll svg text{fill:#000 !important;font-weight:800}
```

---

## TABLE RULES

Minimum **1 table** per article (target 1–3). Each must:
- Be wrapped: `<div class="table-scroll" aria-label="…"><table>…</table></div>`
- Include `<caption>` (required for a11y + SEO)
- Be forced readable on dark theme with page-level inline CSS:
  ```css
  .table-scroll, .table-scroll *{color:#000 !important}
  .table-scroll table{width:100%;border-collapse:collapse;background:#fff !important}
  .table-scroll th,.table-scroll td{border:2px solid #000 !important;padding:10px 12px;vertical-align:top;background:#fff !important}
  .table-scroll thead th{background:#eaf2ff !important}
  .table-scroll tbody tr:nth-child(even) td{background:#f7fbff !important}
  .table-scroll a{color:#0b4fd6 !important;text-decoration:underline}
  ```

---

## INTERNAL LINKING

- Max **15 contextual internal links** in article body (not counting footer, related, CTA, lang-switcher).
- Related block: **4–7 items**, confirmed slugs only (scan `/fr/blog/` to verify before adding).
- In-content `.related-card` blocks: at least 1 in the body content (in addition to footer related section).

---

## RELATED CARD STYLE (dark, green accent — project standard)

```css
.related-card{
  margin:18px 0;
  background:#071023;
  border:1px solid #1b2432;
  border-radius:14px;
  padding:14px 16px;
  position:relative;
  box-shadow:0 10px 22px rgba(0,0,0,.18);
}
.related-card:before{
  content:"";
  position:absolute;
  left:10px;top:12px;bottom:12px;
  width:4px;border-radius:4px;
  background:#22c55e;
}
.related-card p{margin:0;color:#eaeaea}
.related-card a{color:#eaeaea;text-decoration:underline}
.related-card strong{color:#eaeaea}
```

---

## FOOTER PATTERN (match baseline)

```html
<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <strong>VPN World</strong>
      <p>Service indépendant sur la confidentialité et la sécurité en ligne.</p>
    </div>
    <nav aria-label="Liens pied de page">
      <a href="/fr/privacy.html">Confidentialité</a>
      <a href="/fr/disclosure.html">Divulgation</a>
      <a href="mailto:u1797008805@gmail.com">Contact</a>
    </nav>
  </div>
  <div class="container tiny">© 2026 VPN World</div>
</footer>
```

---

## VIDEO BLOCK RULE

```html
<section class="section section-alt">
  <div class="container">
    <h2>…title…</h2>
    <p class="note"><strong>Key takeaway :</strong> …</p>
    <div class="video-wrap">
      <iframe
        src="https://www.youtube-nocookie.com/embed/rzcAKFaZvhE?rel=0&modestbranding=1"
        title="VPN World — vidéo"
        loading="lazy"
        frameborder="0"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    </div>
    <p>Si le lecteur ne se charge pas, regardez sur YouTube :
      <a href="https://www.youtube.com/watch?v=rzcAKFaZvhE" target="_blank" rel="nofollow noopener noreferrer">https://www.youtube.com/watch?v=rzcAKFaZvhE</a>.
    </p>
  </div>
</section>
```

---

## COOKIE CONSENT HTML (canonical, end of body)

```html
<!-- Cookie Consent (canonical) -->
<div id="cookie-consent-layer" class="cookie-layer" aria-hidden="true"></div>
<div id="cookie-banner" class="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
  <div class="cookie-banner__inner">
    <div class="cookie-banner__text">
      <span class="cookie-banner__msg"><!-- locale message here --></span>
      <a class="cookie-banner__link" href="/fr/privacy.html" rel="nofollow">Confidentialité</a>
    </div>
    <div class="cookie-banner__actions">
      <button id="cookie-accept" type="button">Accepter</button>
      <button id="cookie-reject" type="button">Refuser</button>
    </div>
  </div>
</div>
<!-- /Cookie Consent (canonical) -->
```

French strings (from cookie-consent.js):
- msg: `Nous utilisons des cookies pour mesurer le trafic (GA4) et améliorer le site.`
- accept: `Accepter` | reject: `Refuser` | privacy link text: `Confidentialité`

---

## CHECKLIST (before finalising any article)

- [ ] hreflang + lang-switch byte-identical to original
- [ ] canonical correct for locale
- [ ] OG hero image exists in /assets/img/hero/
- [ ] article:published_time + article:modified_time present in OG
- [ ] JSON-LD: Article + FAQPage + BreadcrumbList + ItemList present
- [ ] dateModified matches "Mis à jour" hero meta line
- [ ] cookie-consent.js loaded (defer), correct locale strings in cookie banner
- [ ] 2 CTA blocks (early + late), both with nordvpn/surfshark/proton classes
- [ ] ≥4 SVG diagrams (white bg, readable, .svg-card wrapper)
- [ ] ≥1 table (.table-scroll with caption)
- [ ] Key takeaway after every H2
- [ ] Quick Answer visible under H1
- [ ] Author box at bottom with correct locale author page link
- [ ] Footer uses footer-grid pattern with locale privacy/disclosure/contact
- [ ] All internal links point to confirmed existing files
- [ ] Related section: 4–7 items, confirmed slugs
- [ ] No "Analyse :" / "Claude AI" / test strings in widget
- [ ] localStorage key: vpnworld_{locale}_dns_widget_v1
- [ ] All widget IDs prefixed {locale}-dns-*

# ADDENDUM — CONTENT CONSTITUTION (MUST FOLLOW) ✅
**Status:** LAW / Constitution / Checklist  
**Applies to:** VPN World (Stage 2.5+) and (when explicitly requested) SmartAdvisorOnline pages  
**Priority:** This section overrides any generic model behavior.

---

## 1) Voice, Authorship, and “No-AI” Rule (HARD)
### 1.1. Who is speaking
All visible text must be written **only** as:
- **VPN World** editorial voice, or
- **Denys Shchur** (author voice),  
unless the **task brief (TZ)** explicitly says: **SmartAdvisorOnline** voice.

### 1.2. Forbidden AI artifacts (ZERO tolerance)
Strictly prohibited in user-facing text:
- “As an AI…”, “I can’t browse…”, “I’m a model…”
- “This article was generated…”
- Any “AI meta” phrases, disclaimers, or self-references
- Robotic filler, repetitive patterns, “template sounding” paragraphs
- Hallucinated facts, invented features, invented measurements, invented tools

**Rule:** If you don’t know a fact — **do not fabricate**. Either:
- omit it, or
- replace with a safe, verifiable framing (“in many cases…”, “typically…”) without false specifics, or
- request exact source from the repo/TZ.

### 1.3. Human but expert tone (HARD)
Tone must be:
- **human, practical, confident**, but not salesy
- short human phrases allowed (2–3 per article) like:
  - “Let’s keep it simple…”
  - “Here’s what actually matters…”
  - “If you only do one thing — do this…”

Avoid: corporate tone, generic “guide-like” fluff, or unnatural “SEO packing”.

---

## 2) Localization is NOT Translation (HARD)
### 2.1. No auto-translation
Localized pages are **not** direct translations.
Each locale must be written as **native, region-adapted content**.

### 2.2. Regional adaptation requirements
For each locale, include relevant local details where appropriate:
- **Local ISPs/operators** (examples: PL: Orange/Play/T-Mobile; NL-BE: Proximus/Telenet; FR: Orange/SFR/Free; DE: Telekom/Vodafone/O2; UK: BT/Virgin/Sky; US: Comcast/AT&T/Verizon)
- **Local streaming/app issues** and common error patterns (only if relevant to topic)
- **Local privacy/legal framing**: GDPR (EU), UK GDPR, ePrivacy, CNIL (FR), etc.  
  **Important:** do not give legal advice; keep it factual and cautious.
- **Local vocabulary and idioms** (native phrasing, not literal English structures)

### 2.3. Language purity
The entire article must be **100% in the page locale language**.  
No mixed languages in meta, UI labels, widgets, headings, buttons, captions, FAQ, or cookie banner.

---

## 3) Repo Truth: NO invented paths/URLs/Slugs (HARD)
### 3.1. Path/slug rule
You may use internal links, hero images, policy links, author links, and widgets **only** if they exist in the repo.

**If uncertain: STOP and rescan repo.**  
Never “best guess” a file name, folder, or slug.

### 3.2. Immutable blocks (CRITICAL)
The following must remain **byte-identical** to the original file:
- the **hreflang block**
- the visible **language switcher**

You may read/verify them, but **never edit** unless the user explicitly says so.

---

## 4) Two connected projects: VPN World + SmartAdvisorOnline
### 4.1. Project roles
- **VPN World** = multi-locale knowledge hub + practical guides + on-page tools/widgets.
- **SmartAdvisorOnline** = advanced data/tools platform (status pages, tools, monitoring, research pages).

### 4.2. Cross-link rule (ONLY if TZ says so)
Cross-links between projects are allowed **only when the TZ explicitly requests** interlinking.
Otherwise, keep projects independent.

When cross-linking is requested:
- link must be factual and useful (tool, status page, reference method)
- no forced promos
- never invent SAO URLs—use only verified ones from repo/TZ

---

## 5) Standard Page Structure (HARD TEMPLATE)
This is the canonical structure for a Stage 2.5 article page.  
The exact HTML wrappers come from the project template; below is the **content order**.

### 5.1. Above-the-fold (must exist)
1) **Hero section** (image + title area)
2) **H1** (single, clean, no nested <p>)
3) **Meta line** (date published/updated, author link)
4) **Intro (2–5 short paragraphs)**: what this page solves, who it’s for, what you’ll get
5) **Quick Answer snippet** (MANDATORY under H1)
   - short, actionable, ~3–6 bullets or 2 short paragraphs
   - must answer the query immediately

✅ **Rule:** “Quick Answer” block is mandatory for EVERY article.

### 5.2. Early CTA block (mandatory)
After intro or after first H2 (as per template):
- **CTA Buttons block** (NordVPN/Surfshark/Proton) — exact project pattern.

### 5.3. Table of contents (recommended)
If the template includes TOC, keep it consistent.

### 5.4. Core content sections (H2 clusters)
Use 6–10 H2 sections typically. Under each important H2:
- immediately include a **Key Takeaway** line (1–2 sentences).
- then go deeper with practical steps, pitfalls, checks.

**Required conceptual sections** (adapt names per locale/topic):
- What it is / How it works (only if relevant)
- When it makes sense (use cases)
- Limitations / What it won’t solve
- Risks & mistakes
- Step-by-step / checklist / configuration
- Testing & verification (DNS/IPv6/WebRTC leaks, etc — only if topic needs it)
- Troubleshooting (realistic failures + fixes)
- FAQ (visible, not only JSON-LD)

### 5.5. Widgets placement (rule)
If a page includes a tool/widget:
- place it **after 2–3 sections** (usually after risks/functionality), not at the very end.
- provide **1 short paragraph before** the widget (what it does)
- provide **1 short paragraph after** the widget (how to interpret results)

If the widget is a card-based checker:
- ensure card UX (readable labels, progress duplication in cards if required by widget spec)

### 5.6. Tables (mandatory)
- Minimum **1 table**, often 2–3 depending on topic.
- Every table must be inside `.table-scroll` and must include `<caption>` (or explicit label).
- Table content must be practical: comparisons, checklists, settings, troubleshooting matrix.

### 5.7. Diagrams / SVG (mandatory)
- Aim for **4–5 diagrams per article** where meaningful (mix types).
- Wrap every SVG as `.svg-card > .svg-scroll`.
- High contrast readability is mandatory (white background, black text, thick strokes).
- Diagram labels must be localized.

### 5.8. Video block (mandatory)
- YouTube **nocookie** embed + fallback link
- placed around mid-article (after 2–3 sections) unless TZ says otherwise

### 5.9. Conclusion / “Final verdict” (mandatory)
Near the end:
- summary of best actions (3–7 bullets)
- what to do next
- avoid salesy ending; practical tone

### 5.10. Late CTA block (mandatory)
Close to the end, before related/author:
- second **CTA Buttons block** (same pattern)

### 5.11. Related block (mandatory)
- 4–7 related links (only existing slugs)
- logic: same cluster + next step + supporting base knowledge
- do not exceed site internal-link limits specified in the standard

### 5.12. Author box (mandatory)
- must show Denys Shchur (or editorial team if TZ says “играем командой”)
- author link must be the real author page for this locale (from repo)

### 5.13. Footer policies (mandatory)
- Privacy / Disclosure / Contact must be locale-correct and repo-verified.
- Cookie banner strings localized.

---

## 6) Content Quality Rules (No fluff)
### 6.1. Uniqueness & freshness
- Content must be unique and current for the year in the TZ.
- No generic “VPN is important” padding.
- Use specific mechanisms: protocols, leaks, latency, DNS/IPv6, split tunneling, kill switch, obfuscation, etc — but only where relevant.

### 6.2. Proof discipline
If you state a specific number, provider name, law detail, or app behavior:
- it must be either general/common knowledge OR explicitly supported by repo/TZ.
Otherwise, rewrite it to a safe generic statement.

### 6.3. Internal links discipline
- Inside the main text: keep links **useful**, not spammy.
- Never link to non-existent pages.
- Never open internal links in new tabs.

---

## 7) Workflow Rule: Every article has its own TZ (HARD)
For every new slug/page:
- there will always be a **specific TZ** (brief) describing: topic, target intent, audience, widget needs, link cluster, and locale nuances.
- This document is the **Constitution**, but the **TZ is the mission** for a конкретная статья.

If TZ conflicts with the Constitution:
- Constitution wins unless user explicitly overrides a rule.

---

## 8) Final delivery checklist (must report)
When delivering final HTML:
- Provide “WHAT CHANGED” bullet list
- Provide final page URL (absolute)
- Confirm hreflang + language switcher are byte-identical (or stop and recheck)
- Confirm no invented slugs/paths were used
# LOCALE PLAYBOOK — REGION-ADAPTIVE WRITING RULES (HARD)

Purpose: ensure every article reads as native, region-aware, and written by a real local expert — not translated.

These rules apply to:
- vocabulary
- examples
- providers mentioned
- laws referenced
- troubleshooting context

Never force local references if irrelevant. Use only when context makes sense.

---

# 🇵🇱 POLISH (pl)
Tone: practical, direct, slightly informal but expert.

Preferred vocabulary:
- VPN: use normally (no need to expand repeatedly)
- “wyciek DNS”, “ochrona prywatności”, “połączenie VPN”
- avoid overly formal legal phrasing unless necessary

Local ISP examples:
- Orange Polska
- Play
- T-Mobile Polska
- Plus
- UPC Polska

Local law context:
- GDPR → RODO
- mention “RODO” when discussing privacy (if relevant)

Realistic local problems:
- public Wi-Fi in cafes, trains (PKP Intercity Wi-Fi)
- mobile network switching between LTE/5G/Wi-Fi
- ISP DNS overrides

Avoid:
- Germanic sentence structure
- overly academic phrasing

---

# 🇬🇧 ENGLISH (UK) — en-gb
Tone: calm, expert, understated confidence.

Vocabulary preferences:
- “privacy”, “connection”, “settings”, “mobile network”
- spelling: behaviour, colour, centre, optimise

Local ISP examples:
- BT
- Virgin Media
- Sky Broadband
- TalkTalk

Streaming/platform context:
- BBC iPlayer
- Sky Go
- ITVX

Legal references:
- UK GDPR
- Investigatory Powers Act (only if relevant)

Avoid:
- US-centric phrasing (“cell phone” → use “mobile”)
- overhyped marketing tone

---

# 🇺🇸 ENGLISH (US) — en-us
Tone: confident, practical, slightly more direct than UK version.

Vocabulary preferences:
- “internet provider”
- “connection”
- “network traffic”
- spelling: behavior, color, center

Local ISP examples:
- Comcast Xfinity
- AT&T
- Verizon
- Spectrum

Platform references:
- Hulu
- Netflix
- public Wi-Fi in airports, coffee shops

Avoid:
- British spellings
- overly formal legal tone

---

# 🇩🇪 GERMAN (de)
Tone: precise, technical clarity, structured.

Vocabulary preferences:
- “DNS-Leak”
- “VPN-Verbindung”
- “Datenschutz”
- avoid overly casual slang

Local ISP examples:
- Deutsche Telekom
- Vodafone
- O2
- 1&1

Legal references:
- DSGVO (German GDPR)
- privacy protection importance is culturally high

Typical local issues:
- strict firewall environments
- IPv6 enabled by default on many providers

Avoid:
- literal English translations
- overly casual conversational tone

---

# 🇫🇷 FRENCH (fr)
Tone: clear, professional, educational.

Vocabulary preferences:
- “fuite DNS”
- “connexion VPN”
- “protection de la vie privée”

Local ISP examples:
- Orange
- Free
- SFR
- Bouygues Telecom

Legal references:
- RGPD
- CNIL (only when relevant)

Typical local issues:
- ISP DNS interception
- mobile network switching

Avoid:
- anglicisms unless necessary
- overly technical jargon without explanation

---

# 🇪🇸 SPANISH (es)
Tone: clear, helpful, moderately conversational.

Vocabulary preferences:
- “fuga DNS”
- “conexión VPN”
- “proveedor de internet”

Local ISP examples:
- Movistar
- Vodafone España
- Orange España

Typical context:
- mobile network switching
- public Wi-Fi risks

Avoid:
- formal legal over-language
- literal translation structure

---

# 🇳🇱 DUTCH (nl-be)
Tone: practical, straightforward, highly clear.

Vocabulary preferences:
- “DNS-lek”
- “VPN-verbinding”
- “privacybescherming”

Local ISP examples:
- Proximus
- Telenet
- Orange Belgium

Typical local context:
- dual-stack IPv4/IPv6 setups
- ISP DNS preference behavior

Avoid:
- formal legal language unless needed
- German-style structure

---

# Cross-locale human realism rule (MANDATORY)
Each article must include:
- natural human phrasing
- realistic examples
- practical troubleshooting scenarios
- but never fabricated statistics or claims

Allowed:
“On some networks, especially public Wi-Fi or mobile connections, DNS requests may bypass the VPN.”

Forbidden:
“Exactly 37% of users experience DNS leaks.” (unless real, verified source exists)

---

# Final principle
Localization = adaptation, not translation.

Every article must feel:
- native
- written by a regional expert
- technically credible
- human
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