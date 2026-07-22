# BUGFIX_REPORT.md — Visão geral dos bugs corrigidos nesta sprint

Esta sprint corrigiu 2 bugs de causa raiz confirmada. Cada um tem um relatório dedicado com a investigação completa; este documento é o índice executivo.

## Bug 1 — Mensagem de erro genérica mascarando erros reais

**Relatório completo**: [ERROR_HANDLING_REPORT.md](ERROR_HANDLING_REPORT.md)

**Causa raiz**: `GasController.js` descartava `error.message` para qualquer erro não-401, trocando por uma frase fixa — inclusive para mensagens de validação de negócio já escritas à mão e seguras para exibir, e sem logar nada, então bugs reais também desapareciam sem rastro.

**Correção**: distinguir por `error.constructor === Error` (erro de domínio intencional → mostra mensagem real) de qualquer outra classe de erro (bug inesperado → mensagem genérica, mas agora logado via `console.error`/Stackdriver). Frontend ganhou classificação de erros de rede/timeout/sessão para complementar.

**Status**: corrigido, testado, sem regressão (14/14 testes de backend).

## Bug 2 — Marcar → cancelar → marcar de novo falha

**Relatório completo**: [CHECKIN_REPORT.md](CHECKIN_REPORT.md)

**Causa raiz**: `RegistrarCheckinUseCase` tratava qualquer linha de check-in existente como duplicata, mesmo quando ela já tinha sido revertida para `PENDENTE` por um cancelamento anterior.

**Correção**: só bloquear como duplicata linhas `CONCLUIDO`/`ATRASADO`; reaproveitar (não recriar) uma linha `PENDENTE` existente para o mesmo slot.

**Status**: corrigido, testado (novo teste automatizado dedicado + QA manual do ciclo completo), sem regressão.

## Escopo do que NÃO foi alterado

Nenhuma das duas correções mudou: contrato de request/response de nenhuma action, estrutura das abas do Google Sheets, regras de negócio de autenticação, ou qualquer action existente além dos 2 arquivos de caso de uso/controller citados acima. Ambas seguem o padrão aditivo já usado no resto do projeto.

## Commits

- `b46806f` — fix: stop masking real error messages + fix mark-cancel-mark check-in bug
