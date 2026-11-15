// Testes do site estático. No computador usa o Chrome instalado (channel "chrome") para não baixar navegadores.
const { defineConfig, devices } = require('@playwright/test');

const canal = process.env.CI ? undefined : 'chrome';

module.exports = defineConfig({
  testDir: 'tests',
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4173', channel: canal },
  webServer: {
    command: 'python -m http.server 4173 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4173/index.html',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1366, height: 860 } } },
    { name: 'celular', use: { ...devices['Pixel 7'], channel: canal } },
  ],
});
