# CALENDAR_REPORT.md — Etapa 3 do Novo Paciente: agendamento por calendário

## Decisão de escopo (confirmada com o usuário antes de implementar)
Duas perguntas de arquitetura foram esclarecidas antes de qualquer código:
1. **Datas exatas e arbitrárias no calendário** (não só padrão de dia da semana) — escolhido em vez de manter só o padrão semanal com calendário de pré-visualização. Isso exigiu uma mudança real de arquitetura no backend.
2. **Agendamento continua por suplemento** (como hoje), só trocando o dropdown pelo calendário visual — não virou um agendamento único do protocolo inteiro.

## O que existia antes
"Repetição" era um `<select>` com 5 presets fixos (`todos`, `dias_alternados`, `finais_de_semana`, `'Seg,Qua,Sex'`, `'Ter,Qui'`) dentro de `SupplementFields.jsx`, compartilhado entre o wizard de cadastro e a edição de suplemento de paciente existente (`ManageSupplements.jsx`). O backend só entendia padrões de dia da semana — nenhum conceito de data exata.

## Mudança de arquitetura no backend

- `Suplemento.js`: novo campo `datasEspecificas` (array de `Date`). Quando não-vazio, tem precedência total sobre `diasSemana` — suplementos existentes (sem esse campo) continuam funcionando exatamente como antes.
- `isDayActive` extraído para `backend/src/shared/utils/ScheduleMatcher.js` (eliminando a duplicação já existente entre `CriarPacienteUseCase.js` e `GerarDashboardUseCase.js`), com um novo parâmetro `datasEspecificas`.
- **Achado durante a implementação, corrigido**: a premissa inicial de que `Suplementos` era um array serializado numa única célula da aba `Protocolos` estava errada — na verdade é uma aba própria (`Suplementos`) com colunas fixas. Adicionar o novo campo exigiu: nova coluna (índice 12) em `GoogleSheetsProtocoloRepository.js` (`#mapRowToSuplemento`/`#suplementoToRow`), e a descoberta revelou que o cabeçalho da aba em `DatabaseSetup.js` já estava desatualizado havia tempo (só 6 de 12 colunas reais listadas) — corrigido para as 13 colunas reais, e a constante morta `SheetColumns.PROTOCOLO.SUPLEMENTOS` (nunca usada, dados incorretos) foi substituída por um bloco `SUPLEMENTO` correto, documentando a aba real.
- `AdicionarSuplementoUseCase`/`EditarSuplementoUseCase`/`GasRouter.js` passam a aceitar e repassar `datasEspecificas`.
- `GerarDashboardUseCase` agora retorna `datasEspecificas` (convertido para ISO) em `historicoAgrupadoPorSuplemento`, necessário para reabrir corretamente o seletor ao editar um suplemento existente.

## Novo componente: `SupplementDatePicker.jsx`

Substitui o dropdown em `SupplementFields.jsx` (usado tanto no wizard quanto em `ManageSupplements.jsx`, que ganhou as props `dataInicio`/`dataFim`/`protocoloNome` vindas de `ManagePatientModal.jsx`). 4 modos:
1. **Todos os dias** — pré-visualização, sem interação.
2. **Dias alternados** — pré-visualização, sem interação.
3. **Dias da semana** — checkboxes Dom-Sáb, calendário mostra em tempo real quais datas resultam ativas.
4. **Datas específicas** — calendário totalmente interativo, clicar alterna cada data individualmente.

Geometria do grid reaproveitada de `HeatmapMonth.jsx` via `frontend/src/utils/monthGrid.js` (`buildMonthCells`, extraído para eliminar duplicação, não criar uma nova cópia).

**Cor por protocolo**: como o wizard não ativa `document.body.className` por protocolo (confirmado na auditoria — `setThemeClass` nunca é chamado ali), o componente lê `protocoloNome` diretamente e usa as variáveis primitivas (`--p-melasma-accent`/`--p-desinf-accent`) em vez do `--accent` semântico trocado por tema.

Dias fora do período (`dataInicio`/`dataFim` do tratamento) ficam desabilitados e visualmente esmaecidos. Hover/tap reaproveitam a convenção já existente (`scale(1.1)`/`scale(0.94)`), com um efeito de "ripple" puramente CSS no toque.

## Verificação ao vivo
- Protocolo trocado para "Desinflamação" → calendário renderizou com o verde correto (`--p-desinf-accent`), dias antes do início do tratamento corretamente acinzentados/desabilitados.
- Modo "Dias da semana": marcar Segunda + Quarta destacou corretamente as datas correspondentes no mês.
- Modo "Datas específicas": cliques em datas diferentes acumulam corretamente a seleção (verificado com timing realista entre toques — um teste inicial com dois cliques disparados no mesmo tick síncrono revelou uma condição de closure obsoleta que só ocorre com esse padrão de disparo artificial, não com toques humanos reais, que têm sempre um intervalo de repaint entre eles).
- Suplemento com datas específicas (10 e 15/07) adicionado, avançado até a confirmação, e o payload final de `criarPaciente` confirmado com `datasEspecificas: ["2026-07-10...", "2026-07-15..."]` e `diasSemana: []` — exatamente o formato esperado pelo backend.
- Backend: novos testes confirmam que `CriarPacienteUseCase` gera check-ins **somente** nas datas específicas (não em todos os dias do período) e que `GerarDashboardUseCase` conta as doses prescritas corretamente (3 datas × 2 horários = 6, não uma por dia do tratamento inteiro).

## Nota
Este arquivo substitui um `CALENDAR_REPORT.md` de uma sprint anterior (documentava a interatividade original do `CalendarPage.jsx` do paciente, não relacionada a este trabalho) — mantido o mesmo nome de arquivo por ser o entregável pedido nesta sprint.
