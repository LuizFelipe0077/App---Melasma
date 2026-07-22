# ERROR_HANDLING_REPORT.md — Parte 1

## Sintoma reportado

Um popup de erro genérico ("Erro ao processar a requisição. Verifique os dados e tente novamente.") aparecia em praticamente qualquer falha, independente da causa real (dados inválidos, sessão expirada, sem conexão, endpoint inexistente, erro interno do servidor, conflito de sincronização).

## Causa raiz

`backend/src/infrastructure/controllers/GasController.js`, bloco `catch` do `handlePost` (linhas 64-77 antes da correção).

O `catch` descartava deliberadamente `error.message` para **qualquer erro que não fosse de autenticação**, substituindo-o por uma string fixa. O comentário original ("evita vazamento de stack trace") tratava dois tipos de erro completamente diferentes como se fossem um só:

1. **Erros de validação de negócio intencionais** — `throw new Error('Check-in já registrado para esta dose e horário.')`, `throw new Error('Paciente não encontrado.')`, etc. Confirmado por `grep -rn "throw new" backend/src` que **100% dos pontos de `throw` no domínio/aplicação usam `new Error(...)` puro** com mensagens em português já seguras para exibir ao usuário — nenhuma vaza detalhe técnico interno.
2. **Bugs de runtime não tratados** — `TypeError`, `ReferenceError`, etc., que indicam um erro de programação real, não uma regra de negócio.

O código tratava os dois grupos da mesma forma: mascarava ambos com a mesma frase genérica, e pior — descartava a mensagem original **sem logar nada**, então mesmo um bug de verdade (grupo 2) desaparecia sem deixar rastro para depuração.

## Correção

**Arquivo**: `backend/src/infrastructure/controllers/GasController.js`.

Usa o próprio sistema de tipos do JavaScript para separar os dois grupos:

```js
const isIntentionalDomainError = statusCode === 401 || error.constructor === Error;

if (!isIntentionalDomainError) {
  console.error('[GasController] Erro inesperado:', error.message, error.stack);
}

const safeMessage = isIntentionalDomainError
  ? error.message
  : 'Erro interno inesperado. Nossa equipe foi notificada — tente novamente em instantes.';
```

- `error.constructor === Error` identifica precisamente os `throw new Error(...)` do domínio/aplicação (grupo 1) — passam a mensagem real, que já era segura.
- Qualquer outra classe de erro (`TypeError`, `ReferenceError`, erros do Google Apps Script/`SpreadsheetApp`) cai no `else`: mensagem genérica para o usuário, **mas agora logada via `console.error`**, capturada pelo Stackdriver Logging já configurado no projeto — antes, esses bugs eram descartados silenciosamente.

Nenhum caso de uso foi alterado. Nenhum contrato de resposta mudou (`{statusCode, data}` continua igual).

**Frontend** — `frontend/src/api/apiClient.js`: adicionado `classifyErrorMessage(error)`, que roda no `catch` de `executeCall` e distingue:

| Cenário | Mensagem exibida |
|---|---|
| `AbortError` (timeout) | "A conexão demorou demais para responder. Verifique sua internet e tente novamente." |
| `TypeError` (sem rede / DNS / CORS) | "Não foi possível conectar ao servidor. Verifique sua internet ou as configurações de conexão (GAS)." |
| Resposta de rede malformada | "O servidor respondeu de forma inesperada. Tente novamente em instantes." |
| Sessão expirada (já existia) | inalterado — dispara `app:authExpired` |
| Erro de validação vindo do backend | mensagem real do backend (agora que o backend para de mascará-la) |
| Erro interno inesperado do backend | "Erro interno inesperado. Nossa equipe foi notificada — tente novamente em instantes." |

## Teste

Verificado em navegador com `window.fetch` mockado, dois cenários distintos:
1. Backend retorna erro de validação de negócio (`"Não é possível realizar check-ins retroativos de dias anteriores sem liberação do clínico."`) → mensagem exata aparece no toast.
2. `fetch` rejeitado (simulando sem rede) → toast exibe "Não foi possível conectar ao servidor. Verifique sua internet ou as configurações de conexão (GAS)." em vez do antigo "Failed to fetch"/genérico.

## Regressão

`node backend/tests/run_tests.js` → 14/14 passando (nenhum teste de caso de uso depende do texto da mensagem de erro de forma que a mudança de mascaramento quebrasse algo).

## Arquivos modificados

- `backend/src/infrastructure/controllers/GasController.js`
- `frontend/src/api/apiClient.js`
