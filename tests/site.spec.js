const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const PAGINAS = ['/index.html', '/recursos.html', '/mentoria.html', '/politica-de-privacidade.html', '/termos-de-uso.html', '/404.html'];

for (const pagina of PAGINAS) {
  test.describe(pagina, () => {
    test('não tem violações de acessibilidade WCAG 2.2 AA (axe)', async ({ page }) => {
      await page.goto(pagina);
      // espera as animações de entrada terminarem (texto semitransparente daria falso alarme de contraste)
      await page.evaluate(() => Promise.all(document.getAnimations().filter(a => a.effect && a.effect.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
      await page.waitForTimeout(1000);
      const r = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const resumo = r.violations.map(v =>
        `${v.id} (${v.impact}): ${v.nodes.length}x ${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | ')}`);
      expect(resumo, resumo.join('\n')).toEqual([]);
    });

    test('não tem rolagem horizontal', async ({ page }) => {
      await page.goto(pagina);
      const sobra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(sobra).toBeLessThanOrEqual(0);
    });

    test('só carrega recursos do próprio site (sem terceiros)', async ({ page }) => {
      const externos = [];
      page.on('request', req => {
        const u = new URL(req.url());
        if (u.protocol !== 'data:' && !['127.0.0.1', 'localhost'].includes(u.hostname)) externos.push(req.url());
      });
      await page.goto(pagina, { waitUntil: 'networkidle' });
      expect(externos).toEqual([]);
    });

    test('não gera erros no console', async ({ page }) => {
      const erros = [];
      page.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
      page.on('pageerror', e => erros.push(String(e)));
      await page.goto(pagina, { waitUntil: 'networkidle' });
      expect(erros).toEqual([]);
    });

    test('links internos e âncoras apontam para algo que existe', async ({ page, request }) => {
      await page.goto(pagina);
      const hrefs = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
      for (const href of hrefs) {
        if (/^(https?:|mailto:|tel:)/.test(href)) continue;
        if (href.startsWith('#')) {
          if (href === '#') continue;
          expect(await page.locator(href).count(), `âncora ${href}`).toBe(1);
        } else {
          const res = await request.get(new URL(href, page.url()).toString());
          expect(res.status(), href).toBe(200);
        }
      }
    });

    test('links que abrem nova aba usam rel="noopener"', async ({ page }) => {
      await page.goto(pagina);
      const semRel = await page.$$eval('a[target="_blank"]', as => as.filter(a => !/noopener/.test(a.rel)).map(a => a.href));
      expect(semRel).toEqual([]);
    });
  });
}

test.describe('página de venda', () => {
  test('os botões de compra levam ao checkout da Kiwify em nova aba', async ({ page }) => {
    await page.goto('/index.html');
    const ctas = await page.locator('a[data-kiwify]').all();
    expect(ctas.length).toBe(3);
    for (const cta of ctas) {
      await expect(cta).toHaveAttribute('href', /^https:\/\/pay\.kiwify\.com\.br\/[A-Za-z0-9]+$/);
      await expect(cta).toHaveAttribute('target', '_blank');
      await expect(cta).not.toHaveText('Inscrições abrem em breve');
    }
  });

  test('com os links de checkout, o selo do topo diz "Inscrições abertas"', async ({ page, isMobile }) => {
    test.skip(isMobile, 'o selo fica oculto no celular');
    await page.goto('/index.html');
    await expect(page.locator('#status')).toContainText('Inscrições abertas');
  });

  test('a contagem de recursos grátis bate com os recursos disponíveis', async ({ page }) => {
    await page.goto('/index.html');
    const numero = String(await page.locator('#recursos a.row').count()).padStart(2, '0');
    await expect(page.locator('.stat strong').first()).toHaveText(numero);
    await expect(page.locator('#recursos .count')).toContainText(numero);
  });

  test('preços, pagamento, desistência e termos estão visíveis nos planos', async ({ page }) => {
    await page.goto('/index.html');
    const planos = page.locator('#planos');
    await expect(planos).toContainText('24,99');
    await expect(planos).toContainText('59,90');
    await expect(planos).toContainText('Pagamento único');
    await expect(planos).toContainText('7 dias');
    await expect(planos.getByRole('link', { name: /termos de uso/i })).toBeVisible();
  });

  test('o vídeo abre, mantém o foco dentro, fecha com Esc e devolve o foco', async ({ page, isMobile }) => {
    test.skip(isMobile, 'fluxo de teclado testado no computador');
    await page.route('**/*.mp4', r => r.abort());
    await page.goto('/index.html');
    const botao = page.locator('#openVideo');
    await botao.click();
    const modal = page.locator('#videoModal');
    await expect(modal).toBeVisible();
    await expect(page.locator('#videoModal .close')).toBeFocused();
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.getElementById('videoModal').contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
    await expect(botao).toBeFocused();
  });

  test('o primeiro Tab mostra o link para pular ao conteúdo', async ({ page, isMobile }) => {
    test.skip(isMobile, 'teclado');
    await page.goto('/index.html');
    await page.keyboard.press('Tab');
    const ativo = page.locator(':focus');
    await expect(ativo).toHaveText(/pular para o conteúdo/i);
    await expect(ativo).toBeInViewport();
  });

  test('respeita quem prefere menos movimento', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/index.html');
    expect(await page.locator('.tr i').evaluate(e => getComputedStyle(e).animationName)).toBe('none');
  });

  test('o site não grava nada no navegador do visitante', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'networkidle' });
    const guardado = await page.evaluate(() => ({ ls: localStorage.length, ss: sessionStorage.length, ck: document.cookie }));
    expect(guardado).toEqual({ ls: 0, ss: 0, ck: '' });
  });

  test('as fontes da marca carregam do próprio site', async ({ page }) => {
    await page.goto('/index.html', { waitUntil: 'networkidle' });
    const ok = await page.evaluate(async () => {
      await document.fonts.ready;
      const carregadas = new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '')));
      return ['Anton', 'Inter', 'JetBrains Mono', 'Caveat'].map(f => carregadas.has(f));
    });
    expect(ok).toEqual([true, true, true, true]);
  });
});

