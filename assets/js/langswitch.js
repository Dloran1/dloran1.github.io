(function () {
  // --- Helpers --------------------------------------------------------------
  function normPath(path) {
    // нормализуем index.html ↔ /
    if (path.endsWith('/index.html')) return path.slice(0, -'index.html'.length);
    return path;
  }
  function join(...parts) {
    return parts.join('/').replace(/\/{2,}/g, '/');
  }
  function withOrigin(path) {
    var loc = window.location;
    var origin = loc.origin || (loc.protocol + '//' + loc.host);
    return origin + path;
  }

  var loc = window.location;
  var currentPath = normPath(loc.pathname);

  // --- Detect language & compute counterpart -------------------------------
  // Cases:
  // PL home:            "/"                    ↔ EN home:        "/en-gb/"
  // PL blog list:       "/blog/"               ↔ EN blog list:   "/en-gb/blog/"
  // PL article:         "/blog/slug.html"      ↔ EN article:     "/en-gb/blog/slug.html"
  // EN home:            "/en-gb/"              ↔ PL home:        "/"
  // EN blog list:       "/en-gb/blog/"         ↔ PL blog list:   "/blog/"
  // EN article:         "/en-gb/blog/slug.html"↔ PL article:     "/blog/slug.html"

  var isEN = currentPath === '/en-gb/' ||
             currentPath.startsWith('/en-gb/blog/');

  var selfLang = isEN ? 'en-GB' : 'pl';
  var altLang  = isEN ? 'pl'    : 'en-GB';

  function counterpartPath(path) {
    // Home
    if (path === '/') return '/en-gb/';
    if (path === '/en-gb/') return '/';

    // Blog lists
    if (path === '/blog/') return '/en-gb/blog/';
    if (path === '/en-gb/blog/') return '/blog/';

    // Articles
    if (path.startsWith('/en-gb/blog/')) {
      return path.replace(/^\/en-gb\/blog\//, '/blog/');
    }
    if (path.startsWith('/blog/')) {
      return path.replace(/^\/blog\//, '/en-gb/blog/');
    }

    // Fallback: try mirroring folder
    return isEN ? path.replace(/^\/en-gb\//, '/') : '/en-gb' + path;
  }

  var altPath = normPath(counterpartPath(currentPath));
  var selfAbs = withOrigin(currentPath);
  var altAbs  = withOrigin(altPath);

  // --- Insert hreflang tags -----------------------------------------------
  try {
    var head = document.head || document.getElementsByTagName('head')[0];
    // rel=alternate self
    var linkSelf = document.createElement('link');
    linkSelf.setAttribute('rel', 'alternate');
    linkSelf.setAttribute('hreflang', selfLang);
    linkSelf.setAttribute('href', selfAbs);
    head.appendChild(linkSelf);

    // rel=alternate alternate lang
    var linkAlt = document.createElement('link');
    linkAlt.setAttribute('rel', 'alternate');
    linkAlt.setAttribute('hreflang', altLang);
    linkAlt.setAttribute('href', altAbs);
    head.appendChild(linkAlt);

    // x-default (на главных & блог-листах укажем на PL главную)
    if (currentPath === '/' || currentPath === '/en-gb/' ||
        currentPath === '/blog/' || currentPath === '/en-gb/blog/') {
      var linkXd = document.createElement('link');
      linkXd.setAttribute('rel', 'alternate');
      linkXd.setAttribute('hreflang', 'x-default');
      linkXd.setAttribute('href', withOrigin('/'));
      head.appendChild(linkXd);
    }
  } catch (e) {}

  // --- Build UI (only if counterpart exists) -------------------------------
  function injectSwitcher(url, label) {
    // styles
    var css = `
    .langswitch{position:fixed;top:12px;right:12px;z-index:9998}
    .langswitch a{display:inline-block;padding:6px 10px;border:1px solid rgba(140,140,160,.35);
      border-radius:8px;background:rgba(20,22,28,.85);backdrop-filter:saturate(140%) blur(2px);
      color:#eaeaf1;text-decoration:none;font:500 13px/1.2 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
    .langswitch a:hover{background:rgba(46,144,250,.12);border-color:rgba(46,144,250,.6)}
    @media (max-width:640px){ .langswitch{top:auto;bottom:12px;right:12px} }
    `;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // element
    var nav = document.createElement('nav');
    nav.className = 'langswitch';
    var a = document.createElement('a');
    a.href = url;
    a.setAttribute('rel','alternate');
    a.setAttribute('hreflang', altLang);
    a.textContent = label;
    nav.appendChild(a);
    document.body.appendChild(nav);
  }

  // label by target lang
  var label = isEN ? 'PL / Polski' : 'EN / English (UK)';

  // HEAD check with timeout (don’t block UI)
  var aborted = false;
  var timer = setTimeout(function(){ aborted = true; }, 2000);

  fetch(altAbs, { method: 'HEAD', cache: 'no-store' })
    .then(function (res) {
      clearTimeout(timer);
      if (!aborted && res.ok) injectSwitcher(altAbs, label);
    })
    .catch(function(){
      clearTimeout(timer);
      // Не показываем переключатель, если 404/ошибка — избежим битых ссылок
    });

})();