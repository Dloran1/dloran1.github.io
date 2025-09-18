(function(){
  // если футер уже есть с нужной ссылкой, выходим
  if(document.querySelector('.site-footer')) return;

  var footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <p>
      © 2025 VPN World · 
      <a href="/en-gb/privacy.html">Privacy & Cookies</a> · 
      <a href="/pl/polityka-prywatnosci.html" lang="pl">Polityka prywatności</a>
    </p>
  `;

  document.body.appendChild(footer);

  // простые стили, если нет в style.css
  var css = `
  .site-footer{
    margin:32px 0 16px;
    text-align:center;
    opacity:.8;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
    font-size:.9rem;
  }
  .site-footer a{ text-decoration:underline; color:#9ec5ff; }
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();