// Hub do Juan · comportamento da página
(() => {
  // Links da Kiwify: troque KIWIFY_GRUPO e KIWIFY_INDIVIDUAL no index.html pelos links reais (https://).
  // Enquanto não houver link real, o botão fica desativado e o selo do topo não diz que a mentoria está aberta.
  let abertos = 0;
  document.querySelectorAll('a[data-kiwify]').forEach(a => {
    if (/^https:\/\//.test(a.getAttribute('href') || '')) { abertos++; return; }
    a.removeAttribute('href'); a.removeAttribute('target'); a.removeAttribute('rel');
    a.classList.add('disabled'); a.textContent = 'Inscrições abrem em breve';
  });
  const status = document.getElementById('status');
  if (status && abertos) status.lastChild.textContent = 'Inscrições abertas';

  // Vídeo "a mentoria por dentro": 16:9 no computador e 9:16 no celular
  const modal = document.getElementById('videoModal'), box = modal.querySelector('.modal-box'), video = document.getElementById('mvideo');
  const vertical = () => window.matchMedia('(max-width: 700px), (orientation: portrait)').matches;
  function openVideo() {
    const v = vertical();
    box.classList.toggle('vertical', v);
    const src = v ? 'video/mentoria-9x16.mp4' : 'video/mentoria-16x9.mp4';
    if (video.getAttribute('src') !== src) { video.src = src; video.poster = v ? 'video/capa-9x16.jpg' : 'video/capa-16x9.jpg'; }
    modal.hidden = false; document.body.style.overflow = 'hidden';
    video.play().catch(() => {});
    modal.querySelector('.close').focus();
  }
  function closeVideo() { video.pause(); modal.hidden = true; document.body.style.overflow = ''; document.getElementById('openVideo').focus(); }
  document.getElementById('openVideo').addEventListener('click', openVideo);
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

  // Sem aviso de cookies: o site não usa cookies, armazenamento no navegador nem serviços de terceiros.
})();
