# PROJECT_ANALYSIS.md

Auditoria completa do projeto **antigravity-clinical-saas** (app de acompanhamento clínico integrativo, protocolos Melasma e Desinflamação), feita antes de qualquer alteração de código, como base para o redesign do front-end.

---

## 1. Arquitetura atual

### 1.1 Visão geral

```
┌─────────────────────┐        POST (action-based)        ┌──────────────────────────┐
│  Front-end (SPA)     │ ────────────────────────────────▶ │  Backend (Google Apps    │
│  vanilla JS, zero     │ ◀──────────────────────────────── │  Script, Clean Arch.)     │
│  build, GitHub Pages  │     { statusCode, data }           │  doPost → GasRouter       │
└─────────────────────┘                                     └───────────┬──────────────┘
                                                                          │
                                                                          ▼
                                                            ┌──────────────────────────┐
                                                            │  Google Sheets (DB)       │
                                                            │  Pacientes, Protocolos,   │
                                                            │  Suplementos, Check_Ins,  │
                                                            │  PermissoesRetroativas,   │
                                                            │  Gamificacao, Auditoria   │
                                                            └──────────────────────────┘
```

### 1.2 Backend (`backend/src`) — Clean Architecture

```
domain/
  entities/        Paciente, PacienteFactory, Protocolo, Suplemento, CheckIn, Gamificacao
  valueObjects/     Email, Telefone, PasswordHash, UUID
  events/           PacienteCriadoEvent, CheckinRealizadoEvent, DomainEventDispatcher
application/
  services/         LGPDComplianceService (código morto, ver §5)
  useCases/         LoginUseCase, CriarPacienteUseCase, EditarPacienteUseCase,
                     ExcluirPacienteUseCase, RegistrarCheckinUseCase,
                     LiberarEdicaoRetroativaUseCase, GerarDashboardUseCase,
                     ListarPacientesUseCase
  repositories/     interfaces abstratas (Paciente/Checkin/Gamificacao/Protocolo)
infrastructure/
  controllers/      GasController (envelope HTTP), GasRouter (dispatch de actions)
  ioc/               AppModule (service locator manual)
  middlewares/       RateLimiter (login)
  persistence/       DatabaseSetup (bootstrap idempotente das abas/headers)
  repositories/       GoogleSheets*Repository (uma por agregado) + Mappers
  services/           BcryptGasService (hash), TokenService (JWT HS256 caseiro)
shared/
  config/ SystemConfiguration | logging/ AuditLogger | utils/ InputSanitizer
app/
  main.js            doGet / doPost / setup (entry points do Apps Script)
```

Deploy: `npm run build` (webpack → `dist/bundle.js`, shims `doGet/doPost/setup` injetados por `build.js`) → `clasp push` (`backend/.clasp.json`, `rootDir: dist`) → depois é preciso subir manualmente uma nova versão do deployment na UI do Apps Script (`clasp push` sozinho não atualiza a URL pública).

### 1.3 Front-end (`frontend/src`) — hoje

```
presentation/
  app.js                     "router" manual (lê sessionStorage, monta a página certa)
  index.css / tokens.css     design tokens (3 camadas) + utilitários + componentes CSS
  components/CardSuplemento.js   único componente reutilizável
  pages/LoginPage.js
  pages/DashboardPacientePage.js
  pages/DashboardAdminPage.js
infrastructure/api/ApiClient.js   único ponto de acoplamento com o backend
shared/config/SystemConfiguration.js
```

**Zero build, zero dependências.** `frontend/index.html` carrega `app.js` como ES module nativo. Publicado via GitHub Pages direto do repositório (`/index.html` na raiz faz meta-refresh para `/frontend/index.html`; `.nojekyll` na raiz evita que o Jekyll interfira). Não existe `frontend/package.json`, bundler, CI/CD ou GitHub Actions.

---

## 2. Fluxo de dados (contrato de API — não pode quebrar)

Único endpoint real: `doPost`. Todas as chamadas são POST com `Content-Type: text/plain` (truque para evitar preflight CORS no Apps Script) e corpo `{ action, token, ...campos }`. O envelope de resposta é sempre `{ statusCode, data }` — importante: o Apps Script sempre responde HTTP 200, então o front-end lê `statusCode` **do corpo**, nunca do status HTTP.

| Action | Auth | Payload | Resposta |
|---|---|---|---|
| `login` | nenhum (rate-limited por e-mail) | `email, senha` | `{ token, role, userId, nome, protocoloNome? }` |
| `criarPaciente` | admin | `nome, email, telefone, senha, dataInicio, dataFim, protocoloNome, observacoes, suplementos[]` | `{ id, email, senha }` |
| `editarPaciente` | admin | `pacienteId, nome, email, telefone, status, dataInicio, dataFim, senha?` | `{ id, nome, email }` |
| `excluirPaciente` | admin | `pacienteId` | `{ success, message }` |
| `registrarCheckin` | qualquer token válido | `suplementoId, dataHoraPrescrita, dataHoraRealizada?, forceRetroactive?` | `{ checkinId, status, streak, xpGanho, xpTotal }` |
| `liberarEdicaoRetroativa` | admin | `pacienteId, horasLiberadas, motivo` | `{ permissaoId, expiraEm }` |
| `gerarDashboard` | qualquer token válido | `pacienteId?(admin), dataInicio, dataFim` (janela ≤ 90 dias) | ver `GerarDashboardUseCase` — `historicoAgrupadoPorSuplemento[]`, `rawCheckins[]`, `gamificacao` |
| `listarPacientes` | admin | — | array de pacientes (inclui `senhaHash`, ver §5) |

