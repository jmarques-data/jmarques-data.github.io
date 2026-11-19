// Hub do Juan · comportamento da página
(() => {
  // Links da Kiwify: troque KIWIFY_GRUPO e KIWIFY_INDIVIDUAL no index.html pelos links reais (https://).
  // Enquanto não houver link real, o botão fica desativado e o selo do topo não diz que a mentoria está aberta.
  let abertos = 0;
  document.querySelectorAll('a[data-kiwify]').forEach(a => {
    if (/^https:\/\//.test(a.getAttribute('href') || '')) { abertos++; return; }
    // Sem link real, vira um texto (span): um <a> sem destino não é um link válido para buscadores.
    const aviso = document.createElement('span');
    aviso.className = a.className + ' disabled';
    aviso.dataset.kiwify = a.dataset.kiwify;
    aviso.textContent = 'Inscrições abrem em breve';
    a.replaceWith(aviso);
  });
  const status = document.getElementById('status');
  if (status && abertos) status.lastChild.textContent = 'Inscrições abertas';

  // Botão "Tentar de novo" na página offline.html
  const tentarNovamente = document.getElementById('tentarNovamente');
  if (tentarNovamente) {
    tentarNovamente.addEventListener('click', e => {
      e.preventDefault();
      location.reload();
    });
  }

  // Vídeo "a mentoria por dentro": 16:9 no computador e 9:16 no celular
  const modal = document.getElementById('videoModal');
  const botaoVideo = document.getElementById('openVideo');
  if (modal && botaoVideo) {
    const box = modal.querySelector('.modal-box'), video = document.getElementById('mvideo');
    const vertical = () => window.matchMedia('(max-width: 700px), (orientation: portrait)').matches;
    function openVideo() {
      const v = vertical();
      box.classList.toggle('vertical', v);
      const src = v ? 'video/mentoria-9x16.mp4' : 'video/mentoria-16x9.mp4';
      if (video.getAttribute('src') !== src) { video.src = src; video.poster = v ? 'video/capa-9x16.webp' : 'video/capa-16x9.webp'; }
      modal.hidden = false; document.body.style.overflow = 'hidden';
      video.play().catch(() => {});
      modal.querySelector('.close').focus();
    }
    function closeVideo() { video.pause(); modal.hidden = true; document.body.style.overflow = ''; botaoVideo.focus(); }
    botaoVideo.addEventListener('click', openVideo);
    modal.querySelector('.close').addEventListener('click', closeVideo);
    modal.addEventListener('click', e => { if (e.target === modal) closeVideo(); });
    document.addEventListener('keydown', e => {
      if (modal.hidden) return;
      if (e.key === 'Escape') { closeVideo(); return; }
      if (e.key !== 'Tab') return;
      // Mantém o foco dentro do vídeo aberto (botão fechar <-> player)
      const focaveis = [modal.querySelector('.close'), video];
      const i = focaveis.indexOf(document.activeElement);
      e.preventDefault();
      focaveis[(i + (e.shiftKey ? -1 : 1) + focaveis.length) % focaveis.length].focus();
    });
  }

  // Service Worker: registra depois do evento load, com try/catch silencioso
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      try {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
      } catch {}
    });
  }

  // Dica discreta de instalação no iPhone (só no Safari do iOS quando não estiver em modo app)
  const ua = navigator.userAgent || '';
  const ehIOS = /iPhone|iPod|iPad/i.test(ua);
  const ehSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|mercury/i.test(ua);
  const emModoApp = navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  if (ehIOS && ehSafari && !emModoApp) {
    const CHAVE_DICA = 'pwa_ios_fechado_em';
    const TRINTA_DIAS_MS = 30 * 24 * 60 * 60 * 1000;
    let ocultoPor30Dias = false;
    try {
      const fechadoEm = Number(localStorage.getItem(CHAVE_DICA) || 0);
      if (fechadoEm > 0 && (Date.now() - fechadoEm) < TRINTA_DIAS_MS) ocultoPor30Dias = true;
    } catch {}

    if (!ocultoPor30Dias) {
      const dica = document.createElement('div');
      dica.className = 'ios-pwa-tip';
      dica.id = 'iosPwaTip';
      dica.setAttribute('role', 'status');

      const txt = document.createElement('p');
      txt.textContent = 'Instale no iPhone: toque em Compartilhar e depois em Adicionar à Tela de Início';

      const fechar = document.createElement('button');
      fechar.type = 'button';
      fechar.className = 'ios-pwa-close';
      fechar.setAttribute('aria-label', 'Fechar dica de instalação no iPhone');
      fechar.textContent = 'Fechar';
      fechar.addEventListener('click', () => {
        try { localStorage.setItem(CHAVE_DICA, String(Date.now())); } catch {}
        dica.remove();
      });

      dica.append(txt, fechar);
      document.body.appendChild(dica);
    }
  }

  // Movimento: seções entram ao rolar e os números do topo contam até o valor.
  // Desligado para quem pede menos movimento ou em navegadores sem IntersectionObserver.
  const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calmo || !('IntersectionObserver' in window)) return;

  const SELETORES = [
    '#recursos .head', '#recursos .row',
    '.mt-hero .mt-pains li', '.mt-compare h2', '.cmp',
    '.dl-head', '.dl', '.mt-method h2', '.steps4 li',
    '.pl-head', '.plan', '.guarantee', '.fit', '.mt-faq h2', '.faq details', '.mt-final h2',
    '#sobre h2', '#sobre .bio', '.sk-group', '.wa'
  ].join(',');
  const alturaTela = window.innerHeight;
  const io = new IntersectionObserver(entradas => {
    entradas.forEach(e => { if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll(SELETORES).forEach(el => {
    // o que já está visível ao abrir não anima (evita piscar)
    if (el.getBoundingClientRect().top < alturaTela * 0.92) return;
    // dentro de carrossel que rola para o lado (planos no celular), o card pode nunca "entrar" na tela: não anima
    if (el.parentElement && getComputedStyle(el.parentElement).overflowX !== 'visible') return;
    const irmaos = el.parentElement ? [...el.parentElement.children].filter(c => c.matches(SELETORES)) : [];
    el.style.setProperty('--i', String(Math.min(Math.max(irmaos.indexOf(el), 0), 5)));
    el.classList.add('rv');
    io.observe(el);
  });

  // Contagem dos números do topo (04 e 24,99), com largura travada para não deslocar o layout
  document.querySelectorAll('.stat strong').forEach(el => {
    const final = el.textContent.trim(), m = final.match(/^(\d+)(?:,(\d+))?$/);
    if (!m) return;
    const casas = m[2] ? m[2].length : 0, alvo = parseFloat(final.replace(',', '.')), pad = m[1].length;
    el.style.minWidth = el.getBoundingClientRect().width + 'px';
    el.classList.add('counting');
    const formata = v => { const [i, d] = v.toFixed(casas).split('.'); return i.padStart(pad, '0') + (d ? ',' + d : ''); };
    const t0 = performance.now(), dur = 900;
    const passo = agora => {
      const p = Math.min(1, (agora - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? formata(alvo * e) : final;
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  });
})();
