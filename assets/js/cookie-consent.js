/* VPN World — cookie-consent.js (canonical, self-healing, stable)
   - Consent Mode v2 default denied
   - Ensures canonical markup exists (#cookie-consent-layer + #cookie-banner)
   - Removes legacy/old banners that conflict
   - Persist choice in localStorage (vw_consent_state/vw_consent_ts)
   - Fire GA4 page_view only after Accept
*/

(function () {
  "use strict";

  var GA_ID = "G-EMR8C4TLVM"; // VPN World GA4

  // Storage keys
  var KEY_STATE = "vw_consent_state";   // "granted" | "denied"
  var KEY_TS = "vw_consent_ts";         // ISO string

  function qs(id) { return document.getElementById(id); }

  function getLocalePathPrefix() {
    // Maps current page to locale root: "", "/en-gb", "/en-us", "/de", "/es", "/fr", "/nl-be"
    var p = (location && location.pathname) ? location.pathname : "/";
    var m = p.match(/^\/(en-gb|en-us|de|es|fr|nl-be)(\/|$)/i);
    return m ? ("/" + m[1].toLowerCase()) : "";
  }

  function getLang() {
    var html = document.documentElement;
    var lang = (html && html.getAttribute("lang")) ? html.getAttribute("lang").toLowerCase() : "en";
    return lang;
  }

  function i18n() {
    // IMPORTANT: banner text/buttons are per-locale language (single-language rule)
    var lang = getLang();
    var prefix = getLocalePathPrefix();
    var privacyHref = prefix + "/privacy.html";

    // Defaults: EN
    var t = {
      text: "We use cookies to measure traffic (GA4) and improve the site. You can accept or reject analytics.",
      accept: "Accept",
      reject: "Reject",
      privacy: "Privacy",
      privacyHref: privacyHref,
      aria: "Cookie consent"
    };

    if (lang === "pl") {
      t.text = "Używamy plików cookie, aby mierzyć ruch (GA4) i ulepszać stronę. Możesz zaakceptować lub odrzucić analitykę.";
      t.accept = "Akceptuję";
      t.reject = "Odrzucam";
      t.privacy = "Prywatność";
      t.aria = "Zgoda na pliki cookie";
    } else if (lang === "nl-be") {
      t.text = "We gebruiken cookies om verkeer te meten (GA4) en de site te verbeteren. Je kunt analytics accepteren of weigeren.";
      t.accept = "Accepteren";
      t.reject = "Weigeren";
      t.privacy = "Privacy";
      t.aria = "Cookie toestemming";
    } else if (lang === "de") {
      t.text = "Wir verwenden Cookies, um den Traffic zu messen (GA4) und die Seite zu verbessern. Du kannst Analytics akzeptieren oder ablehnen.";
      t.accept = "Akzeptieren";
      t.reject = "Ablehnen";
      t.privacy = "Datenschutz";
      t.aria = "Cookie-Einwilligung";
    } else if (lang === "es") {
      t.text = "Usamos cookies para medir el tráfico (GA4) y mejorar el sitio. Puedes aceptar o rechazar la analítica.";
      t.accept = "Aceptar";
      t.reject = "Rechazar";
      t.privacy = "Privacidad";
      t.aria = "Consentimiento de cookies";
    } else if (lang === "fr") {
      t.text = "Nous utilisons des cookies pour mesurer le trafic (GA4) et améliorer le site. Vous pouvez accepter ou refuser l’analytique.";
      t.accept = "Accepter";
      t.reject = "Refuser";
      t.privacy = "Confidentialité";
      t.aria = "Consentement cookies";
    } else if (lang === "en-gb" || lang === "en-us" || lang === "en") {
      // keep default EN
    }

    // If privacy page missing in some locale, still keep link (won't 404 if file exists).
    return t;
  }

  function removeLegacyBanners() {
    // Remove known legacy banners (mini bar with OK, old ids/classes)
    // We only remove nodes that are NOT our canonical ids.
    var selectors = [
      ".cookie-consent",
      ".cookieConsent",
      ".cookie-popup",
      ".cookiePopup",
      ".consent-banner",
      "#cookiePopup",
      "#cookie-consent",
      "#cookieConsent",
      "#gdpr-cookie-message",
      "#cookie-bar",
      "#cookieBar",
      ".cookie-bar",
      ".gdpr",
      ".gdpr-banner"
    ];

    try {
      var list = [];
      selectors.forEach(function (s) {
        document.querySelectorAll(s).forEach(function (el) { list.push(el); });
      });

      list.forEach(function (el) {
        if (!el) return;
        if (el.id === "cookie-banner" || el.id === "cookie-consent-layer") return;
        el.remove();
      });

      // Also remove “OK-only” custom mini bars by text signature
      document.querySelectorAll("button, a, div, span, p").forEach(function (el) {
        if (!el || !el.textContent) return;
        var txt = el.textContent.trim();
        if (txt === "OK" || txt === "Ok" || txt === "ok") {
          // If parent looks like cookie bar and is not our banner, remove parent container
          var parent = el.closest(".cookie, .cookie-banner, .cookiebar, .cookie-bar, .consent, #cookie, #cookies");
          if (parent && parent.id !== "cookie-banner" && parent.id !== "cookie-consent-layer") {
            parent.remove();
          }
        }
      });
    } catch (e) {}
  }

  function ensureCanonicalMarkup() {
    // Create #cookie-consent-layer and #cookie-banner if missing
    var layer = qs("cookie-consent-layer");
    var banner = qs("cookie-banner");

    if (!layer) {
      layer = document.createElement("div");
      layer.id = "cookie-consent-layer";
      layer.className = "cookie-layer";
      layer.setAttribute("aria-hidden", "true");
    }

    if (!banner) {
      var t = i18n();

      banner = document.createElement("div");
      banner.id = "cookie-banner";
      banner.className = "cookie-banner";
      banner.setAttribute("role", "dialog");
      banner.setAttribute("aria-live", "polite");
      banner.setAttribute("aria-label", t.aria);

      banner.innerHTML =
        '<div class="cookie-banner__inner">' +
          '<div class="cookie-banner__text">' +
            '<span class="cookie-banner__msg"></span> ' +
            '<a class="cookie-banner__link" rel="nofollow"></a>' +
          '</div>' +
          '<div class="cookie-banner__actions">' +
            '<button id="cookie-accept" type="button"></button>' +
            '<button id="cookie-reject" type="button"></button>' +
          '</div>' +
        '</div>';

      // Fill i18n content
      banner.querySelector(".cookie-banner__msg").textContent = t.text;
      var link = banner.querySelector(".cookie-banner__link");
      link.textContent = t.privacy;
      link.href = t.privacyHref;

      qs("cookie-accept") && (qs("cookie-accept").textContent = t.accept);
      qs("cookie-reject") && (qs("cookie-reject").textContent = t.reject);
    } else {
      // If banner exists but has placeholder EN text, refresh i18n safely
      try {
        var t2 = i18n();
        var msg = banner.querySelector(".cookie-banner__msg");
        var link2 = banner.querySelector(".cookie-banner__link");
        var aBtn = qs("cookie-accept");
        var rBtn = qs("cookie-reject");
        if (msg) msg.textContent = t2.text;
        if (link2) { link2.textContent = t2.privacy; link2.href = t2.privacyHref; }
        if (aBtn) aBtn.textContent = t2.accept;
        if (rBtn) rBtn.textContent = t2.reject;
        banner.setAttribute("aria-label", t2.aria);
      } catch (e) {}
    }

    // Append safely to body (at end)
    if (document.body) {
      if (!document.body.contains(layer)) document.body.appendChild(layer);
      if (!document.body.contains(banner)) document.body.appendChild(banner);
    }

    return { layer: layer, banner: banner };
  }

  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function setConsentDefaultDenied() {
    gtag("consent", "default", {
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
    gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
      functionality_storage: "granted",
      personalization_storage: "denied",
      security_storage: "granted"
    });
  }

  function setConsentDenied() {
    gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "granted",
      personalization_storage: "denied",
      security_storage: "granted"
    });
  }

  function loadGtagOnce() {
    if (window.__vw_gtag_loaded) return;
    window.__vw_gtag_loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || gtag;

    setConsentDefaultDenied();

    // load gtag.js
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);

    // init config WITHOUT page_view (we send after consent)
    gtag("js", new Date());
    gtag("config", GA_ID, { send_page_view: false, anonymize_ip: true });
  }

  function showBanner(ui) {
    if (!ui || !ui.banner || !ui.layer) return;

    ui.layer.setAttribute("aria-hidden", "false");
    ui.banner.setAttribute("aria-hidden", "false");

    // Force visible (beats weird inline/legacy styles)
    ui.layer.style.display = "block";
    ui.layer.style.opacity = "1";
    ui.layer.style.visibility = "visible";

    ui.banner.style.display = "block";
    ui.banner.style.opacity = "1";
    ui.banner.style.visibility = "visible";
  }

  function hideBanner(ui) {
    if (!ui || !ui.banner || !ui.layer) return;

    ui.layer.setAttribute("aria-hidden", "true");
    ui.banner.setAttribute("aria-hidden", "true");

    ui.layer.style.display = "none";
    ui.banner.style.display = "none";
  }

  function persist(state) {
    try {
      localStorage.setItem(KEY_STATE, state);
      localStorage.setItem(KEY_TS, new Date().toISOString());
    } catch (e) {}
  }

  function wireButtons(ui) {
    var a = qs("cookie-accept");
    var r = qs("cookie-reject");
    if (!a || !r) return;

    a.addEventListener("click", function () {
      persist("granted");
      setConsentGranted();
      // page_view only AFTER accept
      try { gtag("event", "page_view"); } catch (e) {}
      hideBanner(ui);
    }, { passive: true });

    r.addEventListener("click", function () {
      persist("denied");
      setConsentDenied();
      hideBanner(ui);
    }, { passive: true });
  }

  function init() {
    // 1) always load gtag/consent default denied
    loadGtagOnce();

    // 2) remove legacy banners (the OK mini-bar etc.)
    removeLegacyBanners();

    // 3) ensure canonical markup exists in DOM
    var ui = ensureCanonicalMarkup();

    // 4) if no choice yet => SHOW and keep visible (no flicker)
    var state = null;
    try { state = localStorage.getItem(KEY_STATE); } catch (e) {}

    if (state === "granted") {
      setConsentGranted();
      try { gtag("event", "page_view"); } catch (e) {}
      hideBanner(ui);
    } else if (state === "denied") {
      setConsentDenied();
      hideBanner(ui);
    } else {
      // null/unknown => show and wait
      showBanner(ui);
      wireButtons(ui);
    }

    // 5) safety re-check after a tick (guards against scripts that replace DOM)
    setTimeout(function () {
      removeLegacyBanners();
      var ui2 = ensureCanonicalMarkup();
      var st2 = null;
      try { st2 = localStorage.getItem(KEY_STATE); } catch (e) {}
      if (!st2) {
        showBanner(ui2);
        wireButtons(ui2);
      }
    }, 250);
  }

  // Run after DOM is ready (defer should be enough, but we harden)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
