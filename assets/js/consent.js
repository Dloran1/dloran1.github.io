(function(){
  if (document.getElementById('consent-banner')) return; // защита от дубля

  var KEY = 'vpnw_consent_v1';
  var saved = localStorage.getItem(KEY);

  if (saved) return; // уже согласился

  // CSS стили
  var css = `
  .consent-banner{
    position:fixed; inset:auto 12px 12px 12px;
    z-index:9999; border:1px solid rgba(140,140,160,.35);
    border-radius:12px; background:rgba(20,22,28,.98);
    color:#eaeaf1; box-shadow:0 10px 24px rgba(0,0,0,.35);
    font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  }
  .consent-inner{ padding:14px 16px; }
  .consent-inner h2{ margin:0 0 6px; font-size:1rem; }
  .consent-inner p{ margin:0 0 10px; line-height:1.45; font-size:.95rem; }
  .consent-inner a{ color:#9ec5ff; text-decoration:underline; }
  .consent-actions{ text-align:right; }
  .consent-actions .btn{ padding:8px 14px; border-radius:8px; border:0; cursor:pointer; }
  .consent-actions .btn.btn-primary{ background:#2E90FA; color:#fff; }
  .consent-inner .sep{ opacity:.5; margin:0 .5rem; }
  @media (min-width:840px){
    .consent-banner{ inset:auto 24px 24px auto; max-width:560px; }
  }
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // HTML баннер
  var banner = document.createElement('div');
  banner.id = 'consent-banner';
  banner.className = 'consent-banner';
  banner.innerHTML = `
    <div class="consent-inner">
      <h2 id="consent-title">Privacy & cookies</h2>
      <p>
        We use only <strong>essential cookies</strong> for basic site functionality. 
        Some <strong>affiliate links</strong> (e.g., VPN offers) may set a cookie <em>only if you click through</em>.
        No analytics or tracking cookies are set by us by default.
        <a href="/en-gb/privacy.html" rel="nofollow">Learn more</a>
        <span class="sep" aria-hidden="true">|</span>
        <a href="/pl/polityka-prywatnosci.html" rel="nofollow" lang="pl">Polityka prywatności</a>
      </p>
      <div class="consent-actions">
        <button type="button" id="consent-accept" class="btn btn-primary">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  // обработчик кнопки
  document.getElementById('consent-accept').addEventListener('click', function(){
    try {
      localStorage.setItem(KEY, JSON.stringify({status:'accepted', ts: Date.now()}));
    } catch(e){}
    banner.remove();
  });
})();