test('o vídeo da mentoria tem legenda em português que carrega (WCAG 1.2.2)', async ({ page }) => {
  await page.goto('/index.html');
  await page.click('#openVideo');
  const info = await page.evaluate(async () => {
    const v = document.getElementById('mvideo'), t = v.querySelector('track[kind="captions"]');
    if (!t) return { trilha: false };
    t.track.mode = 'hidden';
    for (let i = 0; i < 40 && t.readyState !== 2 && t.readyState !== 3; i++) await new Promise(r => setTimeout(r, 100));
    return { trilha: true, idioma: t.srclang, estado: t.readyState, cues: t.track.cues ? t.track.cues.length : 0 };
  });
  expect(info).toMatchObject({ trilha: true, idioma: 'pt-BR', estado: 2 });
  expect(info.cues).toBeGreaterThan(3);
});

test('animações: nada fica escondido depois de rolar a página e os números terminam certos', async ({ page }) => {
  await page.goto('/index.html', { waitUntil: 'networkidle' });
  const altura = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= altura; y += 500) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(60); }
  await page.waitForTimeout(1200);
  const escondidos = await page.$$eval('.rv:not(.rv-in)', els => els.length);
  expect(escondidos).toBe(0);
  const numeros = await page.$$eval('.stat strong', els => els.map(e => e.textContent.trim()));
  expect(numeros).toEqual(['05', '24,99']);
});

test('com "reduzir movimento" ativo, nada é animado nem escondido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/index.html', { waitUntil: 'networkidle' });
  const r = await page.evaluate(() => ({
    rv: document.querySelectorAll('.rv').length,
    anim: getComputedStyle(document.querySelector('.giant')).animationName,
    numeros: [...document.querySelectorAll('.stat strong')].map(e => e.textContent.trim())
  }));
  expect(r).toEqual({ rv: 0, anim: 'none', numeros: ['05', '24,99'] });
});

test('imagem de compartilhamento existe e tem 1200×630', async ({ page }) => {
  await page.goto('/index.html');
  const url = await page.getAttribute('meta[property="og:image"]', 'content');
  expect(url).toMatch(/\/img\/og\.jpg$/);
  const dim = await page.evaluate(() => new Promise(r => { const i = new Image(); i.onload = () => r([i.naturalWidth, i.naturalHeight]); i.onerror = () => r(null); i.src = 'img/og.jpg'; }));
  expect(dim).toEqual([1200, 630]);
});

test('página 404 funciona em qualquer endereço (caminhos absolutos) e leva de volta ao site', async ({ page }) => {
  await page.goto('/404.html');
  const hrefs = await page.$$eval('link[rel="stylesheet"], link[rel="icon"]', ls => ls.map(l => l.getAttribute('href')));
  expect(hrefs.every(h => h.startsWith('/'))).toBe(true);
  await expect(page.locator('h1')).toContainText('não leva a lugar nenhum');
  const inicio = page.getByRole('link', { name: 'Voltar para o início' });
  await expect(inicio).toHaveAttribute('href', '/');
  expect(await page.getAttribute('meta[name="robots"]', 'content')).toBe('noindex');
});
