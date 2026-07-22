# DEPLOY_AUDIT.md — verificação final do pipeline de deploy

## vite.config.js

```js
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist', sourcemap: true }
});
```
`base: './'` (relativo) — correto para o layout deste GitHub Pages (`https://luizfelipe0077.github.io/App---Melasma/`, servido de um subcaminho). Confirmado ao vivo: os assets carregam sem 404 nesse subcaminho.

## GitHub Actions / Workflow

Único workflow existente: [.github/workflows/deploy-frontend.yml](.github/workflows/deploy-frontend.yml).
- Dispara em `push` para `main` que toque `frontend/**`, ou manualmente (`workflow_dispatch`).
- `npm ci` + `npm run build` em `frontend/`, depois publica `frontend/dist` na branch `gh-pages` via `peaceiris/actions-gh-pages@v4`.
- Não existe nenhum outro workflow — não há dois pipelines concorrentes publicando coisas diferentes.

## GitHub Pages — branch de deploy

`gh-pages` (confirmado ao vivo — o HTML/JS/CSS servidos batem exatamente com o conteúdo dessa branch, não com a raiz de `main`).

## dist / Build / Hash dos assets

Build local reproduzido nesta sessão após as correções:
```
dist/index.html                 2.22 kB
dist/assets/index-D3rwHC9F.css 22.13 kB
dist/assets/index-D_0wKAT2.js  361.32 kB
```
Hashes **idênticos** aos que já estão publicados em `gh-pages` neste momento — ou seja, o conteúdo React/CSS não mudou nesta sprint (as correções desta sprint foram no `sw.js`, que é copiado como arquivo estático e não entra no hash do bundle JS/CSS — por isso o hash do bundle continua o mesmo, só o conteúdo de `sw.js` mudou).

## Index publicado

`gh-pages/index.html` carrega `assets/index-D_0wKAT2.js` e `assets/index-D3rwHC9F.css` — os mesmos hashes do build local. Confirmado que é o app "Ritual" atual (título, tela de login, CSP headers atuais), não uma versão anterior.

## Confirmação: só o frontend oficial será publicado

- Não existe segundo frontend no repositório (`LEGACY_CLEANUP_REPORT.md`).
- O workflow só publica `frontend/dist` — nada de `backend/` ou de qualquer outra pasta entra nesse pipeline.
- Os 2 arquivos órfãos na raiz (`index.html` antigo, `scratch_deploy_builder.js`) foram removidos e nunca estavam no caminho de publicação de qualquer forma.
- A causa real do "frontend antigo" (cache do Service Worker) foi corrigida na origem em `frontend/public/sw.js` — ver `GITHUB_PAGES_REPORT.md`.

## O que falta para essas correções chegarem à produção

Este documento descreve o estado do **repositório local** depois das correções. Para elas valerem em produção:

1. **Backend** (`CheckinMapper.js`, `GoogleSheetsCheckinRepository.js`) — precisa de `clasp push` + `clasp deploy` (já rodei a build local; falta publicar).
2. **Frontend** (`sw.js` com cache-busting) — precisa que o commit chegue à `main` remota (`git push`), o que dispara automaticamente o workflow de deploy para `gh-pages`. Só depois disso os navegadores presos na versão antiga vão finalmente detectar o novo Service Worker e se libertar do cache velho.

Nenhum dos dois passos foi executado ainda — aguardando sua confirmação, como de costume para ações de produção.
