# Design e movimento

## Referências avaliadas (14/11/2026)
| Referência | O que é (conferido no site) | Decisão |
|---|---|---|
| Spell UI (spell.sh) | Biblioteca de componentes **React** para copiar no projeto. O site não informa licença nem se depende de Tailwind ou framer-motion | **Não instalada.** O site é HTML/CSS/JS puro, sem build; adotar React para isso seria uma reescrita desproporcional. Os efeitos úteis foram recriados em CSS |
| Inspora (inspora.design) | Galeria de inspiração visual (sites e logos) | Só referência de hierarquia e ritmo. Nada copiado. A página não informa termos de reuso |
| Refero Styles (styles.refero.design) | Galeria de mais de 2.000 sistemas de design de sites, com cores, tipografia e espaçamento | Só referência. Nada copiado. A página não informa termos de reuso |
| Motion Principles (github.com/kylezantos/design-principles) | **Página não encontrada (404)** em 14/11/2026 | Não consultada. Os princípios abaixo seguem práticas gerais de movimento em interfaces e a WCAG 2.2 |

## Tokens
- Cores, fontes e espaçamentos: `:root` em `estilo.css`.
- Movimento: `:root` em `motion.css`: `--ease-out` (saída suave), `--dur-fast` 160 ms (toques), `--dur-base` 260 ms (hover), `--dur-reveal` 700 ms (entradas).

## O que foi implementado (`motion.css` e fim do `app.js`)
- **Entrada do topo:** "TECNOLOGIA", a foto, "Olá, eu sou", "JUAN." e o subtítulo sobem e aparecem no carregamento, em sequência.
- **Seções ao rolar:** listas, cards, planos, comparativo, perguntas e habilidades entram quando chegam à tela, com atraso escalonado (máx. 5 passos de 70 ms). O que já está visível ao abrir não anima, para não piscar.
- **Contagem:** "04" e "24,99" contam até o valor em 0,9 s. A largura é travada antes para não deslocar o layout.
- **Microinterações:** botões sobem 2 px com brilho limão no hover e encolhem 2% no toque; a seta dos recursos desliza; planos e cards sobem levemente; respostas do FAQ aparecem com fade.

## Regras
1. Animar só `transform` e `opacity` (sem layout shift).
2. O conteúdo nunca depende da animação: sem JavaScript tudo aparece; o `app.js` só esconde o que vai animar.
3. `prefers-reduced-motion: reduce` desliga tudo (CSS em `motion.css` e `estilo.css`; o `app.js` não aplica as classes nem a contagem).
4. Sem bibliotecas de animação: `IntersectionObserver` e CSS nativos.

## Testes
- "animações: nada fica escondido depois de rolar a página e os números terminam certos".
- "com 'reduzir movimento' ativo, nada é animado nem escondido".
- O teste de acessibilidade (axe) espera as animações de entrada terminarem antes de medir contraste.
