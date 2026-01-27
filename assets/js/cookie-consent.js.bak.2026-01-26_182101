/* VPN World — Cookie Consent (Consent Mode v2) — single canonical layer
   KEY: vpnw_cookie_consent_v1
   Values: "granted" | "denied"
*/
(function () {
  "use strict";

  var KEY = "vpnw_cookie_consent_v1";
  var PV_KEY = "vpnw_ga_pageview_sent_v1";

  function lang() {
    var l = (document.documentElement.getAttribute("lang") || "en").toLowerCase();
    return l;
  }

  function t() {
    // Short, legal-safe copy; keep language consistent per locale.
    // Note: “necessary cookies” phrasing only; no overpromises.
    var l = lang();

    // Normalize to our set (pl, en-gb, en-us, de, es, fr, nl-be)
    // Some pages might use "nl" or "nl-BE" – we handle both.
    if (l === "en" || l.indexOf("en-") === 0) {
      // en-gb / en-us
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
      // nl-be
      return {
        text:
          "We gebruiken cookies om verkeer te meten en de site te verbeteren. Je kan analytics-cookies accepteren of weigeren. Noodzakelijke cookies staan altijd aan.",
        accept: "Accepteren",
        reject: "Weigeren",
        more: "Privacy",
      };
    }

    // fallback
    return {
      text:
        "We use cookies to measure traffic and improve the site. You can accept or reject analytics cookies. Necessary cookies are always on.",
      accept: "Accept",
      reject: "Reject",
      more: "Privacy",
    };
  }

  function privacyHref() {
    // project has localized privacy pages; keep paths stable
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

  function setPageviewSent() {
    try {
      localStorage.setItem(PV_KEY, "1");
    } catch (e) {}
  }

  function isPageviewSent() {
    try {
      return localStorage.getItem(PV_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function ensureBanner() {
    var layer = document.getElementById("cookie-consent-layer");
    var banner = document.getElementById("cookie-banner");

    if (layer && banner) return { layer: layer, banner: banner };

    // Create canonical single layer
    var copy = t();

    layer = document.createElement("div");
    layer.id = "cookie-consent-layer";
    layer.setAttribute("role", "dialog");
    layer.setAttribute("aria-modal", "true");
    layer.setAttribute("aria-label", "Cookie consent");

    banner = document.createElement("div");
    banner.id = "cookie-banner";

    // Minimal inline-safe structure; style is in CSS, but this works even if CSS is missing.
    var p = document.createElement("p");
    p.textContent = copy.text;

    var actions = document.createElement("div");
    actions.className = "cookie-actions";

    var more = document.createElement("a");
    more.className = "cookie-more";
    more.href = privacyHref();
    more.textContent = copy.more;

    var btnAccept = document.createElement("button");
    btnAccept.id = "cookie-accept";
    btnAccept.type = "button";
    btnAccept.textContent = copy.accept;

    var btnReject = document.createElement("button");
    btnReject.id = "cookie-reject";
    btnReject.type = "button";
    btnReject.textContent = copy.reject;

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
    var el = ensureBanner().layer;
    el.style.display = "block";
    el.style.pointerEvents = "auto";
  }

  function hide() {
    var el = document.getElementById("cookie-consent-layer");
    if (!el) return;
    el.style.display = "none";
    el.style.pointerEvents = "none";
  }

  function gtagUpdate(granted) {
    // Consent Mode v2 keys (full set)
    if (typeof window.gtag !== "function") return;

    var state = granted ? "granted" : "denied";
    window.gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
      functionality_storage: state,
      personalization_storage: state,
      security_storage: "granted", // allow security storage even if analytics denied
    });

    if (granted && !isPageviewSent()) {
      // Fire page_view only after consent is granted
      window.gtag("event", "page_view", {
        page_location: location.href,
        page_path: location.pathname,
        page_title: document.title,
      });
      setPageviewSent();
    }
  }

  function applyInitial() {
    var v = getStored();

    // If user already chose
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

    // No choice yet => show banner, keep denied by default (head may also set default)
    show();
    gtagUpdate(false);
  }

  function wireButtons() {
    var acceptBtn = document.getElementById("cookie-accept");
    var rejectBtn = document.getElementById("cookie-reject");

    if (acceptBtn && !acceptBtn.__vpnwBound) {
      acceptBtn.__vpnwBound = true;
      acceptBtn.addEventListener("click", function () {
        window.acceptConsent();
      });
    }

    if (rejectBtn && !rejectBtn.__vpnwBound) {
      rejectBtn.__vpnwBound = true;
      rejectBtn.addEventListener("click", function () {
        window.rejectConsent();
      });
    }
  }

  // Expose canonical functions
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

  // Init
  function init() {
    ensureBanner();
    wireButtons();
    applyInitial();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
