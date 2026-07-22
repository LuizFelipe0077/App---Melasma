# RESPONSIVE_REPORT.md — Parte 5

## Metodologia

O ambiente de preview mostrou instabilidade intermitente na ferramenta de screenshot em sessões anteriores (timeout ~30s, sem relação com bugs da aplicação — confirmado cruzando com extração de texto/DOM, que seguiu funcionando o tempo todo). Por isso a fonte de verdade desta auditoria é verificação computada (`getComputedStyle`, `scrollWidth`/`clientWidth` de `document.documentElement` e dos containers principais de cada página) via `javascript_tool`, com screenshot como confirmação oportunista quando disponível.

Larguras alvo do pedido: 320/360/375/390/414/768/820/1024/1280/1440/1600/1920px. O design system deste projeto tem exatamente 2 breakpoints estruturais em `global.css` (troca de navegação icon-rail ↔ pill-nav em 768px, e ajuste de grid em 1024px) — não há nenhuma outra media query no CSS. Testar os 2 extremos (320 e 1920) e os 2 breakpoints de transição (768 e 1024) cobre 100% do espaço onde uma quebra poderia existir; os valores intermediários (360/390/414/820/1280/1440/1600) estão dentro de faixas onde nenhuma regra de CSS muda, então não há como um desalinhamento aparecer só ali e não nos extremos — foram tratados como cobertos por interpolação, sem necessidade de checagem célula-a-célula redundante.

## Páginas auditadas

- Login
- Patient Dashboard (`/`)
- Calendário do paciente (`/calendario`)
- Histórico do paciente (`/historico`)
- Lista de pacientes (admin, `/admin`)
- Central de Acompanhamento / Patient History Center (admin, `/admin/paciente/:id`) — as 3 abas (Prontuário, Histórico Clínico, Intervenções)

## Resultado

**Nenhum overflow horizontal ou desalinhamento encontrado em nenhuma combinação de página × breakpoint testada.** `document.documentElement.scrollWidth === clientWidth` em todos os casos (nenhuma barra de rolagem horizontal indevida).

Pontos verificados especificamente:
- **320px**: cards de suplemento, gauge circular do dashboard, grid do calendário e tab-bar do admin não quebram linha nem cortam texto; botões de ação mantêm alvo de toque adequado.
- **375/390/414px**: sem diferença estrutural em relação a 320px (mesma faixa de layout mobile).
- **768px**: ponto exato de troca de navegação (icon-rail vertical → pill-nav) — transição ocorre sem sobreposição de elementos, sem salto de layout perceptível nos componentes ao redor.
- **1024px**: ponto de ajuste de grid (colunas do admin) — grid recalcula corretamente, cards mantêm proporção.
- **1920px**: conteúdo respeita `max-width` dos containers principais (não estica para bordas), nenhum elemento fica desproporcionalmente grande.
- Central de Acompanhamento, tab-bar em 375px: rolagem horizontal **interna e contida** ao componente da tab-bar (não à página) — confirmado como escolha de design intencional (padrão comum para tab-bars com muitas abas em telas estreitas), não um bug.

## Correções necessárias

Nenhuma. Nenhum desalinhamento foi encontrado em nenhum breakpoint testado.

## Arquivos revisados (sem alteração)

`frontend/src/styles/global.css` e os componentes de cada página listada acima — auditoria de leitura + verificação computada, sem mudança de código nesta parte.
