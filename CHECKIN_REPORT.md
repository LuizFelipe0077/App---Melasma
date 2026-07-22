# CHECKIN_REPORT.md — Parte 3

## Sintoma reportado

Fluxo: marcar um suplemento como tomado → desmarcar (cancelar) → tentar marcar de novo → sistema mostra erro.

## Causa raiz

`backend/src/application/useCases/RegistrarCheckinUseCase.js`, guarda de duplicidade.

`cancelarCheckin` **não apaga** a linha do check-in — só reverte o `status` para `PENDENTE` via `CheckIn.revert()`. Essa é a escolha correta de design (preserva auditoria/histórico da linha). O problema estava do outro lado: a guarda de duplicidade de `registrarCheckin` considerava **qualquer** linha existente para aquele paciente+suplemento+slot como duplicata, independente do status:

```js
// antes
const duplicate = existingCheckins.some(c => c.suplementoId.equals(sId));
if (duplicate) throw new Error('Check-in já registrado para esta dose e horário.');
```

Ao marcar de novo depois de cancelar, o `find` encontrava a própria linha que tinha acabado de voltar para `PENDENTE` e a tratava como se já estivesse concluída — mesmo ela estando, na prática, disponível para ser preenchida de novo. Esta é a mesma causa raiz identificada anteriormente nesta sessão para as linhas pré-geradas na criação de paciente (sinalizada então como tarefa separada); aqui ela foi confirmada como a causa exata do fluxo relatado pelo usuário e corrigida na origem.

## Correção

**Arquivo**: `backend/src/application/useCases/RegistrarCheckinUseCase.js`.

1. A guarda de duplicidade agora só bloqueia se a linha existente **não** estiver `PENDENTE`:
```js
const existingForSlot = existingCheckins.find(c => c.suplementoId.equals(sId));
if (existingForSlot && existingForSlot.status !== StatusCheckin.PENDENTE) {
  throw new Error('Check-in já registrado para esta dose e horário.');
}
```
2. Se existir uma linha `PENDENTE` para o mesmo slot, ela é **reaproveitada** em vez de criar uma linha nova:
```js
const checkin = existingForSlot || new CheckIn({ ... status: StatusCheckin.PENDENTE, ... });
checkin.confirmIngestion(dateRealizada, 60, isAllowedRetroactive);
```
3. Persistência correspondente: `update()` na linha reaproveitada, `save()` só para linha genuinamente nova.

Isso é seguro porque `CheckIn.confirmIngestion()` (entidade de domínio) já valida internamente `if (this.#status !== StatusCheckin.PENDENTE) throw new Error('Check-in já foi realizado anteriormente.')` — não há caminho para confirmar duas vezes a mesma linha por acidente.

**Gamificação**: `cancelarCheckin` já debita o XP/streak concedido no momento do cancelamento. Reaproveitar a linha e chamar `confirmIngestion()` de novo credita normalmente — o ciclo marcar→cancelar→marcar fecha em XP líquido de uma única confirmação, sem sobra nem déficit.

## Teste

Novo teste automatizado em `backend/tests/run_tests.js` — **"Caso de Uso - RegistrarCheckin após CancelarCheckin no mesmo slot (marcar -> cancelar -> marcar de novo)"**:
1. Cria paciente + suplemento.
2. Marca → assert `status === CONCLUIDO`.
3. Cancela → assert `status === PENDENTE` (revertido).
4. Marca de novo → assert `status === CONCLUIDO` **e** mesmo `checkinId` reaproveitado (não um novo registro).
5. Assert `checkinRepo.findByPacienteId(...).length === 1` — nenhuma linha duplicada criada.
6. Assert `gamificacao.xpTotal === 10` e `streakAtual === 1` — crédito único, sem duplicação.

Além disso, QA manual em navegador com mock stateful de `fetch` reproduzindo o ciclo completo do usuário (marcar → UI mostra "desfazer" → cancelar → UI volta a mostrar "marcar" → marcar de novo → UI mostra "desfazer" de novo), sem nenhum erro em nenhuma etapa.

## Regressão

`node backend/tests/run_tests.js` → 14/14 passando, incluindo o teste novo e o teste pré-existente de `CancelarCheckinUseCase` (guarda de propriedade/reversão), que continua passando sem alteração.

## Arquivos modificados

- `backend/src/application/useCases/RegistrarCheckinUseCase.js`
- `backend/tests/run_tests.js` (teste novo)
