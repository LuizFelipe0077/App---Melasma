# LEGACY_CLEANUP_REPORT.md

## Escopo real da limpeza

A auditoria (`GITHUB_PAGES_REPORT.md`) confirmou que **não existe um segundo frontend sendo publicado** — só existiam 2 arquivos órfãos na raiz do repositório, nunca servidos em produção, sem nenhuma referência em workflows/scripts/documentação. Não havia rotas antigas, componentes antigos, branch desnecessária ou build antigo para remover — o app em si (`frontend/`) sempre foi único.

## Removido

| Arquivo | O que era | Por que foi removido |
|---|---|---|
| `index.html` (raiz do repo) | Redirect estático (`<meta http-equiv="refresh">`) para `./frontend/index.html` | Vestígio de uma correção manual anterior ao workflow de deploy atual. Nunca é servido hoje (o GitHub Pages usa a branch `gh-pages`, não a raiz da `main`) — arquivo morto. |
| `scratch_deploy_builder.js` (raiz do repo) | Script Node avulso (17KB) que gera uma página HTML de "Deployment Handbook" com mermaid.js — documentação de deploy, não é o app | Não referenciado por nenhum workflow, `package.json` ou script. Resquício de uma sessão de trabalho anterior, sem relação com o app React. |

Removidos via `git rm` (reversível pelo histórico do git, não um `rm` direto).

## Mantido — não é "frontend antigo"

- **`package.json` (raiz do repo)** — não foi removido. Não é um artefato do frontend antigo: é o único lugar onde `npm test` roda os testes do backend (`node backend/tests/run_tests.js`), já que `backend/package.json` não tem script `test` próprio. Continua em uso ativo nesta própria sessão.
- **`.nojekyll` (raiz do repo)** — necessário para o GitHub Pages não tentar processar o site com Jekyll (que ignoraria pastas/arquivos começados com `_`). Ainda relevante.
- **Branch `gh-pages`** — não é "desnecessária", é o destino oficial e correto do deploy do frontend (gerada e mantida pelo próprio workflow). Não deve ser apagada.

## Confirmação final

Depois da remoção, a raiz do repositório não contém mais nenhum arquivo do frontend fora de `frontend/`. `git status` confirma apenas as 2 remoções (`index.html`, `scratch_deploy_builder.js`) mais as correções de código já commitadas separadamente — nenhum outro arquivo foi tocado por esta limpeza.
