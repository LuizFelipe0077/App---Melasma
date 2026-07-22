# MOTIVATION_SYSTEM.md — Parte 6

## Design

Novo utilitário `frontend/src/utils/motivationMessages.js`. Um banco de 2 variantes de texto por marco — as variantes-base usam exatamente os textos-exemplo do pedido; a segunda variante de cada categoria foi escrita no mesmo tom para garantir que a mesma frase não apareça sempre. `getMotivationMessage(ctx)` escolhe aleatoriamente entre as variantes da categoria disparada.

## Marcos e prioridade

Só dispara em marco genuíno — **não em todo check-in comum** (isso viraria ruído, não reconhecimento). Ordem de prioridade (o mais específico vence):

1. **Último dia** (`elapsedDays >= totalDays`) — "Parabéns! Você concluiu seu protocolo."
2. **Metade do tratamento** (`elapsedDays === Math.round(totalDays / 2)`) — "Você já percorreu metade da jornada."
3. **Sequência**: 30 / 14 / 7 / 3 dias — dispara exatamente no dia em que o streak bate um desses números, não em todo dia acima dele.
4. **Dia perfeito** — todas as doses do dia concluídas.
5. **Primeiro check-in** — streak passou de 0 para 1.

Se nada disso for verdade, `getMotivationMessage` retorna `null` e o toast mostra a mensagem padrão de sempre ("Vitamina C registrado", com ação "Desfazer") — o sistema motivacional é um acréscimo, não uma substituição do feedback funcional.

## Integração

Chamado dentro do `handleCheck` otimista em `PatientDashboardPage.jsx` (ver `OPTIMISTIC_UI_REPORT.md`), calculado **sobre o estado otimista** (já com o check-in aplicado) — assim "dia perfeito" e "streak" já refletem o clique que acabou de acontecer, não o estado anterior. Exibido via `showToast`, o mesmo sistema de toast já usado em todo o app — nenhum componente de UI novo.

## Teste

QA ao vivo: paciente com 1 único suplemento no dia, marcado — como é ao mesmo tempo o primeiro check-in E o dia fica perfeito (0 pendências), o sistema escolheu corretamente a categoria de maior prioridade disponível entre as que se aplicavam (`perfectDay` teve prioridade sobre `firstCheckin` na ordem implementada) e mostrou "Dia perfeito. Tudo o que era pra ser feito, foi feito." (uma das 2 variantes da categoria). Ao repetir o teste (desfazer e marcar de novo), a segunda variante ("Parabéns! Hoje você concluiu...") apareceu na segunda vez — confirma a seleção aleatória funcionando e a não-repetição.

## Arquivos

- `frontend/src/utils/motivationMessages.js` (novo)
- `frontend/src/pages/PatientDashboardPage.jsx` (integração)
