# RETROACTIVE_SECURITY.md — Segurança da Liberação Retroativa

## A vulnerabilidade original (ver `RETROACTIVE_AUDIT.md` para a análise completa)

`RegistrarCheckinUseCase.js` confiava no campo `forceRetroactive`, enviado pelo cliente no payload de `registrarCheckin`, sem nenhuma verificação no servidor:

```js
let isAllowedRetroactive = forceRetroactive; // confiado direto do payload
if (prescribedStr !== todayStr && !isAllowedRetroactive) { ... }
```

Qualquer paciente autenticado que manipulasse o payload (DevTools, replay de requisição) poderia se autoautorizar a registrar check-ins retroativos para qualquer data, sem depender de nenhuma liberação real. Mesmo o caminho "legítimo" (sem a flag) só verificava "existe alguma liberação ATIVA para este paciente" — nunca comparava com a data do check-in, então uma liberação por horas permitia preencher qualquer dia do histórico inteiro do tratamento.

## A correção

`forceRetroactive` foi **removido do contrato da API inteiramente** — não existe mais como campo lido em nenhum lugar do backend (`GasRouter.js` não o encaminha; `RegistrarCheckinUseCase.execute` não o desestrutura). A prova disso está no teste `"RegistrarCheckinUseCase bloqueia retroativo sem liberação e sem qualquer bypass client-side"` em `backend/tests/run_tests.js`, que envia `{ ...payload, forceRetroactive: true }` propositalmente e confirma que a rejeição continua ocorrendo.

A autorização passou a ser resolvida por uma única fonte, sempre no servidor:

```js
const liberacao = this.#liberacaoRepository.findAtivaParaPacienteEData(pId.value, datePrescrita);
if (!liberacao) throw new Error('Não é possível realizar check-ins retroativos sem uma liberação válida para esta data específica.');
```

`findAtivaParaPacienteEData` (`GoogleSheetsLiberacaoRetroativaRepository.js`) exige simultaneamente:
1. **Mesmo paciente** — `pacienteId` sempre vem do token JWT verificado (nunca do payload, para o papel PACIENTE — mesmo padrão já usado em `gerarDashboard`), não pode ser manipulado via URL/payload.
2. **Mesma data exata** — `dataLiberada.toDateString() === data.toDateString()`, comparação dia-a-dia, não um intervalo.
3. **Ainda dentro da janela de 24h** — `expiraEm > now`, recalculado a cada chamada. Não existe job/cron que "expira" a liberação; o campo `status` na planilha nunca é a fonte de verdade sozinho — mesmo uma linha com `status = 'ATIVA'` na planilha é rejeitada se `expiraEm` já passou (testado explicitamente em `"findAtivaParaPacienteEData - só casa data exata, ignora expiradas"`).

Como consequência, mesmo que o paciente altere URL, payload ou o frontend, não há caminho algum para registrar um check-in fora da data autorizada — a decisão nunca depende de nada que o cliente envie além de "qual data eu quero marcar", que é sempre comparada contra o registro do servidor.

## Auditoria

Cada concessão (`LiberarRetroativoUseCase`) e cada uso (`RegistrarCheckinUseCase`, quando uma liberação retroativa é de fato consumida) grava uma entrada via `AuditLogger` na aba `Auditoria`, contendo: operador que liberou, paciente, dados da liberação (data liberada, concedida em, expira em), motivo, e — no momento do uso — o check-in resultante e o timestamp de primeira utilização (`usadaEm`, gravado uma única vez, idempotente).

`ListarLiberacoesRetroativasUseCase` expõe ao admin, para cada liberação: `dataLiberada`, `concedidaEm`, `expiraEm`, `operadorId`, `motivo`, `status`, `usadaEm` e um campo derivado `ativa` (recalculado a cada listagem) — o que permite distinguir diretamente "utilizada" de "expirou sem uso" sem nenhum processo assíncrono adicional.

## Limitação conhecida e assumida: IP não capturável

Confirmado por leitura do código-fonte inteiro do backend e da documentação do contrato `doPost(e)` do Google Apps Script: **não existe nenhum campo no evento de requisição que exponha o IP do chamador** — nem no `e.parameter`/`e.postData` nem em qualquer lugar da API do Apps Script. O parâmetro `ip` do `AuditLogger` já existia antes desta sprint e sempre foi gravado como `'N/A'`, porque nunca houve como preenchê-lo. Esta reconstrução manteve esse mesmo comportamento honesto (documentado aqui, em vez de simular um valor) em vez de tentar capturar algo que a plataforma não disponibiliza. Se o registro de IP for um requisito real de compliance, exigiria um proxy/camada extra na frente do Apps Script (ex.: uma Cloud Function repassando `X-Forwarded-For`), fora do escopo desta reconstrução.

## Decisão de migração de dados

A aba antiga `PermissoesRetroativas` (modelo por horas) foi deixada intocada na planilha de produção — sem migração automática, já que `DatabaseSetup.js` só escreve cabeçalhos em abas vazias e uma migração de coluna manual sobre dados de produção seria arriscada e fora do escopo pedido. O app passa a usar exclusivamente a nova aba `LiberacoesRetroativas`; o histórico antigo continua acessível diretamente na planilha, mas não é mais lido nem exibido pelo app.

## Testes de segurança automatizados

`backend/tests/run_tests.js` (rodar com `node backend/tests/run_tests.js`) inclui, entre outros:
- Rejeição de check-in retroativo sem nenhuma liberação.
- Rejeição mesmo com `forceRetroactive: true` manualmente injetado no payload (prova de que o bypass antigo não existe mais).
- Rejeição quando existe liberação, mas para uma **data diferente** da que está sendo registrada.
- Aceitação apenas quando a liberação corresponde exatamente à data, com `usadaEm` sendo marcado.
- Rejeição após a liberação expirar, mesmo com `status` ainda `'ATIVA'` gravado na planilha.
- Validação de que `LiberarRetroativoUseCase` rejeita data futura e data anterior ao início do tratamento do paciente.

Todos os 22 testes do arquivo passam (`node backend/tests/run_tests.js`).
