# GITHUB_PAGES_REPORT.md — auditoria do frontend "antigo" no GitHub Pages

## Resultado da auditoria, direto ao ponto

**O GitHub Pages está servindo o frontend correto e atual.** Carreguei `https://luizfelipe0077.github.io/App---Melasma/` ao vivo neste momento e confirmei: título, HTML, CSS e JS batem exatamente com o build mais recente deste repositório (mesmos hashes de asset do `npm run build` local: `index-D_0wKAT2.js`, `index-D3rwHC9F.css`). A tela renderizada é a "Ritual" atual ("Bem-vinda de volta", "Configurações de conexão"), não a interface antiga.

Isso significa que o que você viu **não é um problema de deploy/repositório** — é causado por **cache do Service Worker no seu navegador**, que eu encontrei e corrigi (causa raiz real, detalhada abaixo). Vou responder cada item do checklist com o que encontrei.

## 1. Branch utilizada pelo GitHub Pages

`gh-pages` (branch dedicada, gerada automaticamente pelo workflow de deploy — não é a `main`).

## 2. Pasta publicada

Raiz da branch `gh-pages` (`index.html`, `assets/`, `manifest.json`, `sw.js`, `.nojekyll` na raiz) — corresponde exatamente ao conteúdo de `frontend/dist` após `npm run build`, publicado por [.github/workflows/deploy-frontend.yml](.github/workflows/deploy-frontend.yml):
```yaml
- name: Deploy to gh-pages branch
  uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: frontend/dist
```

## 3. Existe mais de um frontend no repositório?

Não. Só existe `frontend/` (o app Vite+React atual). Não existe `frontend-old/`, `legacy/`, `docs/` ou qualquer segunda pasta de app.

## 4-5. Build antigo ou index.html antigo sendo publicado?

Não no que é servido — a branch `gh-pages` (o que o navegador realmente recebe) contém só o build atual, confirmado ao vivo. **Mas existiam vestígios na branch `main`** (não publicados, mas presentes no repositório): um `index.html` na raiz do projeto (fora de `frontend/`), que era um redirect estático:
```html
<meta http-equiv="refresh" content="0; URL='./frontend/index.html'" />
```
Esse arquivo é um resquício de uma correção manual anterior a este workflow de deploy (provavelmente de quando o GitHub Pages ainda estava mal configurado, antes deste projeto ter um pipeline de build). Ele nunca chega a ser servido hoje porque o Pages aponta para `gh-pages`, não para a raiz da `main` — mas era um vestígio morto, removido na limpeza (ver `LEGACY_CLEANUP_REPORT.md`).

## 6. Configuração de HashRouter herdada?

Não — `HashRouter` é a escolha atual e intencional do app (`frontend/src/main.jsx`), necessária porque o site é servido como arquivo estático sem roteamento de servidor. Não há vestígio de um router antigo diferente.

## 7. Configuração antiga de Vite/GitHub Pages?

`frontend/vite.config.js` usa `base: './'` (caminho relativo) — isso está correto e é por isso que os assets carregam certo mesmo com o app publicado num subcaminho (`/App---Melasma/`). Não encontrei configuração conflitante ou herdada.

## 8-9. Pastas/arquivos órfãos do frontend antigo

Dois arquivos órfãos na raiz do repositório (fora de `frontend/`), sem nenhuma referência em workflows, `package.json` ou documentação:
- `index.html` (redirect stub descrito acima)
- `scratch_deploy_builder.js` (17KB) — um script Node avulso que gera uma página HTML de "Deployment Handbook" (documentação de deploy, mermaid.js, etc.) — **não relacionado ao app React**, não referenciado por nenhum workflow ou script. Puro resquício de uma sessão de trabalho anterior.

Nenhuma pasta `dist`, `build`, `frontend-old` ou `legacy` foi encontrada na raiz do repositório (só existe `backend/dist`, que é gerado e gitignorado — correto, não é publicado em lugar nenhum).

## Causa raiz real do "frontend antigo continua aparecendo"

`frontend/public/sw.js` — o Service Worker registrado pelo app usa **cache-first para toda requisição do mesmo domínio, inclusive a navegação (`index.html`)**, com um nome de cache fixo (`clinical-tracking-v3`) que **nunca muda entre builds**:
```js
event.respondWith(
  caches.open(CACHE_NAME).then(async (cache) => {
    const cached = await cache.match(request);
    if (cached) return cached;   // nunca revalida com a rede se já tem algo em cache
    ...
  })
);
```
O Vite dá um hash de conteúdo novo para o JS/CSS a cada build (`index-XXXXXXXX.js`) — mas o **`index.html` em si nunca muda de nome**. Resultado: assim que seu navegador visitou o site uma vez e cacheou o `index.html` (que aponta para os hashes daquele build), o Service Worker **nunca mais verifica a rede para esse arquivo** — ele responde do cache local para sempre, apontando para hashes de asset que o servidor pode já ter apagado num deploy seguinte (o workflow substitui o conteúdo da `gh-pages` inteiro a cada deploy). Isso trava qualquer visitante recorrente exatamente na versão que estava no ar na primeira visita dele — indefinidamente, não importa quantos deploys novos aconteçam depois. Do seu ponto de vista isso é indistinguível de "o Pages está servindo o frontend errado", mas o servidor está correto o tempo todo — é o seu navegador que nunca mais pediu a versão nova.

## Correção aplicada (raiz, não workaround)

`frontend/public/sw.js`: requisições de **navegação** (carregar `/` ou `/index.html`) agora vão **primeiro para a rede**, com fallback pro cache só se estiver offline. Assets com hash (`/assets/*.js`, `/assets/*.css`) continuam cache-first (seguro, porque um arquivo mudado sempre tem uma URL nova). `CACHE_NAME` foi incrementado para `clinical-tracking-v4`, forçando uma limpeza única do cache antigo em quem já está preso na versão velha (a lógica de limpeza em `activate` já existia e estava correta — só nunca era acionada porque o nome do cache nunca mudava).

Isso segue exatamente o padrão padrão de mercado para PWAs com Vite: app-shell (HTML) sempre revalidado, assets imutáveis (com hash) cacheados de forma agressiva.
