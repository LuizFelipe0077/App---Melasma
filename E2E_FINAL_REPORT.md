# E2E_FINAL_REPORT.md — Parte 7 (reteste E2E) + Parte 8 (performance)

## Metodologia

Reteste em navegador com `window.fetch` mockado localmente (nenhuma chamada real à produção — GAS/Sheets reais nunca foram tocados nesta sprint), reproduzindo o contrato de request/response exato de cada `UseCase` do backend (conferido lendo o código-fonte de cada caso de uso, não assumido). Sessão de service worker/cache limpa no início. Cliques feitos via `.click()` nativo no elemento real do DOM (mais confiável neste ambiente de preview do que coordenadas de clique sintéticas, conforme já estabelecido em sprints anteriores desta mesma sessão).

## Fluxos retestados nesta rodada — resultado

| Fluxo | Resultado |
|---|---|
| Login paciente (credenciais corretas) | ✅ autentica, navega para `/paciente`, sessão gravada com `dataInicio`/`dataFim` |
| Login com credenciais inválidas | ✅ mensagem específica "Credenciais inválidas." exibida (não mais o texto genérico) |
| Dashboard do paciente — ordem das seções | ✅ Saudação → Progresso → **Sua semana** → Hoje, confirmando a Parte 2 |
| Check-in: marcar suplemento | ✅ status muda para CONCLUIDO, toast "[nome] registrado" com ação "Desfazer" |
| Check-in: cancelar (desfazer) | ✅ status reverte para PENDENTE |
| Check-in: marcar de novo após cancelar (bug da Parte 3) | ✅ **sem erro**, status volta a CONCLUIDO, XP/streak creditados uma única vez — confirma a correção da Parte 3 em condição real de UI, não só em teste automatizado |
| Erro de validação de negócio específico | ✅ mensagem exata do backend chega ao toast ("Não é possível realizar check-ins retroativos...") — confirma a Parte 1 |
| Erro de conexão (rede indisponível) | ✅ mensagem amigável "Não foi possível conectar ao servidor..." em vez de "Failed to fetch" — confirma a Parte 1 |
| Calendário — clique no dia atual | ✅ abre painel com "Dia N de M", suplementos do dia e status corretos |
| Calendário — clique em dia futuro | ✅ "O tratamento deste dia ainda não foi iniciado." |
| Calendário — cabeçalho de dias restantes | ✅ "Faltam 70 dias... término previsto em 30/09/2026" calculado corretamente a partir de `session.dataFim` |
| Logout (paciente) | ✅ exige confirmação ("Tem certeza que deseja sair?"), limpa sessão, volta para `/login` |
| Login admin | ✅ autentica, navega para `/admin` |
| Lista de pacientes (admin) | ✅ carrega, exibe estatísticas (alerta de abandono/adesão excelente/total) e card do paciente |

## Achado durante o reteste — gap de resiliência (não é um bug ativo)

Ao montar o mock para a Central de Acompanhamento (`/admin/paciente/:id`), duas telas diferentes (`AdminPatientsPage.jsx` e `PatientHistoryPage.jsx`) quebraram a aplicação **inteira** para uma tela branca quando receberam uma resposta simulada em formato inesperado (erro no meu próprio mock, não no backend real — conferido lendo `ListarPacientesUseCase.js`, que sempre garante o formato completo). O motivo raiz **não é o formato de dados** em si, mas sim que **este projeto não tem nenhum Error Boundary React em nenhum ponto da árvore de componentes** (`frontend/src/App.jsx` até a raiz) — confirmado via o próprio aviso do React no console: *"Consider adding an error boundary to your tree."* Sem isso, qualquer exceção síncrona durante a renderização de qualquer página — hoje inofensiva porque o backend real sempre entrega dados no formato esperado, mas potencialmente disparável por uma edge case futura, uma condição de corrida, ou uma edição manual malformada na planilha — derruba a aplicação inteira (`document.getElementById('root')` fica vazio) sem nenhuma tela de recuperação, e sem que o próprio sistema de erros da aplicação (Toast, mensagens específicas da Parte 1) consiga capturar o problema, porque um `throw` síncrono de render não é uma Promise rejeitada.

