# Resposta a incidentes

Para um site estático, os incidentes mais prováveis são: alteração indevida do site (conta do GitHub invadida), link de checkout trocado por um golpe, vazamento do link do grupo ou de dados de alunos (por exemplo, print do grupo).

1. **Conter:** trocar a senha e revogar tokens do GitHub e da Kiwify; reverter o site para o último commit bom (`git revert`); gerar um novo link de convite do grupo.
2. **Avaliar:** quais dados e quantas pessoas foram afetados, e desde quando.
3. **Comunicar:** se houver risco ou dano relevante aos titulares, comunicar à ANPD e às pessoas afetadas em prazo razoável (Resolução CD/ANPD nº 15/2024 fala em 3 dias úteis; validar com advogado).
4. **Registrar:** o que aconteceu, a causa, o que foi feito e o que muda para não se repetir.

Prevenção: autenticação em dois fatores no GitHub, na Kiwify e no WhatsApp; não deixar o link do grupo no código do site; revisar o `href` do checkout antes de cada publicação (o teste só confere se é `https://`, não se é da Kiwify).
