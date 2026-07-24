# RETROACTIVE_V2_REPORT.md — Auditoria e correções do fluxo de Retroativo

## Causa raiz de cada problema (Partes 1-5), confirmada por auditoria antes de qualquer alteração

### Parte 1 — Performance
`RetroactiveCard.jsx` e `CalendarPage.jsx` faziam, cada um, seu próprio `useEffect` + `ApiClient.call('obterLiberacaoRetroativaAtiva', {})` independente, sem cache — nada era pré-carregado no login, ao contrário do dashboard normal (`PatientDashboardPage.jsx` já fazia `prefetchDashboard` para Histórico/Calendário desde a sprint anterior). Pior: `RetroactiveCheckinSheet.jsx` ignorava por completo o cache já existente (`useDashboardData.js`), chamando `gerarDashboard` cru a cada abertura — daí o atraso perceptível "Dashboard → Registrar Retroativo → Carrega → Abre".

**Causa raiz:** ausência de qualquer camada de cache/prefetch para dados de liberação retroativa, e um componente que reimplementava sua própria busca em vez de reaproveitar a infraestrutura já existente.

### Parte 2 — Check-in não otimista
`RetroactiveCheckinSheet.jsx`'s `handleCheck`/`handleUndo` chamavam `registrarCheckin`/`cancelarCheckin` e **depois** `load()` — um segundo round-trip completo (1-3s cada) por toque, com tela recarregando visivelmente.

**Causa raiz:** o padrão otimista já existente em `PatientDashboardPage.jsx` (`applyOptimisticCheckin` + `mutate()` síncrono) nunca foi reaproveitado neste componente.

### Parte 3 — Resumo de suplementos não aparece
```js
const isoDate = new Date(`${data}T00:00:00`).toISOString();
ApiClient.call('gerarDashboard', { dataInicio: isoDate, dataFim: isoDate });
```
`dataInicio` e `dataFim` eram o **mesmo instante exato** (meia-noite local). `GoogleSheetsCheckinRepository.findByInterval` compara `>= startMs && <= endMs` — um intervalo de largura zero só bate com um check-in prescrito literalmente às 00:00:00, o que nunca acontece (doses são às 08:00, 20:00 etc). Não era bug de timezone, UUID, parser, cache, mapper ou filtro — era um intervalo de um único milissegundo, presente tanto em `ReleaseModal.jsx` quanto em `RetroactiveCheckinSheet.jsx` (mesmo bug, duas cópias).

### Parte 4 — Só um retroativo aparece
`GoogleSheetsLiberacaoRetroativaRepository.findAtivaByPacienteId` retornava no primeiro match do loop e parava. `ObterLiberacaoRetroativaAtivaUseCase` devolvia um objeto único ou `null`, nunca array. `RetroactiveCard.jsx`/`CalendarPage.jsx` só sabiam lidar com um objeto — mesmo que o backend retornasse mais, não havia estrutura de dados nem UI para exibir mais de um.

**Importante:** `findAtivaParaPacienteEData` (o método de segurança usado em `RegistrarCheckinUseCase`) já filtrava por data exata corretamente — múltiplos retroativos simultâneos nunca foram um problema de segurança, só de exibição.

### Parte 5 — Sem confirmação
`ReleaseModal.jsx` chamava `onSubmit` direto no submit do formulário, sem nenhum passo de confirmação intermediário.

## Correções aplicadas

| Parte | O que mudou |
|---|---|
| 1 | Novo hook `frontend/src/hooks/useLiberacoesData.js`, espelhando `useDashboardData.js` (cache TTL 60s, stale-while-revalidate, `mutate`). `PatientDashboardPage.jsx` monta o hook e pré-carrega o dia de cada liberação ativa via `prefetchDashboard`. |
| 2 | `RetroactiveCheckinSheet.jsx` reescrito para usar `useDashboardData` (não `gerarDashboard` cru) + `applyOptimisticCheckin` (extraído para `frontend/src/utils/checkinSlots.js`, reaproveitado do dashboard principal) — `mutate()` síncrono antes da rede, rollback + mensagem específica na falha. |
| 3 | `dayRange(data)` real (00:00:00 a 23:59:59) em `ReleaseModal.jsx` e `RetroactiveCheckinSheet.jsx`, substituindo o instante único. |
| 4 | Backend: `findAllAtivasByPacienteId` (todas as liberações ativas, ordenadas por `expiraEm`), `ListarLiberacoesRetroativasAtivasUseCase` retorna array, ação renomeada para `listarLiberacoesRetroativasAtivas`. Frontend: `RetroactiveCard.jsx` virou uma lista/accordion ("Retroativos disponíveis", cada entrada com seu próprio countdown e botão "Registrar"); `CalendarPage.jsx` destaca todos os dias liberados simultaneamente. |
| 5 | `ReleaseModal.jsx` ganhou `useConfirm()` com o texto exato pedido antes de chamar `onSubmit`. |

## Verificação ao vivo (browser preview, `fetch` mockado)

- **Prefetch instantâneo**: com duas liberações ativas mockadas, clicar "Registrar" no card fez **zero novas chamadas de rede** (`newCallsMade: 0`) e o conteúdo apareceu em menos de 150ms — confirma que o dia já estava aquecido pelo prefetch do dashboard.
- **Check-in otimista**: `.dose-card` mudou para `done` em 20ms após o toque (antes de qualquer resposta de rede plausível), sem spinner nem recarregamento.
- **Rollback com mensagem específica**: uma falha simulada de `registrarCheckin` mostrou o toast exato `"Check-in já foi registrado por outro dispositivo."` (não uma mensagem genérica) e reverteu o estado visual corretamente.
- **Resumo de suplementos**: confirmado aparecendo com os dois suplementos do dia e seus horários corretos no `ReleaseModal`.
- **Múltiplos retroativos**: card exibiu "Retroativos disponíveis" com duas datas (22/07 e 19/07), a primeira expandida por padrão com seu countdown independente; calendário destacou ambos os dias com anel azul + 🔓.
- **Confirmação**: clicar "Autorizar" abriu um segundo Sheet com o texto exato "Confirmar autorização / Deseja realmente liberar o registro retroativo do dia: 23/07/2026 para este paciente? Esta autorização expirará automaticamente em 24 horas." — só após "Confirmar" a chamada `liberarRetroativo` foi disparada.

Backend: 26/26 testes automatizados passando (`node backend/tests/run_tests.js`), incluindo o novo teste de múltiplos retroativos simultâneos com expiração independente.
