/* VPN World — Cookie Consent (Consent Mode v2) — single canonical layer
   KEY: vpnw_cookie_consent_v1
   Values: "granted" | "denied"

   Gold Rules:
   - Only ONE banner layer in the whole project
   - Default = denied
   - page_view only AFTER Accept
   - Kill any legacy/duplicate banners automatically
*/

(function () {
  "use strict";

  var KEY = "vpnw_cookie_consent_v1";
  var PV_KEY = "vpnw_ga_pageview_sent_v1";

  /* ---------------------------
     Locale helpers
  --------------------------- */

  function lang() {
    return (
      (document.documentElement.getAttribute("lang") || "en")
        .toLowerCase()
        .trim()
    );
  }

  function t() {
    var l = lang();

    if (l === "en" || l.indexOf("en-") === 0) {
      return {
        text:
          "We use cookies to measure traffic and improve the site. You can accept or reject analytics cookies. Necessary cookies are always on.",
        accept: "Accept",
        reject: "Reject",
        more: "Privacy",
      };
    }

    if (l.indexOf("pl") === 0) {
      return {
        text:
          "Używamy plików cookie do pomiaru ruchu i ulepszania serwisu. Możesz zaakceptować lub odrzucić cookies analityczne. Niezbędne cookies są zawsze aktywne.",
        accept: "Akceptuję",
        reject: "Odrzucam",
        more: "Prywatność",
      };
    }

    if (l.indexOf("de") === 0) {
      return {
        text:
          "Wir verwenden Cookies, um den Traffic zu messen und die Website zu verbessern. Du kannst Analyse-Cookies akzeptieren oder ablehnen. Notwendige Cookies sind immer aktiv.",
        accept: "Akzeptieren",
        reject: "Ablehnen",
        more: "Datenschutz",
      };
    }

    if (l.indexOf("es") === 0) {
      return {
        text:
          "Usamos cookies para medir el tráfico y mejorar el sitio. Puedes aceptar o rechazar cookies de analítica. Las cookies necesarias siempre están activas.",
        accept: "Aceptar",
        reject: "Rechazar",
        more: "Privacidad",
      };
    }

    if (l.indexOf("fr") === 0) {
      return {
        text:
          "Nous utilisons des cookies pour mesurer le trafic et améliorer le site. Vous pouvez accepter ou refuser les cookies d’analyse. Les cookies nécessaires sont toujours actifs.",
        accept: "Accepter",
        reject: "Refuser",
        more: "Confidentialité",
      };
    }

    if (l.indexOf("nl") === 0) {
      return {
        text:
          "We gebruiken cookies om verkeer te meten en de site te verbeteren. Je kan analytics-cookies accepteren of weigeren. Noodzakelijke cookies staan altijd aan.",
        accept: "Accepteren",
        reject: "Weigeren",
        more: "Privacy",
      };
    }

    return {
      text:
        "We use cookies to measure traffic and improve the site. You can accept or reject analytics cookies. Necessary cookies are always on.",
      accept: "Accept",
      reject: "Reject",
      more: "Privacy",
    };
  }

  function privacyHref() {
    var l = lang();
    if (l.indexOf("pl") === 0) return "/privacy.html";
    if (l.indexOf("en-gb") === 0) return "/en-gb/privacy.html";
    if (l.indexOf("en-us") === 0) return "/en-us/privacy.html";
    if (l.indexOf("de") === 0) return "/de/privacy.html";
    if (l.indexOf("es") === 0) return "/es/privacy.html";
    if (l.indexOf("fr") === 0) return "/fr/privacy.html";
    if (l.indexOf("nl") === 0) return "/nl-be/privacy.html";
    return "/privacy.html";
  }

  /* ---------------------------
     Storage helpers
  --------------------------- */

  function getStored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function setStored(val) {
    try {
      localStorage.setItem(KEY, val);
    } catch (e) {}
  }

  function isPageviewSent() {
    try {
      return localStorage.getItem(PV_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function setPageviewSent() {
    try {
      localStorage.setItem(PV_KEY, "1");
    } catch (e) {}
  }

  /* ---------------------------
     Consent Mode v2 Update
  --------------------------- */

  function gtagUpdate(granted) {
    if (typeof window.gtag !== "function") return;

    var state = granted ? "granted" : "denied";

    window.gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
      functionality_storage: state,
      personalization_storage: state,
      security_storage: "granted",
    });

    if (granted && !isPageviewSent()) {
      window.gtag("event", "page_view", {
        page_location: location.href,
        page_path: location.pathname,
        page_title: document.title,
      });
      setPageviewSent();
    }
  }

  /* ---------------------------
     HARD KILL legacy banners
  --------------------------- */

  function killLegacyBanners() {
    try {
      var junkSelectors = [
        "#cookieConsent",
        "#cookie-consent",
        "#cookie-banner-layer",
        "#cookie-layer",
        ".cookie-consent",
        ".cookie-banner",
        ".cookieconsent",
        ".cc-window",
        ".cc-banner",
        ".cc-revoke",
      ];

      junkSelectors.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
          if (!el) return;
          if (el.id === "cookie-consent-layer") return;
          if (el.id === "cookie-banner") return;
          el.remove();
        });
      });

      // Kill the exact legacy PL sentence if injected as a floating bar
      var legacyText = "Analityka jest domyślnie wyłączona";
      document.querySelectorAll("body *").forEach(function (el) {
        if (!el || !el.innerText) return;
        if (el.id === "cookie-consent-layer") return;
        if (el.id === "cookie-banner") return;

        if (el.innerText.trim().includes(legacyText)) {
          el.remove();
        }
      });
    } catch (e) {}
  }

  /* ---------------------------
     Banner creation
  --------------------------- */

  function ensureBanner() {
    var layer = document.getElementById("cookie-consent-layer");
    var banner = document.getElementById("cookie-banner");

    if (layer && banner) return { layer: layer, banner: banner };

    var copy = t();

    layer = document.createElement("div");
    layer.id = "cookie-consent-layer";
    layer.setAttribute("role", "dialog");
    layer.setAttribute("aria-modal", "true");

    // FORCE clickability always
    layer.style.position = "fixed";
    layer.style.left = "0";
    layer.style.right = "0";
    layer.style.bottom = "0";
    layer.style.zIndex = "999999";
    layer.style.pointerEvents = "auto";

    banner = document.createElement("div");
    banner.id = "cookie-banner";

    var p = document.createElement("p");
    p.textContent = copy.text;

    var actions = document.createElement("div");
    actions.className = "cookie-actions";

    var more = document.createElement("a");
    more.href = privacyHref();
    more.textContent = copy.more;

    var btnReject = document.createElement("button");
    btnReject.id = "cookie-reject";
    btnReject.type = "button";
    btnReject.textContent = copy.reject;

    var btnAccept = document.createElement("button");
    btnAccept.id = "cookie-accept";
    btnAccept.type = "button";
    btnAccept.textContent = copy.accept;

    actions.appendChild(more);
    actions.appendChild(btnReject);
    actions.appendChild(btnAccept);

    banner.appendChild(p);
    banner.appendChild(actions);
    layer.appendChild(banner);

    document.body.appendChild(layer);

    return { layer: layer, banner: banner };
  }

  function show() {
    ensureBanner().layer.style.display = "block";
  }

  function hide() {
    var el = document.getElementById("cookie-consent-layer");
    if (el) el.style.display = "none";
  }

  /* ---------------------------
     Wire buttons
  --------------------------- */

  function wireButtons() {
    var acceptBtn = document.getElementById("cookie-accept");
    var rejectBtn = document.getElementById("cookie-reject");

    if (acceptBtn) {
      acceptBtn.onclick = function () {
        window.acceptConsent();
      };
    }

    if (rejectBtn) {
      rejectBtn.onclick = function () {
        window.rejectConsent();
      };
    }
  }

  /* ---------------------------
     Public API
  --------------------------- */

  window.acceptConsent = function () {
    setStored("granted");
    hide();
    gtagUpdate(true);
  };

  window.rejectConsent = function () {
    setStored("denied");
    hide();
    gtagUpdate(false);
  };

  /* ---------------------------
     Init
  --------------------------- */

  function init() {
    // 1) Kill any old banners first
    killLegacyBanners();

    // 2) Create canonical banner
    ensureBanner();
    wireButtons();

    // 3) Apply stored choice
    var v = getStored();

    if (v === "granted") {
      hide();
      gtagUpdate(true);
      return;
    }

    if (v === "denied") {
      hide();
      gtagUpdate(false);
      return;
    }

    // No choice => show banner, default denied
    show();
    gtagUpdate(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
