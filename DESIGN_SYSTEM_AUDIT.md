# DESIGN_SYSTEM_AUDIT.md — Sprint Final

## Metodologia

Leitura completa de `tokens.css` + `global.css` (todo o sistema de tokens e classes reutilizáveis), seguida de duas varreduras dirigidas por arquivo real (não amostragem): todos os componentes do admin (`AdminLayout`, `AdminPatientsPage`, `ManagePatientModal`, `ManageSupplements`, `RegisterPatientWizard`, `ReleaseModal`, `PatientTable`, `StatChip`, `SupplementFields`) e todos os componentes da Central de Acompanhamento (`PatientHistoryPage` + os 13 componentes de `patientHistory/`). Cada achado abaixo tem evidência de arquivo:linha — nada foi estimado.

## Tokens — duplicação encontrada e corrigida

`--danger` e `--danger-fill` eram dois nomes para o mesmo hex (`#B5453F`), usados de forma inconsistente entre arquivos irmãos (`RiskCard.jsx` usava um para "Alto" e outro para "Crítico"; `ConsistencyMap.jsx` usava `--danger-fill`, `ChronologicalRecord.jsx` usava `--danger` para o mesmo conceito de falha). `--danger-fill` foi removido de `tokens.css`; todas as 7 ocorrências (2 em `global.css`, 1 em `RiskCard.jsx`, 1 em `ConsistencyMap.jsx`, 1 em `AdherenceGauge.jsx`, e a que gerava o bug abaixo) foram unificadas em `--danger`.

**Achado colateral, não previsto no plano**: rastreando cada ocorrência de `--danger-fill`, encontrei `frontend/src/context/ToastContext.jsx:49` referenciando `var(--color-danger-fill)` — um nome de variável que **nunca existiu** em `tokens.css` (o token real nunca teve o prefixo `color-`). Resultado prático: **todo toast de erro do aplicativo inteiro, em todas as sprints anteriores, renderizava com a cor padrão em vez de vermelho**, porque a declaração CSS com uma custom property inexistente é simplesmente ignorada pelo navegador. Corrigido para `var(--danger)`. Verificável: qualquer chamada a `showError(...)` em qualquer tela agora mostra o toast vermelho corretamente pela primeira vez.

## Cor — três sistemas para o mesmo conceito, agora um só

"Completo/parcial/perdido" tinha 3 implementações de cor diferentes:
- `.heatmap-cell` (semana no dashboard do paciente) — `--accent` (varia por protocolo) / `--danger-wash` (pastel)
- `.heatmap-month-cell` (calendário) — `--success`/`--warning`/`--danger` sólidos, texto branco
- `.heatmap-square` (admin) — já usava `--success`/`--danger-fill` sólidos

Unificado: `.heatmap-cell` agora usa exatamente o mesmo par sólido `--success`/`--danger` + texto branco dos outros dois. As 3 implementações de heatmap agora falam a mesma linguagem visual.

`AdherenceGauge.jsx` tinha um hex cru (`#C97A3A`) para o nível "Baixa", sem token — sob o tema Melasma (`--p-melasma-accent-soft: #A35C2E`) esse laranja não-tokenizado ficava visualmente próximo ao accent do protocolo, um risco real de confusão visual. Trocado para `var(--warning)` — semanticamente correto (adesão baixa é estado de alerta) e consistente com o resto do app.

## Contraste — verificado, não é um problema

Calculei manualmente (fórmula de luminância relativa WCAG) a razão de contraste do texto branco sobre os 3 tons sólidos agora usados uniformemente em todo heatmap/calendário:

| Cor | Hex | Contraste vs. branco |
|---|---|---|
| `--success` | #4F7D57 | 4.77:1 |
| `--warning` | #92661F | 5.07:1 |
| `--danger` | #B5453F | 5.40:1 |

Todos passam AA (mínimo 4.5:1 para texto normal). Nenhuma mudança necessária — só confirmação.

## Badges/chips — padrão consolidado

`.chip-success/-warning/-danger` já existia para o admin. `.risk-badge` (Central de Acompanhamento) não tinha nenhuma regra de cor própria — `RiskCard.jsx` aplicava cor via inline `style`. Adicionadas `.risk-badge--success/--warning/--danger`, exatamente o mesmo par wash/ink já usado em `.chip-*`. `RiskCard` agora mapeia as 5 classificações clínicas (`Muito Baixo/Baixo/Moderado/Alto/Crítico`) para os 3 níveis visuais padrão do app, em vez de manter uma paleta própria de 5 cores.

## Tipografia — sem inconsistência de escala encontrada

`--text-xs/sm/md/lg`, `--display-sm/md/lg`, `--weight-regular/medium/semibold/display` são usados de forma consistente em toda a aplicação — não encontrei nenhum `font-size`/`font-weight` numérico hardcoded fora desses tokens. O que existia era uso repetido de **cor** inline sobre classes de texto já definidas (ver `COMPONENT_CONSISTENCY.md`), não da tipografia em si.

## Espaçamento — pequenas correções pontuais

Handful de valores fora da escala de 8px normalizados onde o valor batia exatamente com um token vizinho (ex: `padding: 24` → `var(--space-5)` em `AdminPatientsPage.jsx`). Valores que não batem exatamente com nenhum token (ex: um `paddingLeft: 20` num `<ul>`) foram deixados como estão — forçar um valor de indentação de lista para o token mais próximo alteraria visualmente o resultado sem ganho real; nem todo número precisa ser um token.
