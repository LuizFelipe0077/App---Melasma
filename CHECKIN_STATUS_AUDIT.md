# CHECKIN_STATUS_AUDIT.md — "Status de Check-in inválido"

## 1-3. Requisição / action / JSON de resposta

A tela "Central de Acompanhamento" (dashboard do paciente e visão do admin) chama a action **`gerarDashboard`** — [frontend/src/hooks/useDashboardData.js] → `ApiClient.call('gerarDashboard', { dataInicio, dataFim })` → roteado em [backend/src/infrastructure/controllers/GasRouter.js:151-158](backend/src/infrastructure/controllers/GasRouter.js#L151) para `GerarDashboardUseCase.execute()`.

`GerarDashboardUseCase` chama `checkinRepository.findByInterval(pacienteId, start, end)` ([GerarDashboardUseCase.js:100](backend/src/application/useCases/GerarDashboardUseCase.js#L100)), que por sua vez lê as linhas cruas da aba `Check_Ins` e converte cada uma em uma entidade de domínio via `CheckinMapper.toDomain(row)`.

## 4-5. Campo de status e valores possíveis

- **Campo**: `status`, coluna índice `5` da aba `Check_Ins` ([GoogleSheetsColumns.js:33](backend/src/infrastructure/repositories/GoogleSheetsColumns.js#L33): `CHECKIN.STATUS: 5`), correspondendo ao header `'status'` definido em [DatabaseSetup.js:42](backend/src/infrastructure/persistence/DatabaseSetup.js#L42).
- **Enum de domínio** ([backend/src/domain/entities/CheckIn.js:3-7](backend/src/domain/entities/CheckIn.js#L3)):
  ```js
  export const StatusCheckin = {
    CONCLUIDO: 'CONCLUIDO',
    ATRASADO: 'ATRASADO',
    PENDENTE: 'PENDENTE'
  };
  ```
  Só existem **3** valores válidos — nunca existiu um 4º valor no histórico deste enum (conferido em todo o histórico do git deste arquivo). Não existe "CANCELADO", "NAO_REALIZADO" ou "EM_ANDAMENTO" no domínio — esses eram só exemplos hipotéticos no seu pedido.

## 6-7. O que o frontend aceita — comparação

Busquei todos os usos de status de check-in no frontend ([CalendarPage.jsx](frontend/src/pages/CalendarPage.jsx), [HistoryPage.jsx](frontend/src/pages/HistoryPage.jsx), [DoseTimelineItem.jsx](frontend/src/components/DoseTimelineItem.jsx), [patientInsights.js](frontend/src/utils/patientInsights.js), [buildDayRecords.js](frontend/src/utils/buildDayRecords.js), [ChronologicalRecord.jsx](frontend/src/components/patientHistory/ChronologicalRecord.jsx)). Em todos os lugares o frontend compara exatamente contra `'CONCLUIDO'`, `'ATRASADO'`, `'PENDENTE'` — **os mesmos 3 valores do backend, sem nenhuma divergência**. O frontend nunca valida o enum de forma estrita (ele só compara igualdade de string em `if`s), então ele não é o que lança o erro "Status de Check-in inválido" — essa mensagem só existe em um lugar:

```js
// backend/src/domain/entities/CheckIn.js:35-37
if (!Object.values(StatusCheckin).includes(status)) {
  throw new Error(`Status de Check-in inválido: ${status}`);
}
```

**Não existe enum duplicado ou divergente entre frontend e backend.** Já estão unificados — não há nada para "unificar" nesse sentido. A causa é outra (seção 8).

## 8-9. Causa raiz

`CheckinMapper.toDomain(row)` ([backend/src/infrastructure/repositories/CheckinMapper.js:30-41](backend/src/infrastructure/repositories/CheckinMapper.js#L30), versão anterior à correção) construía `new CheckIn({..., status: row[5], ...})` **sem nenhum tratamento de erro**. Se **qualquer linha** da aba `Check_Ins` na planilha de produção tiver, na coluna `status`, um valor fora dos 3 aceitos — célula vazia, valor de uma versão antiga do app anterior a este redesign, uma edição manual na planilha, uma linha corrompida por deslocamento de coluna — o construtor de `CheckIn` lança a exceção, e **como não há nenhum try/catch entre o mapper e o `GasController`, essa exceção sobe direto e derruba a chamada inteira de `gerarDashboard` para aquele paciente** — inclusive todos os outros check-ins válidos dele, que nunca chegam a ser listados.

Como esse é um `new Error(...)` puro do domínio, com a correção da sprint anterior (Parte 1 — `GasController.js` não mascara mais mensagens de validação intencionais), a mensagem real passa a chegar ao frontend tal como é — por isso você passou a ver o texto específico "Status de Check-in inválido" em vez do genérico de antes: **a correção anterior está funcionando corretamente**, ela só revelou um problema de dado que já existia e estava sendo mascarado.

- **Valor recebido**: uma string fora de `{CONCLUIDO, ATRASADO, PENDENTE}` em alguma linha de `Check_Ins` na planilha de produção (não tenho acesso direto à planilha para apontar qual linha exatamente — ver seção de verificação abaixo).
- **Valor esperado**: `CONCLUIDO`, `ATRASADO` ou `PENDENTE`.
- **Arquivo/função/linha da causa raiz**: `backend/src/infrastructure/repositories/CheckinMapper.js`, método `toDomain`, linha 30 (versão anterior à correção) — falta de isolamento de erro por linha.

## 10. Correção aplicada (na origem, não um workaround)

**Não relaxei o enum nem passei a aceitar valores inválidos** — isso mascararia dado ruim como se fosse válido, o oposto do que a Parte 1 desta sprint corrigiu. Em vez disso, apliquei o mesmo padrão de isolamento de falha por linha que `ListarPacientesUseCase`/`PacienteMapper` já usam para pacientes (`.filter(p => p !== null)`), estendido para também **capturar e logar** o motivo, já que `PacienteMapper` filtra `null` mas não protege contra o `throw` em si — o `CheckinMapper` agora faz os dois:

**`backend/src/infrastructure/repositories/CheckinMapper.js`**:
```js
static toDomain(row) {
  if (!row || row.length === 0) return null;
  try {
    return new CheckIn({ ...status: row[SheetColumns.CHECKIN.STATUS]... });
  } catch (error) {
    console.error(`[CheckinMapper] Linha de Check_Ins ignorada (dado inválido): id=${row[SheetColumns.CHECKIN.ID]} status=${row[SheetColumns.CHECKIN.STATUS]} — ${error.message}`);
    return null;
  }
}
```

**`backend/src/infrastructure/repositories/GoogleSheetsCheckinRepository.js`** — `findByPacienteId` e `findByInterval` agora filtram `null` do resultado do mapper, igual ao padrão já usado para pacientes:
```js
return matches.map(r => CheckinMapper.toDomain(r)).filter(c => c !== null);
```

Efeito: uma linha corrompida é **ignorada e registrada no log (Stackdriver)** — visível e rastreável para quem for corrigir o dado na planilha — em vez de derrubar a tela inteira para o paciente inteiro. Os check-ins válidos desse mesmo paciente continuam aparecendo normalmente.

### Isso não corrige o dado em si

Esta correção impede que o dado ruim **quebre a aplicação**; ela não apaga nem corrige a linha malformada na planilha. Se você quiser localizar e corrigir a linha exata, procure nos logs do Apps Script (Execuções → Stackdriver) por `[CheckinMapper] Linha de Check_Ins ignorada` — a mensagem inclui o `id` da linha e o valor de `status` recebido, o suficiente para localizá-la na aba `Check_Ins` e corrigir manualmente (ou apagar, se for lixo de teste).

### Achado relacionado, não corrigido nesta sprint

`PacienteMapper.toDomain` (usado por `ListarPacientesUseCase`) tem exatamente a mesma fragilidade — filtra `null`, mas não protege contra `PacienteFactory.reconstitute` lançando exceção por dado inválido. Não apliquei a mesma correção lá porque não é o que foi reportado nem testado nesta sprint; sinalizo para você decidir se quer que eu aplique o mesmo padrão preventivamente.

## Teste de regressão

Novo teste em `backend/tests/run_tests.js`: **"CheckinMapper - linha com status inválido (dado legado/corrompido) não derruba a listagem"** — grava uma linha válida (`PENDENTE`) e uma corrompida (`status: 'CANCELADO'`) diretamente no repositório, e confirma que `findByPacienteId` retorna só a linha válida (sem lançar exceção) e que `findById` na linha corrompida retorna `null` em vez de lançar. **Resultado: 15/15 testes passando** (14 anteriores + este novo).
