# UX_AUDIT_FINAL.md — Sprint Final

## Microinterações — padronização, não invenção

Esta sprint não introduziu um sistema de motion novo — o app já tinha `--motion-quick/base/slow` + `--ease-glide/--ease-settle` bem definidos e usados de forma consistente (Framer Motion nas sprints anteriores). O trabalho aqui foi **fechar as lacunas**, não redesenhar:

- **Foco visível**: antes desta sprint, `.field-input` era o único elemento com anel de foco. Todo o resto (botões, links de navegação, abas, linhas clicáveis, células de calendário) dependia do outline padrão do navegador — inconsistente entre navegadores e, em alguns casos (fundo escuro do `.rail`), praticamente invisível. Um anel único (`box-shadow: 0 0 0 3px var(--ring)`, mesmo token já usado no input) agora cobre 9 seletores diferentes — a mesma "assinatura" visual em qualquer elemento focado, em vez de nenhuma ou uma genérica do navegador.
- **Hover em linha de dia clicável** (`ChronologicalRecord.jsx`): a linha já era clicável (expande/recolhe o dia) mas não tinha nenhum feedback de hover, ao contrário de toda outra linha clicável do app (`.roster-row`, `.dose-card`). Adicionado.
- **Botão "Excluir conta" sem hover**: o botão usava uma cor inline sem nenhum estado de interação — agora `.btn-ghost-danger` tem hover em `--danger-wash`, consistente com como todo outro botão do app reage ao passar o mouse.

Nada disso é uma animação nova ou vistosa — é fechar o padrão que já existia para os poucos elementos que tinham ficado de fora dele.

## Hierarquia e clareza — Central de Acompanhamento

O card de "Risco de Baixa Adesão" antes usava 5 cores distintas para 5 classificações clínicas (`Muito Baixo/Baixo/Moderado/Alto/Crítico`) — uma paleta mais granular do que o resto da interface, que fala em 3 níveis (sucesso/atenção/perigo) em todo lugar (chips de adesão, pontos de status, heatmaps). Colapsar para os mesmos 3 níveis visuais não perde informação (o texto da classificação continua mostrando as 5 categorias, só a cor de fundo/borda agora segue o mesmo vocabulário visual do resto do produto) — o profissional lendo a tela não precisa aprender uma paleta de cores separada só para essa seção.

## Consistência entre listas do admin

Havia 2 aparências visuais diferentes de "linha de item numa lista" convivendo no mesmo painel administrativo: `.roster-row` (lista de pacientes) e um padrão inline nas listas de suplementos. Depois de `.list-row`, qualquer lista de itens dentro de um formulário/Sheet no admin tem a mesma altura de linha, mesmo espaçamento, mesma borda — o operador não percebe mais "essa tela parece de um produto diferente daquela".

## Psicologia da cor — legibilidade em vez de decoração

A unificação de `--danger`/`--danger-fill` e a introdução dos 3 níveis semânticos consistentes (`--success`/`--warning`/`--danger`) em todos os heatmaps não é só limpeza técnica — é o que permite ao usuário (paciente ou profissional) aprender **uma única vez** o que cada cor significa e aplicar esse conhecimento em qualquer tela do app (dashboard, calendário, Central de Acompanhamento). Antes, a mesma cor podia significar coisas ligeiramente diferentes (tom pastel vs. sólido) dependendo de qual heatmap se estava olhando — um atrito cognitivo pequeno, mas real, exatamente o tipo de coisa que separa um produto "bom" de um "premium" (Apple Health/Linear/Stripe são consistentes nisso a um grau quase obsessivo).

## O que foi avaliado e conscientemente **não** mudado

- Fluxos de navegação, número de cliques, ordem das telas — inalterados. Esta sprint é refinamento visual/estrutural, não redesenho de fluxo (já feito em sprints anteriores).
- Nenhuma nova mensagem de erro, confirmação ou copy foi adicionada — só o bug do toast de erro que nunca ficava vermelho (efeito puramente visual, a mensagem em si já estava correta).
- O padrão de `AdherenceIndexCard`/`RiskCard` lado a lado com tamanhos assimétricos foi revisado e mantido — dois cartões de importância e conteúdo diferentes não deveriam ter a mesma largura forçada por um grid; a hierarquia visual atual (índice geral maior, risco menor) já está correta.
