# GRID_FLEX_REVIEW.md — Sprint Final

## Critério usado

Grid para layouts de colunas repetidas/iguais que precisam alinhar em 2 dimensões (linha e coluna simultaneamente). Flex para alinhamento linear (uma dimensão), toolbars, e listas que **não** devem quebrar em múltiplas linhas com reflow (scroll horizontal, ou tamanhos assimétricos intencionais). Cada caso abaixo foi decidido por esse critério, não por padrão/costume.

## Migrado de Flex para Grid

### 1. Pares de campo lado a lado (4 ocorrências → 1 classe)

`ManagePatientModal.jsx` (Início/Fim), `RegisterPatientWizard.jsx` (Início/Fim), `SupplementFields.jsx` (Nome/Dosagem, Quantidade/Tipo — 2 pares) usavam `flex gap-3` + `style={{flex:1}}` em cada campo. São colunas de largura **igual**, exatamente o caso de uso de Grid, não de Flex (Flex com `flex:1` em cada filho simula um grid de 2 colunas, mas de forma mais verbosa e sem o controle de `grid-template-columns` para o breakpoint de empilhamento). Nova classe `.field-row` (`display:grid; grid-template-columns: 1fr 1fr;`, empilha para 1 coluna abaixo de 420px). 4 implementações → 1 classe, usada em 4 lugares.

### 2. Linhas de estatísticas (3 ocorrências → 1 classe)

`AdminPatientsPage.jsx` (3 `StatChip`), `PatientHistoryPage.jsx` (2 linhas de `.metric-card`, com 3 e 7 itens respectivamente) usavam `flex gap-4 flex-wrap` com cada item dependendo de `flex:1`/tamanho natural. Com 7 itens isso produzia quebra desigual (linhas com números diferentes de itens dependendo da largura exata da viewport). Nova classe `.metric-grid` (`grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))`) — alinhamento consistente em qualquer contagem de itens e qualquer largura, sem depender de quebra de linha manual do flex-wrap. 3 implementações → 1 classe, usada em 3 lugares.

## Revisado e mantido como Flex (decisão técnica, não omissão)

### 3. `WeeklyEvolution.jsx` — tira de cards de semana

Usa `flex` com `overflow-x: auto` — uma tira que **rola horizontalmente em ordem cronológica**, não deve quebrar em múltiplas linhas (isso destruiria a leitura sequencial "semana 1, 2, 3..."). Grid com `auto-fit`/`wrap` reintroduziria exatamente o problema que Grid resolve nos outros dois casos — aqui seria o resultado errado. Mantido como Flex, mas a implementação foi limpa: em vez de estilos inline duplicados (`overflowX`, `gap`, `paddingBottom`), passou a reaproveitar a classe `.heatmap-strip` já existente (usada para o mesmo padrão de "tira rolável" no dashboard do paciente) — menos código novo, mesmo comportamento.

### 4. `PatientHistoryPage.jsx` — linha `AdherenceIndexCard`/`RiskCard`

Usa `flex` com `flex: '1 1 420px'` e `flex: '1 1 280px'` — dois painéis **intencionalmente de tamanhos diferentes** lado a lado, que quebram para empilhados em telas estreitas. Isso não é "3+ colunas iguais", é exatamente o caso de uso correto de Flex com `flex-basis` assimétrico. Grid exigiria definir `grid-template-columns` com frações arbitrárias para simular o mesmo resultado, sem ganho. Mantido como Flex.

## Migrado de Grid para Flex

Nenhum caso encontrado. Os poucos usos de Grid já existentes na base (`.summary-grid`, `.heatmap-month-grid`, `.heatmap-strip-large`) já estavam tecnicamente corretos — todos são grades reais de colunas repetidas (resumo 1-2 colunas, calendário 7 colunas fixas, heatmap 15/30 colunas fixas). Nenhum deles deveria ser Flex.

## Resumo

- **2 novas classes de Grid** criadas (`.field-row`, `.metric-grid`), substituindo **7 implementações manuais de Flex** que deveriam ter sido Grid desde o início.
- **2 casos revisados e confirmados como Flex correto** (não migrados) — documentados com a justificativa técnica específica de cada um, não deixados “porque sim”.
- **0 casos de Grid indevido** encontrados.
