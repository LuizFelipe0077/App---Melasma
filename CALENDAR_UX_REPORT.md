# CALENDAR_UX_REPORT.md — Parte 5

## Estado anterior

O calendário (sprint de estabilização anterior) já tinha a base funcional: dias clicáveis, painel de detalhe por dia (`Sheet`), legenda de 4 categorias. Faltava perceptibilidade de cor, destaque do "hoje" na legenda, e hierarquia mais forte no cabeçalho.

## Mudanças

**Cores mais perceptíveis** (`frontend/src/styles/global.css`): `.completed`/`.partial`/`.missed` passaram de tons pastel (`*-wash`) para preenchimento sólido com texto branco:
```css
.heatmap-month-cell.completed { background-color: var(--success); color: #fff; }
.heatmap-month-cell.partial { background-color: var(--warning); color: #fff; }
.heatmap-month-cell.missed { background-color: var(--danger); color: #fff; }
```
Corresponde diretamente ao pedido de cores "estilo farol" (verde/amarelo/vermelho) em vez dos tons suaves anteriores, que ficavam difíceis de distinguir num relance.

**"Hoje" na legenda**: antes só existia como um anel sutil (`box-shadow: inset 0 0 0 2px`) na própria célula, sem entrada correspondente na legenda — um usuário não tinha como saber o que aquele anel significava. Adicionado à `LEGEND` em `CalendarPage.jsx`, com o swatch usando o mesmo estilo de anel da célula real (anel mais grosso agora, `3px`, sobre `var(--ink)` para contraste em qualquer cor de fundo).

**Cabeçalho mais destacado**: a linha de texto corrida "Faltam N dias..." virou um card (`.calendar-treatment-badge`) com duas métricas lado a lado em destaque tipográfico (`display-sm`): "Dia do tratamento — N de M" e "Faltam — N dias". Usa o mesmo util `buildTreatmentInfo` agora compartilhado com o dashboard (`frontend/src/utils/treatmentInfo.js`), incluindo o novo campo `elapsed` (dia atual do tratamento).

**Animação ao abrir o dia**: já existia — o componente `Sheet.jsx` usado pelo painel de detalhe já anima entrada com slide-up + easing (`ease-glide`, 340ms). Conferido que segue funcionando sem alteração; não havia necessidade de mexer.

**Hover/tap nas células**: de `scale(1.08)` no hover para `scale(1.1)` com easing `ease-settle` (mais "vivo"), mais um novo `:active { scale(0.94) }` para feedback de toque em mobile, que antes não existia (só tinha hover, que não dispara em touch).

## Teste

QA em navegador: legenda renderiza as 5 categorias corretamente (incluindo "Hoje" com o anel visual correto), badge "Dia do tratamento 11 de 91 / Faltam 80 dias" renderiza sem overflow em 320px, clique em dia abre o painel com a mesma animação de sempre.

## Arquivos modificados

- `frontend/src/pages/CalendarPage.jsx`
- `frontend/src/styles/global.css`
- `frontend/src/utils/treatmentInfo.js` (novo, compartilhado com o dashboard)
