# Acessibilidade (meta: WCAG 2.2 AA)

## Como é verificado
`npm test` roda o axe-core (tags WCAG 2.0, 2.1 e 2.2 A/AA) nas 3 páginas, em tela de computador (1366×860) e de celular (Pixel 7), além de testes de teclado, rolagem horizontal e movimento reduzido. Ferramenta automática não pega tudo: leitor de tela real (NVDA ou TalkBack) ainda não foi testado.

## Implementado
- Link "Pular para o conteúdo" (primeiro Tab) e `<main id="conteudo">`.
- Foco visível em todos os elementos: contorno limão com borda escura, visível no azul e no branco.
- Contraste AA: cinza do texto escurecido (`#56628a`) e texto claro sobre azul com 74% de opacidade.
- Comparativo como `<table>` nativa com `<caption>`, `scope` e cabeçalhos de linha.
- Títulos em ordem (h1 → h2 → h3); nomes dos planos são `<h3>`.
- Ícones SVG e cursores animados decorativos com `aria-hidden`. Links só com ícone têm `aria-label`.
- Palavra gigante "TECNOLOGIA" é decorativa (`aria-hidden`); a foto tem `alt` descritivo.
- Vídeo em modal: `role="dialog"`, `aria-modal`, foco vai para "fechar", fica preso no modal, Esc fecha e o foco volta ao botão de origem.
- `prefers-reduced-motion: reduce` desliga animações e transições.
- Sem rolagem horizontal no celular nem no computador (testado).

## Pendente
- Legenda (`.vtt`) do vídeo "a mentoria por dentro" (WCAG 1.2.2). Precisa do texto da narração.
- Teste manual com leitor de tela e com zoom de 200% e 400%.
