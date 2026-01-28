/* VPN World — cookie-consent.js (canonical)
   - Consent Mode v2 default denied
   - Works with canonical markup:
       #cookie-consent-layer + #cookie-banner
       .cookie-banner__msg, .cookie-banner__link, .cookie-banner__actions
       Buttons can be either:
         #cookie-accept/#cookie-reject OR [data-consent="accept"/"reject"] OR .btn-accept/.btn-reject
   - Persist in localStorage
   - Fire GA4 page_view only after Accept
*/

(function () {
  "use strict";

  var GA_ID = "G-EMR8C4TLVM";

  // Storage keys
  var KEY_STATE = "vw_consent_state"; // "granted" | "denied"
  var KEY_TS = "vw_consent_ts";       // ISO string

  function qs(id) { return document.getElementById(id); }

  function getLang() {
    var html = document.documentElement;
    var lang = (html && html.getAttribute("lang")) ? html.getAttribute("lang").toLowerCase() : "en";
    return lang;
  }

  function i18n() {
    var lang = getLang();

    // Default EN
    var t = {
      text: "We use cookies to measure traffic (GA4) and improve the site. You can accept or reject analytics.",
      accept: "Accept",
      reject: "Reject",
      privacy: "Privacy"
    };

    // PL
    if (lang === "pl" || lang.indexOf("pl-") === 0) {
      t.text = "Używamy plików cookie do pomiaru ruchu (GA4) i ulepszania serwisu. Możesz zaakceptować lub odrzucić analitykę.";
      t.accept = "Akceptuję";
      t.reject = "Odrzucam";
      t.privacy = "Prywatność";
    }
    // EN-GB / EN-US
    else if (lang === "en-gb" || lang === "en-us" || lang.indexOf("en-") === 0 || lang === "en") {
      t.text = "We use cookies to measure traffic (GA4) and improve the site. You can accept or reject analytics.";
      t.accept = "Accept";
      t.reject = "Reject";
      t.privacy = "Privacy";
    }
    // DE
    else if (lang === "de" || lang.indexOf("de-") === 0) {
      t.text = "Wir verwenden Cookies, um den Traffic (GA4) zu messen und die Website zu verbessern. Du kannst Analytics akzeptieren oder ablehnen.";
      t.accept = "Akzeptieren";
      t.reject = "Ablehnen";
      t.privacy = "Datenschutz";
    }
    // ES
    else if (lang === "es" || lang.indexOf("es-") === 0) {
      t.text = "Usamos cookies para medir el tráfico (GA4) y mejorar el sitio. Puedes aceptar o rechazar la analítica.";
      t.accept = "Aceptar";
      t.reject = "Rechazar";
      t.privacy = "Privacidad";
    }
    // FR
    else if (lang === "fr" || lang.indexOf("fr-") === 0) {
      t.text = "Nous utilisons des cookies pour mesurer le trafic (GA4) et améliorer le site. Vous pouvez accepter ou refuser l’analytics.";
      t.accept = "Accepter";
      t.reject = "Refuser";
      t.privacy = "Confidentialité";
    }
    // NL-BE
    else if (lang === "nl-be" || lang.indexOf("nl-") === 0 || lang === "nl") {
      t.text = "We gebruiken cookies om verkeer te meten (GA4) en de site te verbeteren. Je kan analytics accepteren of weigeren.";
      t.accept = "Accepteren";
      t.reject = "Weigeren";
      t.privacy = "Privacy";
    }

    return t;
  }

  function getState() {
    try { return localStorage.getItem(KEY_STATE); } catch (e) { return null; }
  }

  function setState(val) {
    try {
      localStorage.setItem(KEY_STATE, val);
      localStorage.setItem(KEY_TS, new Date().toISOString());
    } catch (e) {}
  }

  // ---- Consent Mode v2 defaults ----
  function gtag() { window.dataLayer = window.dataLayer || []; window.dataLayer.push(arguments); }

  function setConsentDenied() {
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "denied",
      wait_for_update: 500
    });
  }

  function setConsentGranted() {
    gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
      functionality_storage: "granted",
      personalization_storage: "granted",
      security_storage: "granted"
    });
  }

  function ensureGtagLoader() {
    // If loader already present, skip
    if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);

    // init gtag
    gtag("js", new Date());
    // Do not send page_view until consent accepted:
    gtag("config", GA_ID, { send_page_view: false, anonymize_ip: true });
  }

  // ---- Banner helpers ----
  function findAcceptButton(banner) {
    return qs("cookie-accept") ||
      (banner ? banner.querySelector('[data-consent="accept"], .btn-accept, #accept, button[data-action="accept"]') : null);
  }

  function findRejectButton(banner) {
    return qs("cookie-reject") ||
      (banner ? banner.querySelector('[data-consent="reject"], .btn-reject, #reject, button[data-action="reject"]') : null);
  }

  function showBanner() {
    var layer = qs("cookie-consent-layer");
    var banner = qs("cookie-banner");
    if (!layer || !banner) return;

    var t = i18n();

    // Fill localized UI (support multiple markup variants)
    var msgEl =
      banner.querySelector(".cookie-text") ||
      banner.querySelector(".cookie-banner__msg") ||
      banner.querySelector("p");

    var privacyLink =
      banner.querySelector(".privacy-link") ||
      banner.querySelector(".cookie-banner__link") ||
      banner.querySelector('a[href*="privacy"]');

    var acceptBtn = findAcceptButton(banner);
    var rejectBtn = findRejectButton(banner);

    if (msgEl) msgEl.textContent = t.text;
    if (acceptBtn) acceptBtn.textContent = t.accept;
    if (rejectBtn) rejectBtn.textContent = t.reject;
    if (privacyLink) privacyLink.textContent = t.privacy;

    // Force visible + clickable (override aggressive CSS)
    layer.style.display = "block";
    banner.style.display = "block";
    layer.style.opacity = "1";
    banner.style.opacity = "1";
    layer.style.pointerEvents = "auto";
    banner.style.pointerEvents = "auto";
    layer.style.zIndex = "2147483646";
    banner.style.zIndex = "2147483647";

    layer.setAttribute("aria-hidden", "false");
  }

  function hideBanner() {
    var layer = qs("cookie-consent-layer");
    var banner = qs("cookie-banner");
    if (layer) {
      layer.style.display = "none";
      layer.style.pointerEvents = "none";
      layer.setAttribute("aria-hidden", "true");
    }
    if (banner) {
      banner.style.display = "none";
      banner.style.pointerEvents = "none";
    }
  }

  function wireButtons() {
    var banner = qs("cookie-banner");
    if (!banner) return;

    var acceptBtn = findAcceptButton(banner);
    var rejectBtn = findRejectButton(banner);

    if (acceptBtn && !acceptBtn.__vw_bound) {
      acceptBtn.__vw_bound = true;
      acceptBtn.addEventListener("click", function () {
        setState("granted");
        setConsentGranted();
        // Fire page_view AFTER consent
        try { gtag("event", "page_view"); } catch (e) {}
        hideBanner();
      }, { passive: true });
    }

    if (rejectBtn && !rejectBtn.__vw_bound) {
      rejectBtn.__vw_bound = true;
      rejectBtn.addEventListener("click", function () {
        setState("denied");
        // Keep analytics denied; no page_view
        hideBanner();
      }, { passive: true });
    }
  }

  function init() {
    // Always set default denied before anything else
    window.dataLayer = window.dataLayer || [];
    setConsentDenied();
    ensureGtagLoader();

    var state = getState();

    // If already granted, enable analytics + fire page_view once per load
    if (state === "granted") {
      setConsentGranted();
      try { gtag("event", "page_view"); } catch (e) {}
      hideBanner();
      return;
    }

    // If denied (or empty) -> show banner
    showBanner();
    wireButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
