# OPTIMISTIC_UI_REPORT.md — Parte 2

## Causa raiz da lentidão percebida

`PatientDashboardPage.handleCheck` fazia `await ApiClient.call('registrarCheckin', ...)` e só então chamava `reload()` — que dispara um **novo fetch completo** de `gerarDashboard`. A UI ficava presa no estado antigo (card mostrando "pendente") até essa segunda viagem de rede terminar. `DoseTimelineItem` ainda somava um `setTimeout(..., 260)` **antes** de sequer chamar `onCheck`, adiando o início da chamada de rede em mais um quarto de segundo. Nada disso era necessário — o resultado de `registrarCheckin` já vem com tudo que se precisa para atualizar a tela (`checkinId`, `status`, `streak`, `xpTotal`).

## Implementação

**`frontend/src/hooks/useDashboardData.js`**: novo `mutate(updater)`, wrapper fino sobre o `setData` que já existia (aceita valor ou função updater, como o `setState` do React):
```js
const mutate = useCallback((updater) => {
  setData((prev) => (typeof updater === 'function' ? updater(prev) : updater));
}, []);
```

**`frontend/src/pages/PatientDashboardPage.jsx`** — `applyOptimisticCheckin(dashboard, suplemento, checkin, action)`: função pura que replica exatamente a matemática que o backend já faz (`RegistrarCheckinUseCase`/`CancelarCheckinUseCase`: ±10 XP, ±1 streak, ±1 consumido, recalcula `taxaAdesaoGeral` e a taxa por suplemento). `handleCheck`:

1. Guarda `dashboard` atual.
2. `mutate(applyOptimisticCheckin(...))` — **síncrono, instantâneo**. Como `ProgressRing`, `HeatmapStrip` e o card do suplemento leem todos do mesmo objeto `dashboard`, uma única chamada atualiza os três ao mesmo tempo.
3. Mostra o toast (mensagem normal ou de marco motivacional — ver `MOTIVATION_SYSTEM.md`) imediatamente, sem esperar a rede.
4. Dispara `ApiClient.call('registrarCheckin', ...)` **sem bloquear** a UI.
5. Sucesso → `mutate()` de novo, mas só para trocar o `id` temporário/otimista pelo `checkinId` real e sincronizar `streak`/`xpTotal` com os valores exatos que o backend calculou — sem re-fetch, sem re-mostrar loading.
6. Falha → `mutate(previous)` (rollback completo) + `showError(err.message)` (mensagem específica, já corrigida em sprint anterior).

`handleUndo` segue o mesmo padrão. `handleCompleteAll` (botão "Concluir todos") recebeu o mesmo tratamento — aplica o optimistic update para todos os pendentes de uma vez, fecha o Sheet de confirmação na hora, e só reverte tudo se **todas** as chamadas de rede falharem (falha parcial é tolerada, mesmo comportamento de antes).

**`frontend/src/components/DoseTimelineItem.jsx`**: removido o `setTimeout` de 260ms antes de chamar `onCheck` — a chamada agora é imediata; a animação de mola no botão roda em paralelo, não em série.

## "Atualizar calendário" — interpretação

A rota `/paciente/calendario` é uma página separada com seu próprio fetch, e este app não tem (nem deveria ganhar, para este pedido) um cache global entre páginas — a arquitetura é deliberadamente sem Redux/React Query. O calendário já reflete o novo check-in normalmente na próxima vez que é visitado (fetch novo, backend já atualizado). O "atualizar calendário" tratado nesta parte é o `HeatmapStrip` ("Sua semana") da própria página do dashboard, que está 100% coberto pelo `mutate()`.

## Teste — prova ao vivo de que é realmente otimista

QA em navegador com mock de `registrarCheckin` propositalmente atrasado em **2 segundos**:
- 50ms após o clique: `ProgressRing` já em 100%, "Hoje faltam 0 suplementos" já visível, toast de marco já exibido — tudo **antes** do mock sequer responder.
- Aos ~2.5s: resposta do mock chega, `dataHoraRealizada`/`status` reconciliados silenciosamente, sem flash de loading.

Segundo teste — **rollback em falha simulada**: mock de `registrarCheckin` retornando erro de validação específico ("Falha simulada de sincronização."). Resultado: UI volta para 0%/pendente, contador de "Hoje faltam" restaurado para 1, toast de erro mostra a mensagem exata do backend (não uma genérica).

## Regressão

`npm run build` do frontend sem erros. Nenhuma mudança de contrato de API — `registrarCheckin`/`cancelarCheckin` continuam recebendo e devolvendo exatamente o mesmo formato de antes.
