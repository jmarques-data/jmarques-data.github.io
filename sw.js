// Hub do Juan · Service Worker (PWA e funcionamento offline)
const VERSAO = 'v1';
const CACHE = `hub-juan-${VERSAO}`;

// Pré-cache só do essencial (sem vídeos pesados da pasta video/)
const PRECACHE = [
  '/',
  '/index.html',
  '/recursos.html',
  '/mentoria.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/estilo.css',
  '/mentoria.css',
  '/motion.css',
  '/paginas.css',
  '/doc.css',
  '/erro.css',
  '/app.js',
  '/fontes/fontes.css',
  '/fontes/anton-400.woff2',
  '/fontes/inter-var.woff2',
  '/fontes/jetbrains-mono-var.woff2',
  '/fontes/caveat-700.woff2',
  '/img/favicon.svg',
  '/img/projeto-github-pro.webp',
  '/img/icones/apple-touch-icon.png',
  '/img/icones/icone-192.png',
  '/img/icones/icone-512.png',
  '/img/icones/icone-maskable-512.png',
  '/video/mentoria.pt-BR.vtt'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const chaves = await caches.keys();
    await Promise.all(
      chaves.filter(k => k !== CACHE).map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

async function buscarNoCache(cache, request) {
  const exato = await cache.match(request);
  if (exato) return exato;
  const semQuery = await cache.match(request, { ignoreSearch: true });
  if (semQuery) return semQuery;
  const url = new URL(request.url);
  if (url.pathname === '/') {
    return cache.match('/index.html');
  }
  return undefined;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Nunca interceptar nem guardar requisições de outro domínio (Kiwify, WhatsApp, Instagram etc.)
  if (url.origin !== self.location.origin) return;
  // Não interceptar nem cachear vídeos pesados da pasta video/
  if (url.pathname.startsWith('/video/') && url.pathname.endsWith('.mp4')) return;

  const aceitaHtml = request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');

  // HTML: rede primeiro, cache como reserva, offline.html quando falhar sem cache
  if (aceitaHtml) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const resposta = await fetch(request);
        if (resposta && resposta.ok) {
          cache.put(request, resposta.clone()).catch(() => {});
        }
        return resposta;
      } catch {
        const guardado = await buscarNoCache(cache, request);
        if (guardado) return guardado;
        const paginaOffline = await cache.match('/offline.html');
        if (paginaOffline) return paginaOffline;
        return new Response('Você está sem internet.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    })());
    return;
  }

  // CSS, JS, fontes e imagens: cache primeiro, atualiza em segundo plano
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const guardado = await buscarNoCache(cache, request);
    const atualizacao = fetch(request).then(resposta => {
      if (resposta && resposta.ok) {
        cache.put(request, resposta.clone()).catch(() => {});
      }
      return resposta;
    }).catch(() => null);

    if (guardado) {
      event.waitUntil(atualizacao);
      return guardado;
    }

    const daRede = await atualizacao;
    if (daRede) return daRede;
    return new Response('', { status: 504 });
  })());
});
