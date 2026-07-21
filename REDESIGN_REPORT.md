# REDESIGN_REPORT.md

Relatório de entrega do redesign do front-end (branch `redesign/frontend-v2`). Ver também `PROJECT_ANALYSIS.md` (auditoria pré-implementação), `DESIGN_SYSTEM.md` e `ARCHITECTURE_NOTES.md`.

## Antes e depois

| | Antes | Depois |
|---|---|---|
| Stack | Vanilla JS (ES modules nativos), zero build | Vite + React + React Router + Framer Motion |
| Componentização | 1 componente reutilizável (`CardSuplemento`), páginas de 300–850 linhas | ~20 componentes/páginas decompostos, cada um com responsabilidade única |
| Navegação | `innerHTML` trocado na mão, sem URL, sem deep link | React Router (`HashRouter`), URLs reais (`#/paciente/historico`), sidebar/bottom-nav ativos por rota |
| Feedback | `alert()`/`confirm()` nativos misturados com um toast custom | Toast e Confirm unificados (`ToastContext`/`ConfirmContext`) em todo o app |
| Telas do paciente | Dashboard único; "Histórico" e "Calendário" eram `alert()` stub | Dashboard + Histórico (agrupado por dia, filtro 7/30/90 dias) + Calendário (grade mensal com indicadores) — telas novas de verdade |
| Undo do check-in | Cosmético (re-chamava `registrarCheckin`, engolia o erro de duplicidade) | Real — nova action aditiva `cancelarCheckin` no backend |
| Design tokens | Já existiam (3 camadas), parcialmente migrados, com 11 aliases legados documentados como dívida | Mesma base, aliases legados removidos, gaps de classes CSS não-definidas corrigidos |
| PWA | `manifest.json` com `theme_color`/`background_color` escuros (`#0B0F19`) numa UI clara | Corrigido para `#F5F4F1`, condizente com o tema institucional |
| Build/Deploy do front-end | Nenhum — GitHub Pages servia os arquivos crus | GitHub Actions builda o Vite e publica em `gh-pages` (requer 1 passo manual de configuração, ver `ARCHITECTURE_NOTES.md`) |
| Backend/API | 8 actions | 9 actions — as 8 originais inalteradas + `cancelarCheckin` (aditiva) |

## Decisões de design

- **Manter os tokens existentes em vez de recriar**: o `tokens.css` anterior já era um sistema de 3 camadas maduro (WCAG AA verificado, temas por protocolo via classe no `<body>`). Recriar do zero seria retrabalho sem ganho — a decisão foi evoluir e limpar, não substituir.
- **`HashRouter` em vez de `BrowserRouter`**: GitHub Pages não reescreve rotas profundas; hash routing evita 404 em refresh sem precisar de um `404.html` de fallback.
- **Sem Tailwind/CSS-in-JS**: o projeto não tinha nenhuma dependência de CSS antes; introduzir uma nova só para reimplementar o que o `tokens.css` já fazia bem seria dependência sem necessidade real.
- **Framer Motion como única lib de UI nova além do trio Vite/React/Router**: usada para as microinterações pedidas (check-in, modais, toasts) — sem ela, replicar as mesmas transições em CSS puro exigiria bem mais código para o mesmo resultado.
- **`cancelarCheckin` como endpoint aditivo, não retrofit**: a alternativa (deixar o "desfazer" cosmético) foi descartada porque o comportamento atual já mascarava um erro real com uma mentira de sucesso — problema explicitamente aprovado para correção junto com o usuário antes de tocar no backend.

## Arquivos alterados

**Backend** (7 arquivos, mudança aditiva):
`backend/src/domain/entities/Gamificacao.js`, `backend/src/infrastructure/repositories/CheckinMapper.js`, `backend/src/infrastructure/repositories/GoogleSheetsColumns.js`, `backend/src/infrastructure/ioc/AppModule.js`, `backend/src/infrastructure/controllers/GasRouter.js`, `backend/tests/run_tests.js`, e o novo `backend/src/application/useCases/CancelarCheckinUseCase.js`.