Regras de transporte que **devem ser preservadas literalmente** em qualquer novo cliente HTTP: `text/plain` no content-type, token dentro do payload (nunca header/cookie), leitura de `data.statusCode` (não `response.status`), tratamento de `401` como sessão expirada.

---

## 3. Persistência (Google Sheets)

Abas: `Pacientes, Protocolos, Suplementos, Check_Ins, PermissoesRetroativas, Gamificacao, Auditoria`, geridas por `GoogleSheetsRepository` (LockService + CacheService de 5 min). Datas de Paciente/Protocolo/Suplemento são armazenadas como string `DD/MM/YYYY`; datas de `CheckIn` como ISO completo.

---

## 4. Componentes/telas existentes

- **Login** — split-screen, modal de "config de URL" (troca o backend via `localStorage`).
- **Dashboard Paciente** — hero de adesão/streak, lista de doses do dia (`CardSuplemento`), tira de 7 dias. Botões "Meu Tratamento"/"Histórico" são stubs (`alert()`). Troca de tema (Melasma/Desinflamação) acontece aqui, via `document.body.className`.
- **Dashboard Admin** — tabela de pacientes, wizard de 5 passos para criar paciente, modais de editar/excluir/liberar retroativo.
- **Não existem** telas de Histórico ou Calendário de fato — são pedidos novos do redesign, não reskin.

### Design tokens já existentes (`tokens.css`)

Já há um sistema de 3 camadas (primitivas → tokens semânticos → temas `:root`/`.theme-melasma`/`.theme-desinflamacao`), com correções de contraste WCAG, escala de espaçamento em 8px, tokens de motion, e uma seção própria de aliases `DEPRECATED` documentando uma migração incremental já em andamento. **Isto significa que boa parte do "Design System" pedido no redesign já existe e deve ser evoluído, não recriado do zero.**

---

## 5. Pontos frágeis identificados

**Fora do escopo deste redesign (sinalizados, não corrigidos aqui):**
- Segredos hardcoded em `backend/src/app/main.js` (`healProperties`): e-mail/hash admin, `JWT_SECRET` literal, ID da planilha — comitados em texto puro no repositório.
- `TokenService` cai para um `JWT_SECRET` de desenvolvimento hardcoded se a Script Property estiver vazia (deveria falhar fechado).
- `listarPacientes` devolve `senhaHash` de cada paciente, e o admin UI atual chega a exibir isso num campo somente-leitura.
- `LGPDComplianceService.js` é código morto, nunca é chamado por nenhuma rota, e tem um bug (`ReferenceError` numa variável indefinida).
- Inconsistências de schema: `GoogleSheetsColumns` tem índices não utilizados/errados para `Protocolos`, `Suplementos` e `PermissoesRetroativas` (os repositórios hard-codam índices de coluna direto).
- Eventos de domínio (`PacienteCriadoEvent`, `CheckinRealizadoEvent`) são disparados mas nenhum handler está registrado — pub/sub inerte.

**Dentro do escopo (aprovado corrigir, ver ARCHITECTURE_NOTES.md):**
- `CheckIn.revert()` existe no domínio mas nenhuma rota o expõe — o "Desfazer" do front-end hoje é cosmético (re-chama `registrarCheckin`, recebe erro de duplicidade, finge sucesso).
- `CheckinMapper` nunca lê/escreve a coluna `retroativo` — bug que impede o `revert()` de persistir corretamente.

**Front-end (motivam o redesign):**
- Classes CSS referenciadas em `CardSuplemento.js` e nas páginas nunca foram definidas em nenhum CSS (`.supplement-card`, `.bento-grid`, `.day-circle`, etc.) — renderizam sem estilo.
- Estilos inline residuais de um tema escuro abandonado (`rgba(0,0,0,0.2)` em overlays, mesmo com a UI clara "Luxo Silencioso").
- `SystemConfiguration.THEME` duplica valores de `tokens.css` e está morto (nenhuma página lê esse objeto).
- Uso de `alert()`/`confirm()` nativo em vez do toast/modal que já existem no CSS.
- Nenhum roteador real (troca de tela = `innerHTML` inteiro trocado, sem URL, sem deep link).
- `manifest.json` declara `theme_color`/`background_color` escuros (`#0B0F19`) que não batem com a UI clara.
- Nenhuma cobertura de teste no front-end (só o backend tem `backend/tests/run_tests.js`).

---

## 6. Plano de reconstrução

Ver plano detalhado aprovado em `.claude/plans` desta sessão e formalizado em `ARCHITECTURE_NOTES.md`/`DESIGN_SYSTEM.md`/`REDESIGN_REPORT.md` ao final. Resumo:

1. Front-end migra de vanilla JS para **Vite + React + React Router (HashRouter) + Framer Motion**, em branch própria (`redesign/frontend-v2`), com pipeline novo de CI/CD via GitHub Actions.
2. `tokens.css` é preservado como fonte de verdade dos temas, apenas completado (tokens faltantes) e limpo (aliases mortos).
3. Backend recebe **uma única mudança aditiva**: endpoint `cancelarCheckin`, sem alterar nenhum contrato existente.
4. Nenhum outro arquivo de backend, planilha ou regra de negócio é alterado.
