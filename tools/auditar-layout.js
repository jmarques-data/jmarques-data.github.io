// Auditoria de layout: CLS, overflow horizontal, alvos de toque pequenos e textos minúsculos
// em vários tamanhos de tela. Uso: node tools/auditar-layout.js [url-base]
const { chromium } = require('@playwright/test');

const BASE = process.argv[2] || 'http://127.0.0.1:4173';
const PAGINAS = ['/index.html', '/politica-de-privacidade.html', '/termos-de-uso.html', '/404.html'];
const TELAS = [[320, 640], [375, 812], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  let problemas = 0;
  for (const [w, h] of TELAS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 800, isMobile: w < 800 });
    for (const p of PAGINAS) {
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        window.__cls = 0;
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
          .observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto(BASE + p, { waitUntil: 'load' });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
        window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
      });
      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const largos = [...document.querySelectorAll('body *')].filter(el => {
          const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
          if (cs.position === 'fixed' || b.width === 0) return false;
          let anc = el.parentElement, clipped = false;
          while (anc && anc !== document.body) { const o = getComputedStyle(anc).overflowX; if (o !== 'visible') { clipped = true; break; } anc = anc.parentElement; }
          return !clipped && (b.right > vw + 1 || b.left < -1);
        }).slice(0, 5).map(el => (el.className || el.tagName).toString().slice(0, 40));
        const toque = [...document.querySelectorAll('a[href], button, summary, [role=button]')].filter(el => {
          const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
          return b.width > 0 && cs.visibility !== 'hidden' && (b.height < 24 || b.width < 24);
        }).slice(0, 5).map(el => (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30));
        const mini = [...document.querySelectorAll('p, a, li, span, button, td, th, label, summary')].filter(el => {
          const cs = getComputedStyle(el); const b = el.getBoundingClientRect();
          return b.width > 0 && el.childNodes.length && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(cs.fontSize) < 10.5
            && !el.closest('[aria-hidden="true"]');
        }).slice(0, 5).map(el => el.textContent.trim().slice(0, 25) + ' (' + getComputedStyle(el).fontSize + ')');
        return { cls: Math.round(window.__cls * 1000) / 1000, overflow: document.documentElement.scrollWidth > vw, largos, toque, mini };
      });
      const ruim = r.cls > 0.1 || r.overflow || r.toque.length || r.mini.length;
      if (ruim) problemas++;
      console.log(`${ruim ? '✗' : '✓'} ${w}x${h} ${p} CLS=${r.cls} overflow=${r.overflow}` +
        (r.largos.length && r.overflow ? ` largos=${JSON.stringify(r.largos)}` : '') +
        (r.toque.length ? ` toque<24px=${JSON.stringify(r.toque)}` : '') +
        (r.mini.length ? ` texto<10.5px=${JSON.stringify(r.mini)}` : ''));
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  console.log(problemas ? `${problemas} combinações com algo a revisar` : 'Tudo certo em todas as telas');
})();
