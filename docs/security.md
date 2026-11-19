# Segurança

## Superfície
Site estático: sem servidor próprio, banco de dados, login, formulários, uploads ou API. O pagamento acontece fora do site, no checkout da Kiwify. Por isso, boa parte do OWASP Top 10 e do ASVS (autenticação, sessões, IDOR/BOLA, SQL injection, SSRF, CSRF, rate limiting) **não se aplica hoje**. Passa a se aplicar se o site ganhar formulário, login ou backend.

## Controles implementados
| Controle | Onde | Verificação |
|---|---|---|
| Content-Security-Policy restritiva (`default-src 'self'`, sem inline, `object-src 'none'`, `form-action 'none'`) | `<meta>` nas 3 páginas | testes "não gera erros no console" e "só carrega recursos do próprio site" |
| Referrer-Policy `strict-origin-when-cross-origin` | `<meta>` | — |
| Nenhum recurso de terceiros carregado no navegador | fontes locais em `fontes/` | teste automatizado |
| Links externos com `rel="noopener"` | todos os `target="_blank"` | teste automatizado |
| Checkout só aceita link `https://` | `app.js` | teste automatizado |
| Service Worker (`sw.js`): só mesma origem, sem cache de terceiros | `sw.js` e `app.js` | testes automatizados de registro, escopo e modo offline |
| Dependências de desenvolvimento sem vulnerabilidades conhecidas | `npm audit` | 0 vulnerabilidades em 14/11/2026 (o `html-validate` 9 tinha 3 moderadas e foi atualizado para o 11) |
| CI com `permissions: contents: read` | `.github/workflows/qualidade.yml` | preparado, não executado (sem repositório) |

## Limitações conhecidas
- GitHub Pages não permite cabeçalhos HTTP próprios. `frame-ancestors` (proteção contra clickjacking) e HSTS próprio não funcionam por `<meta>`. O GitHub Pages já força HTTPS quando a opção "Enforce HTTPS" está ativa. O risco de clickjacking é baixo porque o site não tem ações sensíveis.
- O número de WhatsApp do Juan está público no site por decisão de negócio (canal de contato e de privacidade). Isso pode atrair spam.
- Segredos: nenhum segredo no código. Não colocar chaves, tokens ou links privados de grupo no repositório.

"Nenhuma falha encontrada" não significa que o site é comprovadamente seguro.
