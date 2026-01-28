/* VPN World — cookie-consent.js (canonical, self-healing)
   - Consent Mode v2 default denied (always)
   - Show canonical banner when there is NO explicit user choice
   - Respect GPC: keep denied, show only "OK" (no Accept)
   - Persist choice in localStorage
   - Fire GA4 page_view only after Accept
*/

(function () {
  "use strict";

  var GA_ID = "G-EMR8C4TLVM"; // VPN World GA4

  // Storage keys
  var KEY_STATE = "vw_consent_state";   // "granted" | "denied"
  var KEY_TS    = "vw_consent_ts";      // ISO string

  function qs(id) { return document.getElementById(id); }

  function getLocalePrefix() {
    // GitHub Pages paths:
    // PL: /blog/... (no locale dir)
    // Others: /en-gb/, /en-us/, /de/, /es/, /fr/, /nl-be/
    var seg = (location.pathname || "/").split("/").filter(Boolean)[0] || "";
    var known = { "en-gb":1, "en-us":1, "de":1, "es":1, "fr":1, "nl-be":1 };
    return known[seg] ? ("/" + seg) : "";
  }

  function getLang() {
    var html = document.documentElement;
    var lang = (html && html.getAttribute("lang")) ? html.getAttribute("lang").toLowerCase() : "en";
    return lang;
  }

  function i18n() {
    var lang = getLang();
    var prefix = getLocalePrefix();
    var privacyHref = prefix + "/privacy.html";

    // Defaults (EN)
    var t = {
      msg: "We use cookies to measure traffic (GA4) and improve the site. You can accept or reject analytics.",
      accept: "Accept",
      reject: "Reject",
      ok: "OK",
      privacy: "Privacy",
      aria: "Cookie consent",
      privacyHref: privacyHref
    };

    // Locale-specific
    if (lang === "pl") {
      t.msg = "Używamy plików cookie do pomiaru ruchu (GA4) i ulepszania strony. Możesz zaakceptować lub odrzucić analitykę.";
      t.accept = "Akceptuj";
      t.reject = "Odrzuć";
      t.ok = "OK";
      t.privacy = "Prywatność";
    } else if (lang === "nl-be") {
      t.msg = "We gebruiken cookies om verkeer te meten (GA4) en de site te verbeteren. Je kan analytics accepteren of weigeren.";
      t.accept = "Accepteren";
      t.reject = "Weigeren";
      t.ok = "OK";
      t.privacy = "Privacy";
    } else if (lang === "fr") {
      t.msg = "Nous utilisons des cookies pour mesurer l’audience (GA4) et améliorer le site. Vous pouvez accepter ou refuser l’analytics.";
      t.accept = "Accepter";
      t.reject = "Refuser";
      t.ok = "OK";
      t.privacy = "Confidentialité";
    } else if (lang === "es") {
      t.msg = "Usamos cookies para medir tráfico (GA4) y mejorar el sitio. Puedes aceptar o rechazar analytics.";
      t.accept = "Aceptar";
      t.reject = "Rechazar";
      t.ok = "OK";
      t.privacy = "Privacidad";
    } else if (lang === "de") {
      t.msg = "Wir verwenden Cookies, um Traffic zu messen (GA4) und die Website zu verbessern. Du kannst Analytics akzeptieren oder ablehnen.";
      t.accept = "Akzeptieren";
      t.reject = "Ablehnen";
      t.ok = "OK";
      t.privacy = "Datenschutz";
    } else if (lang === "en-gb" || lang === "en-us" || lang === "en") {
      // keep defaults
    }

    t.privacyHref = privacyHref;
    return t;
  }

  function isGPC() {
    // Global Privacy Control (some browsers/extensions enable it)
    try { return !!navigator.globalPrivacyControl; } catch(e) { return false; }
  }

  function ensureMarkup() {
    var t = i18n();

    var layer = qs("cookie-consent-layer");
    var banner = qs("cookie-banner");

    if (!layer) {
      layer = document.createElement("div");
      layer.id = "cookie-consent-layer";
      layer.className = "cookie-layer";
      layer.setAttribute("aria-hidden", "true");
      document.body.appendChild(layer);
    }

    if (!banner) {
      banner = document.createElement("div");
      banner.id = "cookie-banner";
      banner.className = "cookie-banner";
      banner.setAttribute("role", "dialog");
      banner.setAttribute("aria-live", "polite");
      banner.setAttribute("aria-label", t.aria);

      banner.innerHTML = [
        '<div class="cookie-banner__inner">',
          '<div class="cookie-banner__text">',
            '<span class="cookie-banner__msg"></span> ',
            '<a class="cookie-banner__link" rel="nofollow"></a>',
          '</div>',
          '<div class="cookie-banner__actions">',
            '<button id="cookie-accept" type="button"></button>',
            '<button id="cookie-reject" type="button" class="btn-secondary"></button>',
          '</div>',
        '</div>'
      ].join("");

      document.body.appendChild(banner);
    }

    // Fill texts/links
    var msg = banner.querySelector(".cookie-banner__msg");
    var link = banner.querySelector(".cookie-banner__link");
    var btnA = qs("cookie-accept");
    var btnR = qs("cookie-reject");

    if (msg) msg.textContent = t.msg;
    if (link) { link.textContent = t.privacy; link.href = t.privacyHref; }

    if (btnA) btnA.textContent = t.accept;
    if (btnR) btnR.textContent = t.reject;

    return { layer: layer, banner: banner };
  }

  function showBanner() {
    var nodes = ensureMarkup();
    nodes.layer.setAttribute("aria-hidden", "false");
    nodes.banner.setAttribute("aria-hidden", "false");

    // force visible (in case page CSS differs)
    nodes.layer.style.display = "block";
    nodes.banner.style.display = "block";
    nodes.banner.style.opacity = "1";
    nodes.banner.style.visibility = "visible";
  }

  function hideBanner() {
    var layer = qs("cookie-consent-layer");
    var banner = qs("cookie-banner");
    if (layer) { layer.setAttribute("aria-hidden", "true"); layer.style.display = "none"; }
    if (banner) { banner.setAttribute("aria-hidden", "true"); banner.style.display = "none"; }
  }

  function setConsentMode(granted) {
    // Consent Mode v2 keys (default denied -> update on decision)
    var v = granted ? "granted" : "denied";
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: v,
        ad_user_data: v,
        ad_personalization: v,
        analytics_storage: v,
        functionality_storage: v,
        personalization_storage: v,
        security_storage: "granted" // security storage can be granted
      });
    }
  }

  function storeDecision(state) {
    try {
      localStorage.setItem(KEY_STATE, state);
      localStorage.setItem(KEY_TS, new Date().toISOString());
    } catch (e) {}
  }

  function firePageViewOnce() {
    // Fire page_view only after Accept
    if (typeof window.gtag !== "function") return;
    try {
      window.gtag("event", "page_view", { send_to: GA_ID });
    } catch (e) {}
  }

  function wireButtons() {
    var btnA = qs("cookie-accept");
    var btnR = qs("cookie-reject");
    if (btnA) {
      btnA.addEventListener("click", function () {
        storeDecision("granted");
        setConsentMode(true);
        hideBanner();
        firePageViewOnce();
      }, { passive: true });
    }
    if (btnR) {
      btnR.addEventListener("click", function () {
        storeDecision("denied");
        setConsentMode(false);
        hideBanner();
      }, { passive: true });
    }
  }

  function applyGPCUI() {
    // If GPC is enabled and no explicit choice yet:
    // keep denied and show only OK (no Accept).
    var t = i18n();
    var btnA = qs("cookie-accept");
    var btnR = qs("cookie-reject");
    if (!btnR) return;

    if (btnA) btnA.style.display = "none";
    btnR.textContent = t.ok;
  }

  function init() {
    // Consent Mode default denied ALWAYS (but this is NOT a user decision)
    // We do NOT write KEY_STATE here unless user explicitly clicks,
    // except when GPC is on (then we store denied to avoid repeated prompts).
    setConsentMode(false);

    var state = null;
    try { state = localStorage.getItem(KEY_STATE); } catch (e) {}

    if (state === "granted") {
      setConsentMode(true);
      // no banner
      hideBanner();
      // page_view can be fired here or on click only; keep conservative:
      firePageViewOnce();
      return;
    }

    if (state === "denied") {
      setConsentMode(false);
      hideBanner();
      return;
    }

    // No explicit decision yet -> show banner
    showBanner();
    wireButtons();

    // If GPC enabled -> UI becomes "OK" only and we store denied on click
    if (isGPC()) {
      applyGPCUI();
      // Optional: store denied immediately to respect GPC across pages without flashing.
      // But we still SHOW banner so the user sees notice.
      storeDecision("denied");
      setConsentMode(false);
      // Keep banner visible (user can press OK to dismiss)
    }
  }

  // Robust init (wait for body)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      if (document.body) init();
    });
  } else {
    if (document.body) init();
    else setTimeout(init, 50);
  }
})();
