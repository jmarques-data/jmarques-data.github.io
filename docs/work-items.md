# Itens de trabalho

O site ainda não tem repositório no GitHub (criar e publicar depende de autorização do Juan), então os itens ficam aqui. Ao criar o repositório, cada item vira uma Issue.

Status: **Concluído** (feito e testado) · **Parcial** · **Pendente** · **Bloqueado** (depende do Juan ou de terceiros).

Linha de base (14/11/2026, antes das mudanças): `html-validate` com 18 erros; Playwright com 18 falhas, 33 aprovados e 3 pulados.
Depois (14/11/2026): `html-validate` sem erros; Playwright com 53 aprovados, 0 falhas e 3 pulados (testes só de teclado no perfil celular); `npm audit` sem vulnerabilidades.

| ID | Item | Severidade | Status | Branch |
|---|---|---|---|---|
| WI-00 | Git local, validação de HTML, testes de acessibilidade e comportamento, workflow de CI | Média | Concluído (CI só roda quando houver repositório) | `chore/qualidade` |
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
| WI-13 | Vídeo "a mentoria por dentro" sem legenda | Média (WCAG 1.2.2) | Pendente: precisa do texto da narração para gerar a legenda `.vtt` | — |
| WI-14 | Links reais do checkout da Kiwify | — | Bloqueado: Juan precisa criar a conta e os produtos | — |
| WI-15 | Criar repositório, ativar o CI e publicar no GitHub Pages; conferir o endereço usado em `canonical` e `og:url` | — | Bloqueado: precisa de autorização para publicar | — |
| WI-16 | Imagem de compartilhamento própria (1200×630) no lugar da foto recortada | Baixa | Pendente | — |
