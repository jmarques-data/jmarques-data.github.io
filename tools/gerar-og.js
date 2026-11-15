// Gera img/og.jpg (1200×630) a partir de tools/og.html, com o Chrome do Playwright.
// Uso: npm run og   (precisa do servidor: npm run serve)
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto('http://127.0.0.1:4173/tools/og.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'img/og.jpg', type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await browser.close();
  console.log('img/og.jpg gerada');
})();
