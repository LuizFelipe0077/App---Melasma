# RETROACTIVE_AUDIT.md — Auditoria da funcionalidade "Liberar Retroativo"

Data: 2026-07-23
Branch: `redesign/frontend-v2`

## Veredito resumido

- **Admin → conceder liberação**: funciona, mas o modelo de dados é **por horas**, não **por data**. Não existe campo de data alvo em lugar nenhum.
- **Backend → validar check-in retroativo**: **quebrado e inseguro**. A flag `forceRetroactive` enviada pelo cliente é confiada sem nenhuma verificação no repositório. Mesmo no caminho "legítimo", a checagem só confirma "existe alguma liberação ATIVA para este paciente" — nunca compara a data do check-in com a data liberada, porque essa data nunca foi registrada.
- **Paciente → visualizar/usar a liberação**: **não existe**. Nenhum card, nenhum destaque no calendário, nenhuma tela de retroativo, nenhuma chamada de `registrarCheckin` fora do dia atual em todo o frontend.
- **Revogação**: não existe método de revogar uma liberação concedida; ela só some quando `expiraEm` (relativo à hora da concessão) passa naturalmente.
- **Rastreabilidade check-in ↔ liberação**: não existe. A planilha `Check_Ins` não tem coluna `permissaoId`.

## Causa raiz

O desenho original tratou "liberação retroativa" como uma **janela de tempo genérica** (`horasLiberadas`, 1–72h a partir da concessão), não como **autorização de uma data específica**. Isso se propaga em cascata:

1. `LiberarEdicaoRetroativaUseCase` (`backend/src/application/useCases/LiberarEdicaoRetroativaUseCase.js:16-56`) recebe `{ pacienteId, horasLiberadas, motivo, operadorId }` — sem `dataLiberada`.
2. `GoogleSheetsPermissaoRepository.findActiveByPacienteId` (`backend/src/infrastructure/repositories/GoogleSheetsPermissaoRepository.js:18-42`) só sabe responder "este paciente tem alguma liberação ATIVA?" — não tem o que comparar com a data do check-in, porque a data nunca foi salva.
3. `RegistrarCheckinUseCase` (`backend/src/application/useCases/RegistrarCheckinUseCase.js:59-75`):
   ```js
   let isAllowedRetroactive = forceRetroactive;
   if (prescribedStr !== todayStr && !isAllowedRetroactive) {
     if (this.#permissaoRepository) {
       const activePerm = this.#permissaoRepository.findActiveByPacienteId(pId.value);
       if (activePerm) isAllowedRetroactive = true;
     }
     if (!isAllowedRetroactive) throw new Error('...');
   }
   ```
   Se `forceRetroactive === true`, o bloco inteiro é pulado — **o repositório nunca é consultado**. Como essa flag chega direto do payload (`GasRouter.js:59-68`, rota `registrarCheckin` exige apenas token de paciente autenticado, não de admin), **qualquer paciente autenticado pode se autoautorizar** enviando `forceRetroactive: true` no payload, para qualquer data.
4. Mesmo sem essa flag, uma única liberação de 24h permite ao paciente preencher **qualquer dia anterior do histórico inteiro**, não apenas o dia pretendido pelo clínico — porque não há vínculo entre a liberação e uma data.
5. **Nenhum código frontend** atualmente envia `forceRetroactive` (confirmado por busca em todo `frontend/src`) — o bug de segurança está latente, não explorado por nenhuma tela existente, mas o endpoint não tem defesa própria caso o payload seja manipulado diretamente (URL, DevTools, replay de requisição).
6. O lado do paciente nunca foi construído: `PatientDashboardPage.jsx` monta apenas os slots de **hoje** (`buildTodaySlots`, hardcoded em `new Date().toDateString()`); `CalendarPage.jsx` tem só uma frase estática informando que "dias anteriores só podem ser preenchidos com liberação do seu profissional" — sem indicar se existe liberação ativa, sem destaque no calendário, sem botão de ação.

## Mapa completo (o que existe hoje)

| Área | Estado | Local |
|---|---|---|
| Conceder liberação (admin) | Funciona, mas por horas, não por data | `LiberarEdicaoRetroativaUseCase.js` |
| Histórico de liberações (admin) | Funciona | `ListarPermissoesRetroativasUseCase.js`, exibido em `PatientHistoryPage.jsx` |
| Persistência | Funciona | `GoogleSheetsPermissaoRepository.js` → planilha `PermissoesRetroativas` |
| Revogar liberação | Não existe | nenhum `update()`/revoke no repositório |
| Liberação vinculada a uma data específica | Não existe | DTO sem campo de data; lookup é paciente-wide |
| Validação backend do check-in retroativo | Quebrada/insegura | `RegistrarCheckinUseCase.js:59-75` |
| `forceRetroactive` acessível por não-admin | Falha de segurança | `GasRouter.js:59-68` |
| Cobertura de teste da validação | Nenhuma | testes passam `null` como `permissaoRepository` |
| Paciente vê liberação ativa | Não existe | nada em `PatientDashboardPage.jsx`; frase estática em `CalendarPage.jsx:128-131` |
| Paciente registra check-in retroativo | Não existe | nenhuma chamada de `registrarCheckin` fora do dia atual em todo o app |
| Rastreabilidade check-in ↔ liberação | Não existe | planilha `Check_Ins` sem coluna `permissaoId` |

## Conclusão

Não é um bug pontual — é uma funcionalidade **meio-construída**: a metade administrativa existe (com o modelo de dados errado, por horas em vez de por data), e a metade do paciente nunca foi implementada. A reconstrução completa pedida é o caminho correto; um "conserto" pontual não resolveria a ausência de UI do paciente nem a falta de vínculo data-específica na validação de segurança.

A arquitetura de reconstrução está detalhada em `RETROACTIVE_UX.md` e `RETROACTIVE_SECURITY.md`.
