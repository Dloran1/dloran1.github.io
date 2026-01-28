/* VPN World — cookie-consent.js (canonical, self-healing)
   - Consent Mode v2 default denied
   - Ensures canonical markup exists (#cookie-consent-layer + #cookie-banner)
   - Persist choice in localStorage
   - Fire GA4 page_view only after Accept
*/

(function () {
  "use strict";

  var GA_ID = "G-EMR8C4TLVM"; // VPN World GA4

  // Storage keys
  var KEY_STATE = "vw_consent_state";   // "granted" | "denied"
  var KEY_TS = "vw_consent_ts";         // ISO string

  function qs(id) { return document.getElementById(id); }

  function getLang() {
    var html = document.documentElement;
    var lang = (html && html.getAttribute("lang")) ? html.getAttribute("lang").toLowerCase() : "en";
    return lang;
  }

  function i18n() {
    var lang = getLang();

    // Default EN (fallback)
    var t = {
      text: "We use cookies to measure traffic (GA4) and improve the site. You can accept or reject analytics.",
      accept: "Accept",
      reject: "Reject",
      privacy: "Privacy"
    };

    if (lang === "pl") {
      t.text = "Używamy plików cookie, aby mierzyć ruch (GA4) i ulepszać stronę. Możesz zaakceptować lub odrzucić analitykę.";
      t.accept = "Akceptuję";
      t.reject = "Odrzucam";
      t.privacy = "Prywatność";
    } else if (lang === "en-gb" || lang === "en") {
      t.text = "We use cookies to measure traffic (GA4) and improve the site. You can accept or reject analytics.";
      t.accept = "Accept";
      t.reject = "Reject";
      t.privacy = "Privacy";
    } else if (lang === "en-us") {
      t.text = "We use cookies to measure traffic (GA4) and improve the site. You can accept or reject analytics.";
      t.accept = "Accept";
      t.reject = "Reject";
      t.privacy = "Privacy";
    } else if (lang === "de") {
      t.text = "Wir verwenden Cookies, um den Traffic (GA4) zu messen und die Seite zu verbessern. Du kannst Analytics akzeptieren oder ablehnen.";
      t.accept = "Akzeptieren";
      t.reject = "Ablehnen";
      t.privacy = "Datenschutz";
    } else if (lang === "es") {
      t.text = "Usamos cookies para medir el tráfico (GA4) y mejorar el sitio. Puedes aceptar o rechazar la analítica.";
      t.accept = "Aceptar";
      t.reject = "Rechazar";
      t.privacy = "Privacidad";
    } else if (lang === "fr") {
      t.text = "Nous utilisons des cookies pour mesurer le trafic (GA4) et améliorer le site. Vous pouvez accepter ou refuser l’analytics.";
      t.accept = "Accepter";
      t.reject = "Refuser";
      t.privacy = "Confidentialité";
    } else if (lang === "nl-be") {
      t.text = "We gebruiken cookies om verkeer te meten (GA4) en de site te verbeteren. Je kan analytics accepteren of weigeren.";
      t.accept = "Accepteren";
      t.reject = "Weigeren";
      t.privacy = "Privacy";
    }

    return t;
  }

  function privacyHref() {
    var lang = getLang();
    if (lang === "pl") return "/privacy.html";
    if (lang === "en-gb") return "/en-gb/privacy.html";
    if (lang === "en-us") return "/en-us/privacy.html";
    if (lang === "de") return "/de/privacy.html";
    if (lang === "es") return "/es/privacy.html";
    if (lang === "fr") return "/fr/privacy.html";
    if (lang === "nl-be") return "/nl-be/privacy.html";
    return "/privacy.html";
  }

  function ensureMarkup() {
    // If markup already exists, just return refs
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
      banner.setAttribute("aria-label", "Cookie consent");

      banner.innerHTML = [
        '<div class="cookie-banner__inner">',
        '  <div class="cookie-banner__text">',
        '    <span class="cookie-banner__msg">We use cookies.</span> ',
        '    <a class="cookie-banner__link" href="' + privacyHref() + '" rel="nofollow">Privacy</a>',
        '  </div>',
        '  <div class="cookie-banner__actions">',
        '    <button id="cookie-accept" type="button">Accept</button>',
        '    <button id="cookie-reject" type="button">Reject</button>',
        '  </div>',
        '</div>'
      ].join("\n");

      document.body.appendChild(banner);
    }

    return { layer: layer, banner: banner };
  }

  function applyTexts() {
    var t = i18n();
    var msg = document.querySelector("#cookie-banner .cookie-banner__msg");
    var link = document.querySelector("#cookie-banner .cookie-banner__link");
    var acceptBtn = qs("cookie-accept");
    var rejectBtn = qs("cookie-reject");

    if (msg) msg.textContent = t.text;
    if (link) {
      link.textContent = t.privacy;
      link.setAttribute("href", privacyHref());
    }
    if (acceptBtn) acceptBtn.textContent = t.accept;
    if (rejectBtn) rejectBtn.textContent = t.reject;
  }

  function setConsentDefaultDenied() {
    // If gtag exists, set default denied. If not, do nothing (we'll load gtag on accept).
    if (typeof window.gtag === "function") {
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
  }

  function ensureGtagLoaded(cb) {
    // If already loaded, callback immediately.
    if (typeof window.gtag === "function") { cb(); return; }

    // Ensure dataLayer + gtag stub
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };

    // Inject loader if missing
    var already = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    if (!already) {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
      s.onload = cb;
      document.head.appendChild(s);
    } else {
      // loader exists but gtag not defined yet — run cb soon
      setTimeout(cb, 0);
    }
  }

  function show() {
    var layer = qs("cookie-consent-layer");
    var banner = qs("cookie-banner");
    if (!layer || !banner) return;

    layer.style.display = "block";
    layer.style.opacity = "1";
    layer.style.visibility = "visible";
    layer.setAttribute("aria-hidden", "false");

    banner.style.display = "block";
    banner.style.opacity = "1";
    banner.style.visibility = "visible";
  }

  function hide() {
    var layer = qs("cookie-consent-layer");
    var banner = qs("cookie-banner");
    if (layer) {
      layer.style.display = "none";
      layer.setAttribute("aria-hidden", "true");
    }
    if (banner) {
      banner.style.display = "none";
    }
  }

  function persist(state) {
    try {
      localStorage.setItem(KEY_STATE, state);
      localStorage.setItem(KEY_TS, new Date().toISOString());
    } catch (e) { /* ignore */ }
  }

  function readState() {
    try { return localStorage.getItem(KEY_STATE); } catch (e) { return null; }
  }

  function firePageViewAfterConsent() {
    ensureGtagLoaded(function () {
      // Configure GA and send page_view only after consent
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { send_page_view: true });
    });
  }

  function acceptConsent() {
    persist("granted");

    ensureGtagLoaded(function () {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "granted",
        functionality_storage: "granted",
        personalization_storage: "denied",
        security_storage: "granted"
      });

      firePageViewAfterConsent();
      hide();
    });
  }

  function rejectConsent() {
    persist("denied");

    if (typeof window.gtag === "function") {
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
    hide();
  }

  function wire() {
    // Ensure markup exists ALWAYS
    ensureMarkup();
    applyTexts();

    // default denied (if gtag already available)
    setConsentDefaultDenied();

    // Bind buttons
    var a = qs("cookie-accept");
    var r = qs("cookie-reject");

    if (a && !a.__vwBound) {
      a.__vwBound = true;
      a.addEventListener("click", function (e) { e.preventDefault(); acceptConsent(); });
    }
    if (r && !r.__vwBound) {
      r.__vwBound = true;
      r.addEventListener("click", function (e) { e.preventDefault(); rejectConsent(); });
    }

    // Show only if no decision
    var s = readState();
    if (s === "granted") {
      // Already accepted: do nothing (page_view already sent on prior accept)
      hide();
    } else if (s === "denied") {
      hide();
    } else {
      show();
    }
  }

  // Init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }

  // Expose (optional)
  window.acceptConsent = acceptConsent;
  window.rejectConsent = rejectConsent;

})();
