# Padrões de engenharia e decisões

## Padrões
- HTML, CSS e JS puros, sem framework e sem build. Dependências npm só para desenvolvimento.
- Tokens de design centralizados em `:root` de `estilo.css` (`--blue`, `--lime`, `--ink`, `--body`, `--mute`, `--line`, `--tint`, `--display`).
- Animações só com `transform` e `opacity` ou `box-shadow`, sem mudar layout; tudo desligado em `prefers-reduced-motion`.
- Imagens com `width` e `height` para não haver salto de layout; vídeo com `preload="none"`.
- Portão de qualidade: `npm run check` (html-validate + Playwright/axe) antes de juntar; o mesmo roda no CI.

## Decisões (14/11/2026)
| Decisão | Por quê | Alternativas descartadas |
|---|---|---|
| Fontes locais em vez de Google Fonts | privacidade (IP do visitante não vai ao Google), sem banner, CSP mais fechada | manter Google Fonts com consentimento |
| CSP por `<meta>` | GitHub Pages não permite cabeçalhos | Cloudflare na frente (custo e complexidade) |
| Playwright + axe + html-validate | cobre acessibilidade, comportamento e HTML; gratuitos; usam o Chrome já instalado | Lighthouse CI (redundante para um site de uma página), Biome/ESLint/Knip (pouco JS: 1 arquivo de cerca de 50 linhas) |
| Sem Sentry, Datadog, OpenTelemetry ou Codecov | site estático sem backend; colocar monitoramento traria terceiros e consentimento | — |
| Sem biblioteca de UI ou motion | Spell UI é uma coleção de componentes **React** (conferido em spell.sh), incompatível com o site sem framework. O repositório `kylezantos/design-principles` respondeu 404 em 14/11/2026. Inspora e Refero são galerias de referência visual e não foram usadas: a identidade já está definida | — |
| Git local, branches por item e merge `--no-ff` | rastreabilidade sem publicar nada | criar o repositório no GitHub (precisa de autorização) |
