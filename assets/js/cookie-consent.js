/* VPN World — Canonical Cookie Consent (Stage 2.5 FINAL — SINGLE LAYER)
   Goals:
   - Always ONE canonical banner created by THIS file only.
   - Kill/disable ANY legacy cookie overlays/bars that block clicks.
   - Consent Mode v2: default denied for all keys.
   - GA4 page_view ONLY after Accept.
   - Works even if HTML has messy legacy snippets.
*/
(function () {
  "use strict";

  // ===== CONFIG =====
  var LS_KEY = "vpnworld_consent";
  var LS_PAGEVIEW_KEY = "vpnworld_pageview_sent";
  var CONSENT_ACCEPTED = "accepted";
  var CONSENT_REJECTED = "rejected";

  function safeGtag() { return (typeof window.gtag === "function"); }
  function q(id) { return document.getElementById(id); }

  // ===== CONSENT MODE v2 =====
  function setConsentDefaultDenied() {
    if (!safeGtag()) return;
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "denied"
    });
  }

  function setConsentGranted() {
    if (!safeGtag()) return;
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
      functionality_storage: "granted",
      personalization_storage: "denied",
      security_storage: "denied"
    });
  }

  function setConsentDenied() {
    if (!safeGtag()) return;
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "denied"
    });
  }

  function sendPageViewOnce() {
    try {
      if (!safeGtag()) return;
      if (localStorage.getItem(LS_PAGEVIEW_KEY) === "1") return;
      window.gtag("event", "page_view");
      localStorage.setItem(LS_PAGEVIEW_KEY, "1");
    } catch (_) {}
  }

  function setStoredConsent(v) { try { localStorage.setItem(LS_KEY, v); } catch (_) {} }
  function getStoredConsent() { try { return localStorage.getItem(LS_KEY); } catch (_) { return null; } }

  // ===== HARD CLICKABILITY (styles) =====
  function injectStyles() {
    if (q("vpnworld-cookie-style")) return;

    var css = `
/* Canonical layer always on top & clickable */
#cookie-consent-layer{
  position:fixed !important;
  left:0 !important; top:0 !important; right:0 !important; bottom:0 !important;
  z-index:2147483647 !important;
  pointer-events:auto !important;
  background:transparent !important;
}
#cookie-banner{
  position:fixed !important;
  left:16px !important; right:16px !important; bottom:16px !important;
  z-index:2147483647 !important;
  pointer-events:auto !important;
  background:#ffffff !important;
  color:#000000 !important;
  border:1px solid #111827 !important;
  border-radius:12px !important;
  box-shadow:0 10px 30px rgba(0,0,0,.35) !important;
  padding:14px 14px !important;
  max-width:980px !important;
  margin:0 auto !important;
  font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif !important;
}
#cookie-banner *{ pointer-events:auto !important; }
#cookie-banner .cookie-row{ display:flex !important; gap:10px !important; flex-wrap:wrap !important; align-items:center !important; justify-content:space-between !important; }
#cookie-banner .cookie-text{ font-size:14px !important; line-height:1.35 !important; margin:0 !important; }
#cookie-banner .cookie-actions{ display:flex !important; gap:10px !important; flex-wrap:wrap !important; }
#cookie-banner button{
  appearance:none !important;
  border:0 !important;
  border-radius:10px !important;
  padding:10px 14px !important;
  font-weight:800 !important;
  cursor:pointer !important;
}
#cookie-accept{ background:#1f6feb !important; color:#fff !important; }
#cookie-reject{ background:#111827 !important; color:#fff !important; }
#cookie-banner a{ color:#1f6feb !important; text-decoration:underline !important; }
`;

    var style = document.createElement("style");
    style.id = "vpnworld-cookie-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ===== REMOVE / DISABLE LEGACY COOKIE UI =====
  function isOurCanonical(el) {
    if (!el) return false;
    return el.id === "cookie-consent-layer" || el.id === "cookie-banner";
  }

  function hardRemove(el) {
    try { el && el.parentNode && el.parentNode.removeChild(el); } catch (_) {}
  }

  function killLegacyCookieUI() {
    // 1) Remove known legacy libs/containers
    var removeSelectors = [
      ".cc-window", ".cc-banner", ".cc-revoke", "#cc-window",
      "#cookieconsent", ".cookieconsent",
      ".osano-cm-window", ".osano-cm-dialog", ".osano-cm-overlay",
      "#cookieConsent", "#cookie-consent", "#cookieNotice", "#cookie-notice",
      ".cookie-banner", ".cookie-consent", ".cookie-notice",
      "[id*='cookieconsent']", "[class*='cookieconsent']",
      "[id*='osano']", "[class*='osano']"
    ];

    removeSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (isOurCanonical(el)) return;
        hardRemove(el);
      });
    });

    // 2) If old templates injected our ids, remove them (we recreate clean)
    document.querySelectorAll("#cookie-consent-layer, #cookie-banner").forEach(function (el) {
      hardRemove(el);
    });

    // 3) Heuristic hard-kill: ANY fixed/sticky bottom bar mentioning cookies/privacy/accept/reject
    document.querySelectorAll("div,section,aside").forEach(function (el) {
      try {
        if (isOurCanonical(el)) return;

        var st = window.getComputedStyle(el);
        if (!st) return;

        var isFixed = (st.position === "fixed" || st.position === "sticky");
        if (!isFixed) return;

        var rect = el.getBoundingClientRect();
        if (!rect) return;

        // Near bottom and wide enough to be a bar
        var nearBottom = rect.bottom >= (window.innerHeight - 5);
        var wideEnough = rect.width >= Math.min(480, window.innerWidth * 0.7);
        if (!nearBottom || !wideEnough) return;

        var txt = (el.innerText || "").toLowerCase();
        var looksLikeCookie =
          txt.includes("cookie") || txt.includes("cookies") ||
          txt.includes("prywat") || txt.includes("privacy") ||
          txt.includes("akcept") || txt.includes("accept") ||
          txt.includes("odrzuc") || txt.includes("reject");

        if (looksLikeCookie) {
          // This is the killer move: remove it completely
          hardRemove(el);
        }
      } catch (_) {}
    });

    // 4) Last safety: disable pointer events for any remaining "cookie-ish" fixed nodes
    document.querySelectorAll("div,section,aside").forEach(function (el) {
      try {
        if (isOurCanonical(el)) return;
        var st = window.getComputedStyle(el);
        if (!st) return;
        if (st.position !== "fixed" && st.position !== "sticky") return;

        var txt = (el.innerText || "").toLowerCase();
        if (txt.includes("cookie") || txt.includes("cookies") || txt.includes("prywat") || txt.includes("privacy")) {
          el.style.pointerEvents = "none";
        }
      } catch (_) {}
    });
  }

  // ===== CANONICAL BANNER DOM =====
  function createBanner() {
    var layer = document.createElement("div");
    layer.id = "cookie-consent-layer";

    var banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "true");
    banner.setAttribute("aria-label", "Cookie consent");

    // NOTE: PL UI text (works for all locales as temporary stable baseline)
    banner.innerHTML = `
      <div class="cookie-row">
        <p class="cookie-text">
          Używamy cookies, aby mierzyć ruch i poprawiać stronę.
          <a href="/privacy.html" rel="nofollow">Prywatność</a>
        </p>
        <div class="cookie-actions">
          <button id="cookie-accept" type="button">Akceptuję</button>
          <button id="cookie-reject" type="button">Odrzucam</button>
        </div>
      </div>
    `;

    layer.appendChild(banner);
    document.body.appendChild(layer);
  }

  function show() {
    var layer = q("cookie-consent-layer");
    if (!layer) return;
    layer.style.display = "block";
    layer.removeAttribute("hidden");
  }

  function hide() {
    var layer = q("cookie-consent-layer");
    if (!layer) return;
    layer.style.display = "none";
    layer.setAttribute("hidden", "hidden");
  }

  function wire() {
    var acceptBtn = q("cookie-accept");
    var rejectBtn = q("cookie-reject");

    // hard reset listeners
    if (acceptBtn && acceptBtn.parentNode) {
      var a = acceptBtn.cloneNode(true);
      acceptBtn.parentNode.replaceChild(a, acceptBtn);
      acceptBtn = a;
    }
    if (rejectBtn && rejectBtn.parentNode) {
      var r = rejectBtn.cloneNode(true);
      rejectBtn.parentNode.replaceChild(r, rejectBtn);
      rejectBtn = r;
    }

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        setStoredConsent(CONSENT_ACCEPTED);
        setConsentGranted();
        sendPageViewOnce();
        hide();
      }, { passive: true });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener("click", function () {
        setStoredConsent(CONSENT_REJECTED);
        setConsentDenied();
        hide();
      }, { passive: true });
    }

    // Compatibility API (if any old HTML calls it)
    window.acceptConsent = function () {
      setStoredConsent(CONSENT_ACCEPTED);
      setConsentGranted();
      sendPageViewOnce();
      hide();
    };
    window.rejectConsent = function () {
      setStoredConsent(CONSENT_REJECTED);
      setConsentDenied();
      hide();
    };
  }

  // ===== INIT =====
  function init() {
    injectStyles();
    setConsentDefaultDenied();

    // Kill legacy early
    try { killLegacyCookieUI(); } catch (_) {}

    // Kill legacy again after layout + after full load (late injected banners)
    setTimeout(function () { try { killLegacyCookieUI(); } catch (_) {} }, 0);
    window.addEventListener("load", function () { try { killLegacyCookieUI(); } catch (_) {} }, { once: true });

    // Recreate canonical clean
    var oldL = q("cookie-consent-layer"); if (oldL) hardRemove(oldL);
    var oldB = q("cookie-banner"); if (oldB) hardRemove(oldB);

    createBanner();
    wire();

    var s = getStoredConsent();
    if (s === CONSENT_ACCEPTED) {
      setConsentGranted();
      sendPageViewOnce();
      hide();
      return;
    }
    if (s === CONSENT_REJECTED) {
      setConsentDenied();
      hide();
      return;
    }
    show();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
