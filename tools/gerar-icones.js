// Gera os ícones PNG de PWA e iOS em img/icones/ a partir de img/favicon.svg.
// Uso: npm run icones
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { chromium } = require('@playwright/test');

const RAIZ = path.dirname(__dirname);
const SVG_CAMINHO = path.join(RAIZ, 'img', 'favicon.svg');
const PASTA_SAIDA = path.join(RAIZ, 'img', 'icones');

// Tabela CRC32 padrão para chunks PNG
const CRC_TABELA = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  CRC_TABELA[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABELA[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(tipo, dados) {
  const t = Buffer.from(tipo, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(dados.length, 0);
  const crcBuf = Buffer.concat([t, dados]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcBuf), 0);
  return Buffer.concat([len, t, dados, crc]);
}

// Codifica pixels RGBA (Uint8Array) em PNG RGB puro (colorType = 2, sem canal de transparência)
function codificarPngRgbOpaco(largura, altura, rgba) {
  const assinatura = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(largura, 0);
  ihdr.writeUInt32BE(altura, 4);
  ihdr[8] = 8;  // bit depth: 8 bits
  ihdr[9] = 2;  // color type: 2 (truecolor RGB, sem transparência)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const linhaBytes = 1 + largura * 3;
  const bruto = Buffer.alloc(altura * linhaBytes);
  for (let y = 0; y < altura; y++) {
    const offsetLinha = y * linhaBytes;
    bruto[offsetLinha] = 0; // filtro None
    for (let x = 0; x < largura; x++) {
      const orig = (y * largura + x) * 4;
      const dest = offsetLinha + 1 + x * 3;
      bruto[dest] = rgba[orig];
      bruto[dest + 1] = rgba[orig + 1];
      bruto[dest + 2] = rgba[orig + 2];
    }
  }

  const comprimido = zlib.deflateSync(bruto, { level: 9 });
  return Buffer.concat([
    assinatura,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', comprimido),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function prepararSvg(svgOriginal, { maskable = false } = {}) {
  // Remove rx do rect de fundo para que todos os ícones tenham cantos retos e fundo 100% preenchido
  const semCantos = svgOriginal.replace(/<rect([^>]*?)\s+rx="[^"]*"([^>]*)>/i, '<rect$1$2>');
  if (!maskable) return semCantos;
  // No maskable, mantém o fundo #0131cd ocupando 100% e escala o desenho central dentro da zona segura de 80%
  return semCantos.replace(
    /(<svg[^>]*>)([\s\S]*?)(<\/svg>)/i,
    '$1<rect width="64" height="64" fill="#0131cd"/><g transform="translate(8 8) scale(0.75)">$2</g>$3'
  );
}

(async () => {
  const svgOriginal = fs.readFileSync(SVG_CAMINHO, 'utf8').trim();
  fs.mkdirSync(PASTA_SAIDA, { recursive: true });

  const icones = [
    { nome: 'apple-touch-icon.png', tamanho: 180, maskable: false },
    { nome: 'icone-192.png', tamanho: 192, maskable: false },
    { nome: 'icone-512.png', tamanho: 512, maskable: false },
    { nome: 'icone-maskable-512.png', tamanho: 512, maskable: true },
  ];

  const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' });
  const page = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });

  for (const item of icones) {
    const svg = prepararSvg(svgOriginal, { maskable: item.maskable });
    await page.setViewportSize({ width: item.tamanho, height: item.tamanho });
    await page.setContent(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0}html,body{width:${item.tamanho}px;height:${item.tamanho}px;background:#0131cd;overflow:hidden}svg{width:100%;height:100%;display:block}</style></head><body>${svg}</body></html>`,
      { waitUntil: 'load' }
    );

    const rgbaArray = await page.evaluate(async (tam) => {
      const svgEl = document.querySelector('svg');
      const xml = new XMLSerializer().serializeToString(svgEl);
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
      const canvas = document.createElement('canvas');
      canvas.width = tam;
      canvas.height = tam;
      const ctx = canvas.getContext('2d', { alpha: false });
      ctx.fillStyle = '#0131cd';
      ctx.fillRect(0, 0, tam, tam);
      ctx.drawImage(img, 0, 0, tam, tam);
      return Array.from(ctx.getImageData(0, 0, tam, tam).data);
    }, item.tamanho);

    const pngBuffer = codificarPngRgbOpaco(item.tamanho, item.tamanho, Uint8Array.from(rgbaArray));
    const destino = path.join(PASTA_SAIDA, item.nome);
    fs.writeFileSync(destino, pngBuffer);
    console.log(`Gerado: img/icones/${item.nome} (${item.tamanho}×${item.tamanho})`);
  }

  await browser.close();
})();
