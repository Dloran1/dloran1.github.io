(function () {
  const banner = document.getElementById('cookie-banner');

  function hideBanner() {
    if (banner) banner.style.display = 'none';
  }

  window.acceptConsent = function () {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'denied',
        security_storage: 'granted'
      });

      // page_view только после согласия
      gtag('event', 'page_view');
    }

    localStorage.setItem('vpnworld_cookie_consent', 'accepted');
    hideBanner();
  };

  window.rejectConsent = function () {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted'
      });
    }

    localStorage.setItem('vpnworld_cookie_consent', 'rejected');
    hideBanner();
  };

  // init
  document.addEventListener('DOMContentLoaded', function () {
    const state = localStorage.getItem('vpnworld_cookie_consent');
    if (state === 'accepted' || state === 'rejected') {
      hideBanner();
    }
  });
})();