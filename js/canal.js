/**
 * Atribuição por canal na landing.
 *
 * Um link como https://trakapp.com.br/?c=pin faz os botões da App Store
 * saírem com ct=pinterest em vez do ct=LP padrão.
 *
 * Por que existe: os slugs de redirect (/pin, /ig, …) resolvem atribuição
 * em bio de perfil, mas o Pinterest bloqueia como spam link que sai do
 * domínio direto pra loja de app. Então o pin aponta pra uma página real
 * do domínio reivindicado e a atribuição viaja no parâmetro.
 *
 * O canal fica na sessão: se a pessoa navegar pra outra página do site
 * antes de clicar no botão, a atribuição não se perde.
 */
(function () {
  'use strict';

  // Allowlist: só estes viram ct=. Qualquer outro valor é ignorado e o
  // botão fica no ct=LP — nada do que vem da URL entra no link sem passar
  // por aqui.
  var CANAIS = {
    pin: 'pinterest',
    ig: 'instagram',
    tt: 'tiktok1',
    tt2: 'tiktok2',
    yt: 'youtube',
    x: 'twitter',
    rd: 'reddit',
    th: 'threads',
    fb: 'facebook',
  };

  var CHAVE = 'trak_canal';

  function lerCanal() {
    var ct = null;

    try {
      var p = new URLSearchParams(window.location.search).get('c');
      if (p && Object.prototype.hasOwnProperty.call(CANAIS, p)) ct = CANAIS[p];
    } catch (e) {
      /* navegador sem URLSearchParams: segue no ct=LP */
    }

    try {
      if (ct) sessionStorage.setItem(CHAVE, ct);
      else ct = sessionStorage.getItem(CHAVE);
    } catch (e) {
      /* sessionStorage bloqueado (modo privado): usa só o da URL */
    }

    return ct;
  }

  function aplicar(ct) {
    var links = document.querySelectorAll('a[href*="apps.apple.com"]');
    for (var i = 0; i < links.length; i++) {
      links[i].href = links[i].href.replace(/([?&]ct=)[^&]*/, '$1' + encodeURIComponent(ct));
    }
  }

  var canal = lerCanal();
  if (!canal) return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { aplicar(canal); });
  } else {
    aplicar(canal);
  }
})();