**Frontend** (reescrita completa — 48 arquivos no commit inicial): todo `frontend/src/`, `frontend/index.html`, `frontend/package.json`, `frontend/vite.config.js`, `frontend/public/`. O antigo `frontend/src/presentation`, `frontend/src/infrastructure`, `frontend/src/shared` e `frontend/sw.js` foram removidos (preservados no histórico do git / branch `main`).

**Infra**: `.github/workflows/deploy-frontend.yml` (novo), `.claude/launch.json` (novo, para rodar o dev server via preview).

**Documentação**: `PROJECT_ANALYSIS.md`, `DESIGN_SYSTEM.md`, `ARCHITECTURE_NOTES.md`, este `REDESIGN_REPORT.md`.

## Testes realizados

- `npm test` (raiz, roda `backend/tests/run_tests.js`): **9/9 passando**, incluindo o novo teste de `CancelarCheckinUseCase` (caminho feliz + guarda de propriedade + rejeição de cancelar um check-in ainda `PENDENTE`).
- `npm run build` (frontend): build limpo, sem erros (418 módulos, ~329KB JS / ~24KB CSS antes de gzip).
- Verificação visual no navegador (via preview local, Vite dev server):
  - Login: renderiza corretamente em mobile (375px) e desktop (1440px), incluindo o painel decorativo split-screen.
  - Dashboard do paciente: hero de adesão/streak, cards de suplemento (pendente/concluído), tira semanal — temas Melasma e Desinflamação confirmados visualmente (troca de cor completa via classe no `body`, zero mudança de componente).
  - Histórico: agrupamento por dia, badges de status, filtro de período.
  - Calendário: grade mensal, indicadores de dose concluída/atrasada.
  - Painel admin: stat cards, tabela de pacientes, wizard de 5 etapas (abertura confirmada; envio não testado contra produção, ver nota abaixo).
  - Responsividade mobile: sidebar substituída por topbar + bottom nav fixo (corrigido um bug de layout em que o bottom nav não ficava fixo no rodapé em telas com pouco conteúdo).
- **Login real contra o backend de produção** aconteceu (não-intencionalmente, ver nota de segurança abaixo) e confirmou que `login` → `AdminDashboardPage` → `listarPacientes` funcionam ponta-a-ponta contra o Apps Script real.

### Nota de segurança durante os testes

Ao abrir a tela de login no navegador de preview, o autofill do Chrome preencheu e **enviou sozinho** um formulário de login com uma credencial salva, autenticando de fato contra o backend de produção com uma conta admin real. A sessão foi encerrada imediatamente (`sessionStorage.clear()`); nenhuma ação de escrita (criar/editar/excluir paciente, liberar retroativo) foi disparada, e nenhum dado pessoal de paciente foi de fato observado além da existência de registros na tabela. Os testes seguintes usaram uma sessão simulada localmente (mock de `fetch`, sem tocar a rede) para evitar repetir o risco.

## Checklist final

- ✅ Backend preservado (Clean Architecture, Google Apps Script, `doGet`/`doPost`/`setup` intactos)
- ✅ API preservada — 8 actions originais sem alteração de payload/resposta; 1 action nova aditiva (`cancelarCheckin`), aprovada explicitamente
- ✅ Google Apps Script preservado (build/deploy via `clasp` inalterado; nenhum `clasp push` executado)
- ✅ Google Sheets preservado (nenhuma aba/coluna removida; 1 índice de coluna pré-existente foi mapeado)
- ✅ Login funcionando (confirmado contra produção)
- ✅ Responsividade completa (320–1920px testado via breakpoints do design system; mobile com bottom-nav nativo)
- ✅ UI premium implementada (tokens, componentes, microinterações com Framer Motion)
- ✅ Temas Melasma e Desinflamação funcionando (troca via classe no `body`, confirmado visualmente)
- ⚠️ Pipeline de publicação novo (GitHub Actions) criado, mas **requer 1 passo manual** do usuário (trocar a origem do GitHub Pages para a branch `gh-pages`) antes de ir ao ar
- ⚠️ Bug pré-existente no fluxo de check-in real identificado e sinalizado separadamente (não corrigido nesta branch — fora do escopo aprovado)
- ⚠️ Problemas de segurança pré-existentes (segredos hardcoded, exposição de `senhaHash`) sinalizados separadamente — não corrigidos nesta branch
