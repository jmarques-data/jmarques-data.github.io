# AGENTS.md — Hub do Juan (página de venda e link da bio)

Instruções para agentes de IA (Claude Code e outros) que trabalham neste site. Base: `PROMPT_MESTRE.md` (Área de Trabalho do Juan), adaptado a este projeto.

## O que é
Site estático em HTML, CSS e JavaScript puro, sem framework e sem build. Página única (`index.html`) com recursos grátis e a oferta da mentoria (grupo R$ 24,99 e individual R$ 59,90, pagamento único pela Kiwify), mais `politica-de-privacidade.html` e `termos-de-uso.html`.

Hospedagem prevista: GitHub Pages em `https://jmarques-data.github.io/`. **Ainda não publicado.**

## Comandos
| Comando | O que faz |
|---|---|
| `npm install` | instala as ferramentas de teste (só para desenvolvimento) |
| `npm run serve` | servidor local em http://127.0.0.1:4173 |
| `npm run lint:html` | valida o HTML das 3 páginas (html-validate) |
| `npm test` | testes no navegador (Playwright + axe): acessibilidade WCAG 2.2 AA, links, terceiros, console, regras da venda |
| `npm run check` | os dois acima |

No Windows os testes usam o Chrome instalado. No CI (`CI=true`) usam o Chromium do Playwright.

## Regras do projeto
- Português do Brasil, linguagem simples, sem jargão.
- Identidade visual: azul `#0131CD`, branco, limão `#B9FC01`; títulos Anton, texto Inter, rótulos JetBrains Mono. Nunca texto limão sobre fundo branco.
- **Nada de terceiros carregando no navegador** (fontes, scripts, analytics, pixels). A CSP em `<meta>` bloqueia; o teste "só carrega recursos do próprio site" falha se algo entrar. Adicionar um terceiro exige atualizar a política de privacidade, a seção "Serviços de terceiros" de `docs/privacy.md` e, se houver cookie não essencial, um banner de consentimento com aceitar, rejeitar e configurar.
- **Sem estilos ou scripts inline** (a CSP bloqueia). Use `estilo.css`, `mentoria.css`, `doc.css` e `app.js`.
- **Integridade comercial:** sem contadores falsos, escassez artificial, depoimentos ou números inventados. Preço, forma de pagamento, desistência de 7 dias e link dos termos ficam visíveis nos planos (há teste).
- **Checkout:** os botões usam `data-kiwify` com `href` provisório (`KIWIFY_GRUPO`, `KIWIFY_INDIVIDUAL`). Enquanto não houver link `https://` real, `app.js` desativa o botão e o selo do topo mostra "Inscrições em breve".
- Respeitar `prefers-reduced-motion` (regra global no fim de `estilo.css`).
- Não inventar dados da empresa (CPF/CNPJ, endereço), prazos ou garantias. Pendências jurídicas ficam em `docs/legal-review.md`.

## Fluxo de trabalho
- Git local (sem remoto ainda). Uma branch por item (`fix/…`, `chore/…`), commits citando o item (`Refs WI-07`), merge na `main` com `--no-ff`.
- Itens de trabalho em `docs/work-items.md` enquanto não houver repositório no GitHub.
- Rodar `npm run check` antes de juntar qualquer branch.
- Publicar no GitHub Pages **só com autorização explícita do Juan**.
