# E2E_PATIENT_REPORT.md — Parte 12

Reteste em navegador com `window.fetch` mockado localmente (sem chamada real de produção), reproduzindo o contrato exato de cada action usada. Sessão limpa (Service Worker/cache/sessionStorage) no início.

## Cobertura desta rodada

| Fluxo | Resultado |
|---|---|
| Login (paciente ativo) | ✅ autentica, dashboard carrega |
| Login (paciente com `dataInicio` no futuro) | ✅ é redirecionado para `ProtocolPendingScreen`, não para o dashboard |
| Bloqueio de protocolo — conteúdo escondido | ✅ nenhuma chamada a `gerarDashboard`/`listarObservacoes`/etc. é feita enquanto bloqueado (as sub-rotas nunca montam) |
| Bloqueio de protocolo — navegação direta por URL | ✅ acessar `#/paciente/calendario` diretamente enquanto bloqueado ainda mostra a tela de espera, não a rota |
| Contagem regressiva | ✅ exibe "Faltam 3 dias" / "Faltam 5 dias" corretamente conforme a data mockada |
| Check-in otimista — sucesso | ✅ UI (card, %, contador "hoje faltam") muda em ~50ms, antes de uma resposta de rede artificialmente atrasada em 2s resolver |
| Check-in otimista — reconciliação | ✅ ao resolver, `checkinId`/`status`/`streak`/`xpTotal` reais substituem os valores otimistas sem re-mostrar loading |
| Check-in otimista — rollback em falha | ✅ UI volta para o estado anterior (0%, pendente, contador restaurado) e mostra a mensagem de erro específica do backend, não uma genérica |
| Toast de marco motivacional | ✅ dispara a mensagem certa (testado: "dia perfeito" no primeiro check-in de um paciente com 1 único suplemento) com variante aleatória entre repetições |
| Som removido | ✅ nenhuma chamada a `AudioContext`/`playChime` permanece no código (busca confirmada, zero ocorrências) |
| Navbar desktop fixa | ✅ `position: sticky` confirmado computado em 1440px; `top: 0` mantido após rolar 1000px de conteúdo |
| Calendário — legenda "Hoje" | ✅ renderiza como 5ª categoria, com o mesmo estilo de anel usado na célula real |
| Calendário — badge "Dia do tratamento" | ✅ "Dia do tratamento 11 de 91 / Faltam 80 dias" renderiza corretamente |
| Responsividade (320/1024/1440px) | ✅ nenhum overflow horizontal em nenhum elemento novo desta sprint |

## Não retestado nesta rodada (sem mudança de código, coberto em sprints anteriores)

Logout, CRUD de pacientes/suplementos no admin, Observações Clínicas, exportação CSV/PDF do histórico, troca de tema Melasma/Desinflamação — nenhum desses fluxos foi tocado por esta sprint (todas as mudanças ficaram isoladas ao painel do paciente: dashboard, check-in, calendário, navegação). Ver `E2E_FINAL_REPORT.md`/`E2E_HISTORY_REPORT.md` das sprints anteriores para a cobertura original desses fluxos.

## Regressão

`npm run build` (frontend) — sem erros, sem warnings novos além dos já existentes (tamanho de bundle, esperado). Nenhuma mudança de backend nesta sprint, então a suíte de testes de backend (`node backend/tests/run_tests.js`, 15/15) não foi impactada e não foi re-executada por não haver nada nela para regressar.
