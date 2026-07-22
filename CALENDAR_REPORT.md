# CALENDAR_REPORT.md — Parte 4

## Objetivo

Tornar o calendário do paciente (`frontend/src/pages/CalendarPage.jsx`) totalmente interativo: clicar em qualquer dia deve abrir um painel com data, número do dia de tratamento, status, suplementos/horários/check-ins/pendências daquele dia.

## Estado anterior

`CalendarPage.jsx` só desenhava o heatmap mensal (`HeatmapMonth`) sem nenhuma interação — as células eram puramente visuais.

## Mudanças

### Backend (1 mudança aditiva, necessária)

`LoginUseCase.execute()` não retornava `dataInicio`/`dataFim` do paciente no payload de login — o front não tinha como calcular "Dia N de M" nem "dias restantes" no lado do paciente (o admin já tinha esse dado via `listarPacientes`). Adicionados os dois campos, só no branch `role: 'PACIENTE'`:

```js
return {
  token, role: 'PACIENTE', userId: paciente.id.value, nome: paciente.nome,
  protocoloNome: paciente.protocoloNome,
  dataInicio: paciente.dataInicio.toISOString(),
  dataFim: paciente.dataFim.toISOString()
};
```

Mesmo padrão aditivo já usado nesta sessão para `maiorStreak`/`protocoloNome` — nenhum campo existente foi removido ou renomeado.

`AuthContext.jsx`: `readSession()` passa a ler `USER_DATA_INICIO`/`USER_DATA_FIM` do `sessionStorage`; `login()` grava os dois se presentes na resposta.

### Frontend

**`HeatmapMonth.jsx`** reescrito para aceitar `days` (array de `{date, dayNumber, status, checkins}` — o mesmo formato produzido por `buildDayRecords()`, já usado na Central de Acompanhamento do admin) e um callback `onDayClick`. Cada célula agora tem `role="button"`, `aria-label`, classe `clickable` e classe `today` quando a data bate com o dia atual.

**`CalendarPage.jsx`** reescrito:
- Lê `session.dataInicio`/`session.dataFim` de `useAuth()`.
- `treatmentInfo` (memo): calcula `{total, remaining, endLabel}` → renderizado como "Faltam N dias para o fim do tratamento — término previsto em DD/MM/AAAA." no cabeçalho.
- Estado `selectedDay` + `Sheet` (componente já existente, reaproveitado — nenhum novo padrão de UI introduzido) aberto ao clicar em um dia:
  - Título: "Dia {dayNumber} de {total}".
  - Descrição: data completa por extenso.
  - Corpo:
    - Dia futuro → **"O tratamento deste dia ainda não foi iniciado."** (sem lista, não inventa dado que não existe).
    - Dia sem nenhum check-in registrado → "Nenhuma dose registrada neste dia."
    - Caso contrário → lista de cada check-in com nome do suplemento, horário prescrito, horário do check-in (se houve) e chip de status (✔ Tomou / ✔ Tomou (atrasado) / ✖ Não tomou).
    - Se um dia **passado** (não hoje) tem alguma dose `PENDENTE` → nota adicional: "Dias anteriores só podem ser preenchidos com liberação do seu profissional." — a regra real do backend (retroativo exige liberação), não uma 5ª categoria visual inventada sem dado confiável para sustentá-la.
- Legenda de 4 itens abaixo do calendário, reaproveitando as mesmas classes CSS do heatmap: Concluído / Parcial / Sem check-in / Futuro.

**`global.css`**: estilos novos para `.heatmap-month-cell.future/.clickable/.today`, `.calendar-legend`, `.calendar-legend-item`, `.calendar-legend-swatch`, `.day-detail-row` — todos aditivos, nenhum estilo existente alterado.

## Teste

QA manual em navegador (dados mockados localmente):
- Clique no dia atual (Dia 22 de 91) → painel mostra os suplementos do dia com status correto.
- Clique num dia futuro → "O tratamento deste dia ainda não foi iniciado." exibido corretamente, sem lista.
- Clique num dia passado sem registro → "Nenhuma dose registrada neste dia." exibido corretamente.
- Fechamento do painel via botão de fechar e via Escape, ambos funcionando.

## Regressão

Nenhum teste de backend afetado além do já coberto por `LoginUseCase` (`node backend/tests/run_tests.js` → 14/14, incluindo o teste "Caso de Uso - LoginUseCase do Paciente e Administrador", que segue passando com os 2 campos novos presentes no retorno). `npm run build` do frontend concluído sem erros.

## Arquivos modificados

- `backend/src/application/useCases/LoginUseCase.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/components/HeatmapMonth.jsx`
- `frontend/src/pages/CalendarPage.jsx`
- `frontend/src/styles/global.css`
