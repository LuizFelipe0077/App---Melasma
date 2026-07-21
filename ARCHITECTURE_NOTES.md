# ARCHITECTURE_NOTES.md

Mudanças estruturais feitas nesta branch (`redesign/frontend-v2`) e por quê. Ver `PROJECT_ANALYSIS.md` para a arquitetura original completa.

## 1. Front-end: de vanilla JS para Vite + React

**Antes**: `frontend/src` era JS puro (ES modules nativos), zero build, zero dependências, publicado direto pelo GitHub Pages a partir do repositório.

**Depois**: `frontend/` é um app Vite + React + React Router (`HashRouter`) + Framer Motion, com `frontend/package.json` e `frontend/vite.config.js` próprios.

**Por quê `HashRouter` e não `BrowserRouter`**: GitHub Pages não faz rewrite de rotas profundas (`/paciente/historico` daria 404 num refresh). `HashRouter` evita esse problema sem precisar de um `404.html` de fallback.

**Por quê isso exige um pipeline novo**: antes não existia nenhum build. Agora existe `.github/workflows/deploy-frontend.yml`, que builda o Vite (`frontend/dist`) e publica na branch `gh-pages` a cada push em `frontend/**` na `main`.

**Passo manual pendente (não fiz sozinho)**: nas configurações do repositório no GitHub, a origem do GitHub Pages precisa ser trocada para servir da branch `gh-pages` (hoje serve a `main` crua). Até essa troca ser feita, o site publicado atualmente (`main` → `/frontend/index.html`) vai ficar **quebrado**, porque os arquivos vanilla antigos (`app.js`, `LoginPage.js` etc.) foram removidos nesta branch — isso só importa no momento em que esta branch for mesclada à `main`, o que ainda não aconteceu.

## 2. Contrato de API — preservado por completo

`frontend/src/api/apiClient.js` é a reescrita de `ApiClient.js` mantendo, literalmente:
- `Content-Type: text/plain` (evita preflight CORS no Apps Script).
- Envelope `{ statusCode, data }` lido do corpo, nunca do HTTP status.
- Token no payload (`{ action, token, ...campos }`), nunca em header/cookie.
- Retry com backoff exponencial (3 tentativas) e de-duplicação de chamadas idênticas em voo.
- Evento `app:authExpired` no `statusCode === 401`.

Nenhuma das 8 actions originais (`login`, `criarPaciente`, `editarPaciente`, `excluirPaciente`, `registrarCheckin`, `liberarEdicaoRetroativa`, `gerarDashboard`, `listarPacientes`) teve payload ou resposta alterados.

## 3. Backend — uma única mudança aditiva

Ver commit "feat(backend): add additive cancelarCheckin action". Resumo:

- **Novo** `backend/src/application/useCases/CancelarCheckinUseCase.js` + action `cancelarCheckin` no `GasRouter`. Payload `{ token, checkinId }` → resposta `{ success, xpTotal, streakAtual }`.
- **Novo** método `Gamificacao.debitarCheckin()`/`decrementarStreak()` (espelha os métodos de crédito existentes).
- **Correção bundled**: `CheckinMapper` não lia/escrevia a coluna `retroativo` (bug pré-existente, não introduzido por mim) — sem essa correção, `CheckIn.revert()` não persistiria esse campo corretamente. `GoogleSheetsColumns.CHECKIN.RETROATIVO` (índice 6) foi adicionado — a coluna já existia no schema do `DatabaseSetup.js`, só não tinha índice mapeado.
- Nenhuma action, payload ou resposta pré-existente foi alterada.
- **Não fiz `clasp push`**. O código está pronto e testado localmente (`npm test`, 9/9), mas o deploy real para o Apps Script em produção requer confirmação explícita do usuário, por afetar pacientes reais.

## 4. Descoberta durante a implementação: possível bug crítico pré-existente no check-in

Ao escrever o teste do `CancelarCheckinUseCase`, encontrei uma colisão entre dois fluxos que já existiam antes desta branch:

- `CriarPacienteUseCase` pré-gera um `CheckIn` `PENDENTE` para **cada** horário futuro de **cada** suplemento, na criação do paciente.
- `RegistrarCheckinUseCase` rejeita o check-in real se **qualquer** registro já existir naquele slot (±60s), independente do status — inclusive esse `PENDENTE` pré-gerado.

Na prática, isso pode significar que o check-in real (o botão "Confirmar" do paciente) **nunca consegue ser registrado** para nenhum suplemento cadastrado pelo fluxo normal do wizard admin, porque sempre já existe uma linha `PENDENTE` esperando naquele horário. Não confirmei isso contra a planilha de produção real (fora do escopo desta sessão), mas o teste que escrevi reproduz o erro de forma determinística. Isso é **anterior a esta branch** — não foi introduzido pelo redesign — e foi sinalizado como uma tarefa separada de investigação/correção de backend, propositalmente fora do escopo deste redesign de front-end.

## 5. O que НЕ mudou

- Google Sheets: nenhuma aba, coluna (exceto o índice adicionado para uma coluna que já existia) ou schema alterado.
- Google Apps Script: `doGet`, `appsscript.json`, `.clasp.json`, processo de deploy (`build.js` + `clasp push`) — todos intactos.
- Autenticação, JWT, bcrypt customizado, rate limiting — intactos (os problemas de segurança encontrados na auditoria foram apenas sinalizados, não corrigidos, por estarem fora do escopo aprovado).
