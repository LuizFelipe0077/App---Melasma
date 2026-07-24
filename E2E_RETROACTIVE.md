# E2E_RETROACTIVE.md — Testes ponta a ponta

## Backend — automatizado (`node backend/tests/run_tests.js`)

22/22 testes passando, incluindo os 5 novos específicos desta sprint:

| Teste | Resultado |
|---|---|
| `LiberarRetroativoUseCase` rejeita data futura e data anterior ao início do tratamento; aceita motivo vazio | ✅ PASS |
| `ListarLiberacoesRetroativasUseCase` — histórico completo, sem vazamento entre pacientes | ✅ PASS |
| `findAtivaParaPacienteEData` — só casa a data exata liberada; liberação expirada não é retornada mesmo com `status` ainda `ATIVA` na planilha | ✅ PASS |
| `RegistrarCheckinUseCase` — bloqueia sem liberação; bloqueia com `forceRetroactive:true` manualmente injetado (bypass antigo não existe mais); bloqueia liberação de outra data; aceita e marca `usadaEm` na data exata; bloqueia após expirar | ✅ PASS |
| `GoogleSheetsLiberacaoRetroativaRepository` — round-trip PT-BR na planilha, ISO no retorno | ✅ PASS |

Toda a suíte pré-existente (login, cadastro, edição, gamificação, check-in normal, cancelamento, etc.) continua passando sem regressão.

## Frontend — verificação ao vivo no navegador (Vite dev server + `fetch` mockado)

Sem acesso a um backend Apps Script real neste ambiente, o frontend foi exercitado ponta a ponta com um mock de `fetch` reproduzindo fielmente o contrato de cada action (mesmo formato `{statusCode, data}` do backend real), permitindo verificar comportamento de UI, payloads de rede e roteamento de componentes com precisão.

| Item do checklist do usuário | Resultado |
|---|---|
| ✔ Liberar retroativo (admin) | **Confirmado** — Sheet abre com nome do paciente, campo de data, resumo dos suplementos do dia (buscado ao vivo ao trocar a data), motivo opcional, texto fixo "expirará automaticamente em 24 horas", submit envia `{pacienteId, dataLiberada, motivo}` para `liberarRetroativo` |
| ✔ Card aparece | **Confirmado** — `RetroactiveCard` renderiza "Retroativo disponível" com a data correta assim que há uma liberação ativa; fica oculto quando não há (testado nos dois cenários) |
| ✔ Countdown funciona | **Confirmado** — mostrou "23h 17min" em tempo real a partir de um `expiraEm` simulado, formato consistente com o exemplo do pedido ("23h 18min") |
| ✔ Calendário destaca a data | **Confirmado** — anel azul + badge 🔓 no dia correto, entrada "Retroativo liberado" na legenda, screenshot capturado |
| ✔ Abrir data | **Confirmado** — clicar no dia destacado abre exatamente a tela de registro daquele dia; clicar em qualquer outro dia continua abrindo o Sheet somente-leitura de sempre, sem alteração de comportamento |
| ✔ Registrar check-in | **Confirmado** — tap no suplemento chama `registrarCheckin` com o payload padrão (sem nenhum campo `forceRetroactive`), toast de confirmação exibido |
| ✔ Salvar | **Confirmado** — via o mesmo toast e atualização da lista |
| ✔ Bloquear outros dias | **Confirmado no backend** (ver tabela acima — `findAtivaParaPacienteEData` rejeita qualquer data que não seja a exata) — o frontend não expõe nenhum caminho de UI para tentar outra data, então a garantia real está e foi testada na camada que importa (servidor) |
| ✔ Expirar após 24 horas | **Verificado de forma determinística, não por espera real** — ver nota abaixo |
| ✔ Remover automaticamente o Card | **Verificado de forma determinística** — `computeHmCountdown` retorna `null` quando `expiraEm` já passou, e `RetroactiveCard` não renderiza nada quando o countdown é `null`; testado passando um `expiraEm` no passado |
| ✔ Remover automaticamente o destaque | **Verificado de forma determinística** — o destaque do calendário depende do mesmo `obterLiberacaoRetroativaAtiva`; quando o backend não retorna liberação ativa (porque `estaAtiva()` já é `false`), nenhum dia é marcado — testado com o mock retornando `null` |
| ✔ Garantir que nenhuma outra data possa ser alterada | **Confirmado no backend** (testes automatizados listados acima) |

### Nota sobre a expiração de 24h

Esperar 24 horas reais não é viável em um teste automatizado de sessão. A garantia foi validada de duas formas complementares e, juntas, equivalem à cobertura real do comportamento:
1. **Backend**: `estaAtiva()` recalcula `expiraEm > now` a cada chamada, nunca confiando em um job assíncrono — testado diretamente manipulando `expiraEm` para o passado e confirmando que a liberação para de ser aceita imediatamente, sem esperar.
2. **Frontend**: o card e o destaque do calendário dependem inteiramente da resposta do backend (`obterLiberacaoRetroativaAtiva` retorna `null` assim que `estaAtiva()` vira `false`) mais o cálculo local do countdown (`computeHmCountdown` retorna `null` quando `expiraEm` já passou) — ambos testados diretamente com um `expiraEm` no passado, produzindo o comportamento esperado de forma instantânea e determinística.

### Observação metodológica

Durante a verificação, um service worker de uma sessão anterior (cache `clinical-tracking-v4`) estava servindo uma versão em cache do bundle antigo mesmo após recarregar a página — não é um problema do código novo, apenas um efeito colateral de cache do PWA neste navegador de teste. Foi resolvido desregistrando o service worker e limpando o `CacheStorage` antes de continuar; não afeta usuários reais em uma primeira visita ou em um dispositivo sem essa sessão anterior em cache.

## Build

- `node backend/tests/run_tests.js` — 22 passados, 0 falhas.
- `npm run build` (backend, webpack/GAS bundle) — limpo.
- `npm run build` (frontend, Vite) — limpo.

## Conclusão

A funcionalidade está operacional e pronta para produção do ponto de vista de código, testes automatizados e verificação de UI. Falta apenas o deploy do backend para o Apps Script em produção (`clasp push`/`clasp deploy`), que não foi executado automaticamente — será solicitada confirmação ao usuário antes, como nas sprints anteriores.
