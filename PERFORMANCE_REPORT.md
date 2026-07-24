# PERFORMANCE_REPORT.md

## Regra seguida nesta sprint
Nenhuma funcionalidade nova poderia aumentar o número de chamadas de rede, criar renders desnecessários ou duplicar requests. Aplicado como disciplina em cada parte, não como uma etapa isolada.

## Onde havia duplicação/ausência de cache (antes)
- `RetroactiveCard.jsx` e `CalendarPage.jsx` chamavam `obterLiberacaoRetroativaAtiva` cada um independentemente, sem cache — duas chamadas da mesma informação em navegações diferentes, nenhuma delas reaproveitando a outra.
- `RetroactiveCheckinSheet.jsx` chamava `gerarDashboard` cru a cada abertura, ignorando o cache já existente (`useDashboardData.js`) mesmo quando o dia já tinha sido buscado por outra tela.
- `isDayActive` (padrão de dia da semana) estava duplicado palavra-por-palavra em `CriarPacienteUseCase.js` e `GerarDashboardUseCase.js` — risco de as duas cópias divergirem silenciosamente com o tempo.
- `buildCells` (geometria do grid de calendário) só existia dentro de `HeatmapMonth.jsx`, sem reuso possível para o novo seletor de datas do suplemento.
- `applyOptimisticCheckin`/`buildTodaySlots` só existiam dentro de `PatientDashboardPage.jsx`.

## O que foi extraído/compartilhado nesta sprint (elimina duplicação existente, não cria nova)
- `frontend/src/hooks/useLiberacoesData.js` — cache único para liberações ativas, consumido por `RetroactiveCard` e `CalendarPage`.
- `frontend/src/utils/checkinSlots.js` — `buildSlotsForDate`/`applyOptimisticCheckin`, usado por `PatientDashboardPage` e `RetroactiveCheckinSheet`.
- `backend/src/shared/utils/ScheduleMatcher.js` — `isDayActive` único, usado por `CriarPacienteUseCase` e `GerarDashboardUseCase`.
- `frontend/src/utils/monthGrid.js` — `buildMonthCells` único, usado por `HeatmapMonth` e o novo `SupplementDatePicker`.

## Prefetch (Stale-While-Revalidate)
`useDashboardData.js` já implementava SWR — pinta o valor em cache instantaneamente e revalida em background se expirado (`isFresh`). Não foi necessário reinventar: `useLiberacoesData.js` segue exatamente o mesmo padrão (`Map` em module scope, TTL de 60s, `mutate`).

`PatientDashboardPage.jsx` agora monta `useLiberacoesData()` (aquecendo o cache compartilhado no login) e, para cada liberação ativa, dispara `prefetchDashboard` do dia exato — assim quando o usuário toca "Registrar Retroativo" ou clica no dia com cadeado, a tela abre sem esperar.

**Medido ao vivo**: abrir a tela de retroativo após o prefetch resultou em **0 chamadas de rede novas** e conteúdo visível em menos de 150ms.

## Renders desnecessários
- `RetroactiveCheckinSheet`/`RetroactiveCard` usam `useMemo` para os cálculos derivados (slots, range do dia) e dependem de chaves estáveis (`dataLiberada`, `liberacao.id`) — nenhum `useEffect` novo refaz fetch a cada render.
- `SupplementDatePicker` só recalcula `isDateActive` por célula durante a própria renderização do grid (não em efeitos), e o estado do mês (`cursor`) é local ao componente.

## Verificação
- `node backend/tests/run_tests.js`: 26/26 passando.
- `npm run build` (frontend e backend): limpo, sem warnings novos além dos já existentes (tamanho de bundle, pré-existente).
