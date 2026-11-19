# Privacidade (LGPD): inventário de dados, terceiros e exclusão

Este documento reúne o inventário de dados, os serviços de terceiros e o procedimento de exclusão. Ele reflete o site em 14/11/2026. As bases legais são as **consideradas** e precisam de validação jurídica (ver `legal-review.md`).

## Inventário de dados
| Dado | Origem | Finalidade | Base legal considerada | Onde fica | Retenção |
|---|---|---|---|---|---|
| IP e dados técnicos de acesso | visita ao site | segurança e funcionamento | legítimo interesse do GitHub (controlador próprio) | GitHub (EUA) | definida pelo GitHub |
| Nome, e-mail, dados de pagamento | checkout Kiwify | venda, comprovante, liberação de acesso | execução de contrato (art. 7º, V); obrigação legal para registros fiscais (art. 7º, II) | Kiwify | definida pela Kiwify e pela lei fiscal |
| Nome, telefone, mensagens | grupo e suporte da mentoria, WhatsApp | prestar a mentoria e responder contatos | execução de contrato e procedimentos preliminares (art. 7º, V) | aplicativo do grupo (a definir) e WhatsApp | enquanto durar a mentoria, depois só o que a lei exigir |

O site em si **não coleta** dados pessoais: não tem formulário, cookies, analytics ou pixels (há teste automatizado para storage no carregamento e para requisições a terceiros). No Safari do iOS, se a pessoa fechar a dica de instalação na Tela de Início, o site guarda no próprio aparelho (`localStorage`, chave `pwa_ios_fechado_em`) apenas a data em que o aviso foi fechado, para não mostrá-lo de novo por 30 dias. Essa preferência não é cookie, não coleta dado pessoal e nunca sai do aparelho.

## Serviços de terceiros
| Serviço | Uso | Dados | País |
|---|---|---|---|
| GitHub Pages | hospedagem (prevista) | IP, user agent | EUA |
| Kiwify | checkout (ainda não configurado) | dados da compra | Brasil (conferir na política da Kiwify) |
| WhatsApp (Meta) | contato e suporte individual | telefone e mensagens | EUA e outros |
| Grupo da mentoria (WhatsApp, Telegram ou Discord, a definir) | comunidade | nome, telefone ou usuário, mensagens | a definir |
| Google Fonts | **removido** em 14/11/2026 (fontes agora locais) | — | — |

Links para Instagram, TikTok, LinkedIn, GitHub, Gemini e GitHub Education são apenas links: nada é carregado dessas empresas até a pessoa clicar.

## Direitos do titular e exclusão (procedimento)
1. Pedido chega pelo WhatsApp informado na política.
2. Confirmar a identidade com um dado da compra (e-mail ou número do pedido), sem pedir documentos.
3. Acesso ou cópia: enviar o que existir (dados da Kiwify exportados pelo painel e informações do grupo).
4. Exclusão: remover a pessoa do grupo, apagar a conversa e os contatos guardados e pedir a exclusão na Kiwify quando cabível. Manter só o que a lei obriga, como registros fiscais da venda.
5. Responder ao titular com o que foi feito. A LGPD prevê até 15 dias para a declaração completa (art. 19, II).
6. Registrar o pedido (data, tipo e resposta) sem guardar dados além do necessário.

## Consentimento e cookies
Não há cookies nem tecnologias não essenciais, então não há banner. Se algum dia entrar analytics ou pixel: bloquear antes do consentimento, oferecer aceitar, rejeitar e configurar com o mesmo destaque, permitir revogar e atualizar a política.

## Crianças e adolescentes
O público e a idade mínima da mentoria não estão definidos. Decisão pendente (ver `legal-review.md`).
