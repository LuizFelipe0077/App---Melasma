# TEST_REPORT.md

## Testes automatizados

**Backend** — `npm test` (raiz, roda `backend/tests/run_tests.js`): **10/10 passando.**

| Teste | Resultado |
|---|---|
| Value Object Email | ✅ |
| Value Object Telefone | ✅ |
| BcryptGasService — hash/comparação | ✅ |
| TokenService — JWT | ✅ |
| CriarPacienteUseCase + eventos de domínio | ✅ |
| LoginUseCase (paciente + admin) | ✅ |
| EditarPacienteUseCase (edição + troca de senha) | ✅ |
| ExcluirPacienteUseCase | ✅ |
| CancelarCheckinUseCase (reverte + guarda de propriedade) | ✅ |
| Adicionar/Editar/RemoverSuplementoUseCase | ✅ |

**Frontend** — `npm run build` (Vite): build limpo, sem erros, 417 módulos transformados.

## Verificação manual (navegador, dados simulados localmente — sem tocar produção)

Ver metodologia de segurança em `ARCHITECTURE_NOTES.md`/histórico de sessão: todas as chamadas de rede foram interceptadas localmente (`window.fetch` sobrescrito para retornar dados de exemplo) para os testes abaixo, evitando qualquer escrita real em produção.

| Item | Resultado | Observação |
|---|---|---|
| Login — renderização (mobile/desktop) | ✅ | Sem erros de console |
| Config de conexão (bottom sheet) | ✅ | Abre e fecha corretamente |
| Dashboard do paciente — anel de progresso, linha do tempo | ✅ | Dados simulados renderizados corretamente |
| Check-in individual | ✅ | Toast com "Desfazer" funcional |
| "Concluir todos os suplementos de hoje" | ✅ | Sheet de confirmação → registra sequencialmente → toast de sucesso |
| Histórico — agrupamento por dia, filtro 7/30/90 dias | ✅ | |
| Calendário — grade mensal, indicador do dia atual | ✅ | Classe `completed` confirmada via DOM no dia com check-in |
| Troca de tema Melasma ⇄ Desinflamação | ✅ | Variáveis CSS confirmadas via `getComputedStyle` |
| Navegação responsiva (rail ⇄ pill-nav) | ✅ | Confirmado via `display` computado em 1440px e 390px |
| Admin — shell, stat chips, estado de erro gracioso | ✅ | |
| Wizard de novo paciente — etapas 1–3, adicionar suplemento, descartar com confirmação | ✅ | |
| Bottom sheet — abrir/fechar (Sheet, Confirm, Toast) | ✅ | Verificado repetidamente; uma janela breve de instabilidade do ambiente de preview (não do código) foi identificada e descartada — ver nota abaixo |
| Admin — gerenciar suplementos de um paciente existente (`ManageSupplements`) | ⚠️ Não exercido via clique | Não foi possível popular a lista de pacientes com o mock sem um reload que descartava o mock; a lógica reaproveita `SupplementFields`/`ApiClient`, já validados no wizard. Recomenda-se um teste manual real antes do deploy do backend correspondente |

**Nota sobre a instabilidade transitória**: durante os testes, houve um intervalo em que cliques em botões "Cancelar"/"Confirmar" pareciam não fechar os bottom sheets, e a captura de screenshot do navegador de preview também parou de responder. Investigação (`requestAnimationFrame` continuava rodando, eventos chegavam ao DOM corretamente) indicou uma instabilidade do próprio ambiente de preview, não do código — os mesmos cliques, repetidos minutos depois, funcionaram corretamente e de forma consistente, e a captura de tela voltou a funcionar sozinha. Não foi necessária nenhuma alteração de código.

## O que não foi testado nesta sessão

- Fluxo real de ponta a ponta contra o backend de produção (login real → dashboard real → check-in real) não foi repetido para as novas telas, para não repetir o incidente de autofill descrito em sessões anteriores. O contrato de API não mudou, e o mesmo `apiClient.js` já foi validado contra produção anteriormente nesta branch.
- `adicionarSuplemento`/`editarSuplemento`/`removerSuplemento` não foram exercidos via clique na UI (ver tabela acima) — apenas via teste automatizado de backend.
