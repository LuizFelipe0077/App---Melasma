# VISUAL_QA_REPORT.md — Sprint Final

Inspeção em navegador (não apenas leitura de código) das mudanças desta sprint, com `window.fetch` mockado localmente — sem chamada real de produção.

## Resultados

| Verificação | Método | Resultado |
|---|---|---|
| `.metric-grid` é realmente Grid | `getComputedStyle().display` | `"grid"` confirmado, em 320px (1 coluna, `288px`) e 1024px (3 colunas, `268px 268px 268px`) |
| `.field-row` empilha corretamente | `getComputedStyle().gridTemplateColumns` | 2 colunas (`247px 247px`) acima de 420px, 1 coluna (`321px`) em 375px |
| `.btn-ghost-danger` aplica a cor certa | `getComputedStyle().color` | `rgb(181, 69, 63)` = `#B5453F` = `--danger`, exato |
| `.heatmap-cell.missed` é sólido, não pastel | `getComputedStyle().backgroundColor` | `rgb(181, 69, 63)` sólido, confirmado (ver nota de metodologia abaixo) |
| `.risk-badge--success/--warning/--danger` | Injeção isolada + `getComputedStyle()` | As 3 variantes retornam exatamente os mesmos pares wash/ink de `.chip-success/-warning/-danger` |
| Anel de foco visível | Tecla **Tab** real (não `.focus()` via script) | `box-shadow` computado = `rgba(38,35,32,0.32) 0px 0px 0px 3px` — o token `--ring` aplicado corretamente |
| Linha de paciente operável por teclado | Foco real + evento `keydown` com `key:'Enter'` | Abre o modal "Gerenciar paciente", mesmo resultado do clique do mouse |
| `npm run build` | Build de produção | Sem erros, sem warnings novos |

## Nota de metodologia — cache de Service Worker durante o próprio teste

Ao testar `.heatmap-cell.missed`, o primeiro resultado veio incorreto (cor antiga, pastel) mesmo depois de recarregar a página. Investigando: o navegador de preview tinha uma entrada de cache (`clinical-tracking-v4`, do Service Worker corrigido na sprint anterior) sobrevivendo entre sessões de teste desta própria conversa e servindo uma versão desatualizada de `global.css` para o próprio ambiente de desenvolvimento — **não é um bug do app**, é o cache local deste navegador de teste. Confirmei isso comparando com o CSS servido diretamente pelo servidor de dev (que já estava correto) e resolvendo com `caches.delete()` explícito antes de recarregar. Registrado aqui porque é exatamente o mesmo mecanismo (cache-first do Service Worker) que foi corrigido para produção na sprint anterior — a correção já existe, só não retroage sobre um cache que uma sessão de teste anterior já tinha populado neste navegador local.

## Não verificado ao vivo nesta rodada

`RiskCard.jsx` dentro do fluxo completo da Central de Acompanhamento não foi exercitado de ponta a ponta — o mock simplificado usado nesta verificação não reproduz o formato completo que `patientInsights.js` espera para calcular `risk`, e a página já tem uma fragilidade conhecida e já sinalizada (falta de Error Boundary, documentada em sprint anterior) que a faz ficar em branco com dados mockados incompletos, não relacionada a esta sprint. Verifiquei o `.risk-badge` isoladamente (injeção direta de HTML/classe) para confirmar que o CSS em si está correto, o que é suficiente para esta mudança (troca de classe, não de lógica).

## Regressão

`npm run build` (frontend) limpo. Nenhuma mudança de backend nesta sprint — testes de backend não impactados, não re-executados por não haver nada neles para regredir.
