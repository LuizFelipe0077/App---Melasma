# E2E_REPORT.md — Sprint UX Premium V2

## Checklist do usuário

| Item | Resultado |
|---|---|
| ✔ Novo paciente | Fluxo completo (5 etapas) testado — nome/dados, protocolo+datas, suplemento com `SupplementDatePicker`, notificações, confirmação — `criarPaciente` disparado com payload correto |
| ✔ Editar paciente | `ManageSupplements.jsx` recebe `dataInicio`/`dataFim`/`protocoloNome` do paciente e usa o mesmo `SupplementDatePicker` para editar suplementos existentes |
| ✔ Swipe Down | Confirmado: início do gesto a partir de qualquer ponto não-interativo do Sheet (não só a barrinha) — `transform` acompanhou o toque sintético. Toque sobre um botão não inicia o gesto (`transform` permaneceu `none`) |
| ✔ Retroativo | Card, countdown, resumo de suplementos, calendário, tela de registro — todos verificados ao vivo |
| ✔ Vários retroativos | Duas liberações simultâneas exibidas corretamente em accordion, cada uma com countdown e Sheet independentes; ambos os dias destacados no calendário |
| ✔ Calendário | `SupplementDatePicker` renderiza corretamente nos 4 modos, tingido pela cor do protocolo, respeitando o período do tratamento |
| ✔ Check-in otimista | Confirmado: UI atualiza em ~20ms, antes de qualquer resposta de rede plausível — sem spinner, sem reload |
| ✔ Rollback | Confirmado: falha simulada reverte o estado visual e mostra a mensagem de erro exata do backend (não genérica) |
| ✔ Confirmação | Modal "Confirmar autorização" com o texto exato pedido, exigido antes de qualquer `liberarRetroativo` |
| ✔ Cache | Confirmado via contagem de chamadas de rede: abrir a tela de retroativo após o prefetch fez **zero** chamadas novas |
| ✔ Responsividade | 320/360/390/430/768/1024/1440px verificados — calendário de agendamento e accordion de retroativos não overflowam; um problema pré-existente e não relacionado (rodapé do wizard em 320px) foi identificado e documentado, não corrigido (fora do escopo desta sprint) |
| ✔ Mobile | Viewport 375×812 e 320×700 testados |
| ✔ Desktop | Viewport 1440×900 testado — Sheet mantém `max-width: 560px` centralizado corretamente |
| ✔ Build | `npm run build` limpo em frontend e backend |
| ✔ Backend | `node backend/tests/run_tests.js` — 26/26 passando |
| ✔ Frontend | Verificação completa ao vivo via browser preview com `fetch` mockado |

## Metodologia
Todos os testes de UI usaram o Vite dev server com um mock de `window.fetch` reproduzindo fielmente o contrato `{statusCode, data}` de cada ação, permitindo verificar payloads de rede, contagem de chamadas, timing (otimismo vs. rede) e roteamento de componentes com precisão — mesmo método já validado nas sprints anteriores deste projeto.

## Limitações honestamente declaradas
- **Conclusão do gesto de swipe** (cruzar o limiar de fechamento até `onClose` disparar): o início do gesto foi comprovado funcionando a partir de qualquer ponto do Sheet; a conclusão via toque sintético não pôde ser confirmada de ponta a ponta neste navegador headless de sandbox, pela mesma limitação de foco/visibilidade de aba já documentada e comprovada (via isolamento com `git stash`) numa sprint anterior para este mesmo componente. A lógica de fechamento (`handleDragEnd`) não foi alterada nesta sprint — é idêntica à já usada pela barrinha, que já funciona em produção.
- **Expiração real de 24h**: não é viável esperar 24h num teste automatizado. Verificado de forma determinística — o backend recalcula `expiraEm > now` a cada chamada (não confia em status desatualizado), e o frontend deriva o countdown e a visibilidade do card diretamente do `expiraEm` já buscado; ambos testados com `expiraEm` manipulado para o passado, produzindo o comportamento esperado (bloqueio, sumiço do card) instantaneamente.
