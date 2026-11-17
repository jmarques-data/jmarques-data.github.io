# Itens de trabalho

O site está publicado em https://jmarques-data.github.io (repositório `jmarques-data/jmarques-data.github.io`). Os itens ficam registrados aqui.

Status: **Concluído** (feito e testado) · **Parcial** · **Pendente** · **Bloqueado** (depende do Juan ou de terceiros).

Linha de base (14/11/2026, antes das mudanças): `html-validate` com 18 erros; Playwright com 18 falhas, 33 aprovados e 3 pulados.
Depois (14/11/2026): `html-validate` sem erros; Playwright com 53 aprovados, 0 falhas e 3 pulados (testes só de teclado no perfil celular); `npm audit` sem vulnerabilidades.

Segunda rodada (14/11/2026, noite): `html-validate` sem erros; Playwright com 60 aprovados, 0 falhas e 3 pulados (rodado 2 vezes seguidas, estável).

| ID | Item | Severidade | Status | Branch |
|---|---|---|---|---|
| WI-00 | Git local, validação de HTML, testes de acessibilidade e comportamento, workflow de CI | Média | Concluído | `chore/qualidade` |
| WI-01 | Google Fonts enviava o IP de cada visitante ao Google (terceiro, transferência internacional). Fontes passaram a ser servidas pelo próprio site | Alta (privacidade) | Concluído | `fix/fontes-locais-privacidade` |
| WI-02 | Sem Content-Security-Policy e Referrer-Policy. Adicionadas por `<meta>` nas 3 páginas | Média (segurança) | Concluído | `fix/fontes-locais-privacidade` |
| WI-03 | Aviso de cookies desnecessário (o site não usa cookies) e uso de `localStorage`. Removidos | Baixa | Concluído | `fix/fontes-locais-privacidade` |
| WI-04 | Política de privacidade incompleta (sem compartilhamento, transferência internacional, retenção, ANPD). Reescrita | Alta (LGPD) | Parcial: falta a identificação do responsável (ver legal-review) | `fix/fontes-locais-privacidade` |
| WI-05 | Selo "Mentoria aberta" pulsando enquanto não há checkout. Agora mostra "Inscrições em breve" até existir link real | Média (integridade) | Concluído | `fix/integridade-comercial` |
| WI-06 | Contador dizia 05 recursos grátis, mas só 04 estão disponíveis (o 5º é "em breve"). Corrigido | Média (integridade) | Concluído | `fix/integridade-comercial` |
| WI-07 | Recurso do Gemini sem aviso de idade mínima e cobrança automática. Conferido na página oficial e incluído | Média (integridade) | Concluído | `fix/integridade-comercial` |
| WI-08 | Sem termos de uso nem política de reembolso escrita. Página criada e ligada aos planos e ao rodapé | Alta (consumidor) | Parcial: dados do vendedor e duração do acesso pendentes | `fix/integridade-comercial` |
| WI-09 | Contraste insuficiente (texto cinza e contador) e sem foco visível no teclado | Alta (WCAG 1.4.3, 2.4.7) | Concluído | `fix/acessibilidade` |
| WI-10 | Sem atalho para o conteúdo e sem `<main>` | Média (WCAG 2.4.1) | Concluído | `fix/acessibilidade` |
| WI-11 | Comparativo em `<div role=table>`; nomes dos planos sem título. Tabela nativa e `<h3>` | Baixa | Concluído | `fix/acessibilidade` |
| WI-12 | Vídeo em modal sem foco preso; botão desativado do plano em grupo parecia clicável | Média | Concluído | `fix/acessibilidade` |
| WI-13 | Vídeo "a mentoria por dentro" sem legenda. O vídeo não tem narração: a legenda `video/mentoria.pt-BR.vtt` descreve a trilha e todos os textos da tela | Média (WCAG 1.2.2) | Concluído | `fix/legenda-video` |
| WI-14 | Links reais do checkout da Kiwify: grupo `jeiEOtx` (R$ 24,99), grupo + revisão `VTmFgZ9` (R$ 49,90) e individual `IAvXrBt` (R$ 59,90), à vista, Pix e cartão | Alta | Concluído: publicado em 17/11; plano do meio em `feat/plano-revisao` | `feat/links-kiwify` |
| WI-15 | Criar repositório, ativar o CI e publicar no GitHub Pages; conferir o endereço usado em `canonical` e `og:url` | — | Concluído: publicado no GitHub Pages, CI ativo | `main` |
| WI-16 | Imagem de compartilhamento própria (1200×630) no lugar da foto recortada: `img/og.jpg`, gerada de `tools/og.html` com `npm run og` | Baixa | Concluído | `feat/imagem-compartilhamento` |
| WI-17 | CSP diferente entre as páginas (a outra sessão tirou `upgrade-insecure-requests` de 2 páginas e da doc). Igualada nas 3 | Baixa | Concluído | `chore/csp-consistente` |
| WI-18 | Movimento e microinterações: entrada do topo, seções ao rolar, contagem dos números, hover e toque. Só `transform`/`opacity`, desligado com `prefers-reduced-motion` | Média (experiência) | Concluído | `feat/motion-microinteracoes` |
| WI-19 | Avaliar Spell UI, Inspora, Refero Styles e Motion Principles (`docs/design-motion.md`) | Baixa | Concluído (nenhuma instalada; ver motivos) | `docs/design-e-pendencias` |
| WI-20 | `AGENTS.md` citava `docs/third-party-services.md`, que não existe (o conteúdo está em `docs/privacy.md`). Corrigido; licenças da foto e do vídeo atualizadas | Baixa | Concluído | `docs/design-e-pendencias` |
| WI-21 | Identificação do vendedor: nome **Juan Marques Rodrigues** na política, nos termos e no rodapé. CPF/CNPJ e endereço ficam só na Kiwify (decisão do Juan) | Alta (consumidor) | Parcial: confirmar com contador se atende ao Decreto 7.962/2013 | `fix/identificacao-vendedor` |
| WI-22 | Testes instáveis: o `python -m http.server` recusava conexões (fila de 5) quando o Playwright abria várias páginas juntas. Criado `tools/servidor.py` (threads, fila de 256); botão desativado sem transição de cor ao carregar | Média (qualidade) | Concluído: 183 aprovados em 3 repetições seguidas | `fix/botao-desativado-sem-transicao` |
| WI-23 | Topo no celular mais limpo: sem "Online · conteúdo em português" e "Cada atalho, testado na prática" (pedido do Juan) | Baixa | Concluído | `fix/topo-celular-limpo` |
| WI-24 | Página de erro 404 personalizada (`404.html` + `erro.css`), com caminhos absolutos para funcionar em qualquer endereço, `noindex`, links para início, recursos e mentoria. O GitHub Pages só permite personalizar a 404 | Baixa | Concluído | `feat/pagina-404` |
| WI-25 | Termos, política e FAQ com as decisões de 15/11: mentoria de 30 dias contados da entrada no grupo, grupo no WhatsApp (aviso de número visível) e idade mínima de 16 anos (16-17 com autorização do responsável) | Alta | Concluído | `wi-25-acesso-whatsapp-idade` |
| WI-26 | Terminal animado (`.techcore`) no lugar da foto do topo; imagem de compartilhamento regenerada sem a foto | Média (visual) | Concluído | `feat/elemento-tech` |
| WI-27 | Auditoria de 16/11: robots.txt, sitemap.xml, canonical e Open Graph nas páginas legais, JSON-LD (WebSite + Person), capas do vídeo em WebP, CLS dos termos zerado (preload de fontes), alvos de toque de 24 px, imagens sem uso arquivadas | Média (SEO e desempenho) | Concluído: Lighthouse celular 99/100/100/100, computador 100/100/100/100 | `chore/auditoria` |
| WI-28 | SEO 83 por "robots.txt inválido": a CSP `connect-src 'none'` impedia a leitura. Página inicial com `connect-src 'self'`; botões da Kiwify sem link viram `<span>` | Média (SEO) | Concluído: SEO 100 | `fix/seo-robots` |
| WI-29 | Selo "Sem cookies" no rodapé de todas as páginas e seção Cookies na política (atualizada em 16/11) | Baixa | Concluído | `feat/selo-sem-cookies` |
| WI-30 | Mentoria: "O que você vai conseguir fazer", "Uma amostra do que você recebe" (checklist real e projeto do GitHub Pro) e "Do pagamento ao primeiro passo" | Média (conversão) | Concluído | `feat/mentoria-prova` |
| WI-31 | Verificação do Google Search Console (meta tag) e envio do sitemap | Baixa | Parcial: aguardando o Search Console ler o sitemap | `chore/search-console` |