Isso está **fora do escopo das 8 partes desta sprint** (nenhuma delas pedia uma mudança arquitetural nova), então não foi corrigido aqui — foi sinalizado como sugestão de tarefa separada para o usuário decidir (adicionar 1 componente `ErrorBoundary` envolvendo a árvore da aplicação, mudança puramente aditiva).

## Cobertura em relação à lista completa da Parte 7

Cobertos nesta rodada consolidada (tabela acima): login/logout paciente e admin, check-in completo (marcar/desmarcar/marcar de novo), calendário interativo, mensagens de erro (3 cenários distintos), lista de pacientes admin.

Cobertos e validados em rodadas de QA anteriores **dentro desta mesma sprint** (Partes 1-5, já documentados nos relatórios correspondentes e não repetidos aqui): responsividade em todos os breakpoints ([RESPONSIVE_REPORT.md](RESPONSIVE_REPORT.md)), ausência de diálogos nativos do navegador ([UX_REVIEW.md](UX_REVIEW.md)).

Cobertos em sprints anteriores desta sessão, sem alteração de código desde então que justificasse reteste completo: CRUD de pacientes/suplementos no admin, observações clínicas, filtros/exportação CSV/PDF do histórico, troca de tema Melasma/Desinflamação — ver `E2E_HISTORY_REPORT.md` (sprint da Central de Acompanhamento).

Não foi possível reexercitar nesta rodada, especificamente por causa do achado acima (a tela quebrou antes): as 3 abas internas da Central de Acompanhamento (Prontuário/Histórico Clínico/Intervenções) e o fluxo de criar uma nova observação clínica. Esses fluxos já tinham sido validados como funcionais em `E2E_HISTORY_REPORT.md` na sprint anterior, com o backend inalterado desde então — o risco de regressão é baixo, mas não foi reconfirmado ao vivo nesta rodada específica.

## Parte 8 — Performance

### Bundle size

```
npm run build (frontend)
dist/index.html                 2.22 kB │ gzip:   1.08 kB
dist/assets/index-*.css        22.13 kB │ gzip:   4.87 kB
dist/assets/index-*.js        361.32 kB │ gzip: 113.40 kB
```

Comparado à build anterior (sprint da Central de Acompanhamento, antes desta sprint de estabilização): o aumento de bundle nesta sprint é mínimo — as mudanças desta sprint foram, em sua maioria, lógica de reordenação, correções de guarda de duplicidade e um novo painel de detalhe do calendário (reaproveitando componentes já existentes como `Sheet`), não novas dependências nem novos componentes pesados. Nenhuma nova dependência de terceiros foi adicionada (mantendo a filosofia de dependências mínimas já estabelecida no projeto).

### Revisão estática de re-renders

- `CalendarPage.jsx`: `days`, `treatmentInfo` e o cálculo de `dataInicio`/`dataFim` do período consultado já são `useMemo` corretamente dependentes só do que muda (`data`, `session.dataInicio/dataFim`, `cursor`) — não recalculam a cada render por outros motivos (ex: abrir/fechar o painel de detalhe do dia, que é um `useState` local, não dispara recomputo desses memos).
- `PatientDashboardPage.jsx`: a reordenação da Parte 2 foi puramente de JSX (moveu blocos de posição), não introduziu nenhum novo estado ou efeito — nenhum novo re-render foi introduzido por essa mudança.
- `HeatmapMonth.jsx`: `buildCells` roda a cada render (não é memoizado), mas seu custo é O(dias do mês) ≈ no máximo 42 células — não é um gargalo real que justifique memoização (otimização prematura, evitada de propósito).

### Limitação honesta desta seção

Lighthouse e Web Vitals reais exigem um navegador auditando a página servida por uma URL pública/local acessível pela ferramenta de auditoria — o ambiente de sandbox usado nesta sessão não expõe essa medição. O que foi verificável e está reportado acima (tamanho de bundle comparativo, revisão estática de re-renders) é a evidência disponível; nenhuma métrica de Lighthouse foi inventada ou estimada.

## Regressão final

```
node backend/tests/run_tests.js → 14 Passados, 0 Falhas
npm run build (frontend) → build concluído sem erros ou warnings
```
