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
