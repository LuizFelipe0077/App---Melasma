# UI_AUDIT_FINAL.md — Sprint Final

Auditoria geral por área da aplicação, cobrindo o checklist completo do pedido (Administrador, Paciente, Login, Dashboard, Calendário, Histórico, Central de Acompanhamento, Configurações, Modais, Bottom Sheets, Toasts, Tabelas, Cards).

| Área | Estado encontrado | Ação |
|---|---|---|
| **Login** | Já consistente (`.field`/`.field-input`/`.btn-fill`), sem achados novos | Nenhuma |
| **Configurações** (Sheet de endpoint na tela de login) | Já usa `Sheet`/`.field-input` padrão | Nenhuma |
| **Dashboard do paciente** | 3 linhas de info repetiam `color:'var(--ink)'` inline (introduzidas na sprint anterior) | Unificado em `.body-md-strong` |
| **Calendário** | Cores da legenda/células já corrigidas na sprint anterior; sem achados novos além da revisão geral | Nenhuma |
| **Histórico do paciente** | Consistente, sem achados | Nenhuma |
| **Tela de bloqueio de protocolo** (`ProtocolPendingScreen`) | 1 ocorrência de `color:'var(--ink)'` inline | Unificado em `.text-ink` |
| **Lista de pacientes (admin)** | Linha de estatísticas em Flex manual; toolbar com paddings hardcoded | Migrado para `.metric-grid`; paddings normalizados |
| **Tabela de pacientes** | Linha clicável sem suporte a teclado | `role="button"`+`tabIndex`+`onKeyDown` adicionados |
| **Modal "Gerenciar paciente"** | Par de campos de data em Flex manual; botão de exclusão com estilo inline sem hover | Migrado para `.field-row`; `.btn-ghost-danger` novo |
| **Assistente de cadastro de paciente** | Par de campos de data em Flex manual (mesmo padrão); linha de suplemento com estilo inline | `.field-row`; `.list-row` |
| **Gerenciar suplementos** | 2 pares de campo em Flex manual; linha de suplemento com estilo inline | `.field-row` (×2); `.list-row` |
| **Central de Acompanhamento — Resumo geral/Prontuário** | 2 linhas de métricas em Flex manual (3 e 7 itens, quebra desigual) | Migradas para `.metric-grid` |
| **Central de Acompanhamento — Card de Risco** | Cor definida via 5 estilos inline distintos, sem reaproveitar o padrão de badge do resto do app | `.risk-badge--success/--warning/--danger` |
| **Central de Acompanhamento — Gauge de Adesão** | Cor "Baixa" era hex cru sem token | Trocado para `var(--warning)` |
| **Central de Acompanhamento — Mapa de Consistência** | Usava o token duplicado `--danger-fill`; texto de ênfase inline | Unificado para `--danger`; `.text-ink` |
| **Central de Acompanhamento — Evolução Semanal** | Tira de cards com estilos inline duplicados (Flex já correto, só não reutilizava a classe existente) | Reaproveita `.heatmap-strip` |
| **Central de Acompanhamento — Prontuário Cronológico** | Linha de dia não operável por teclado, sem hover, com overrides inline redundantes | Teclado + hover adicionados; `.timeline-day-row` simplificada |
| **Central de Acompanhamento — Alertas/Observações** | Texto de ênfase inline (2 ocorrências) | `.text-ink` |
| **Toasts** | **Bug real encontrado**: toast de erro nunca ficava vermelho (variável CSS com nome errado, `--color-danger-fill` nunca existiu) | Corrigido para `var(--danger)` |
| **Bottom Sheets** | Já consistentes (`Sheet.jsx` único componente, reaproveitado em todo o app) | Nenhuma |
| **Cards (`.surface`)** | Já consistentes | Nenhuma |

## Overflow / containers sobrepostos / textos cortados

Verificado ao vivo (não apenas por leitura de código) em 320px/375px/1024px/1440px para as telas afetadas por esta sprint: `document.documentElement.scrollWidth === clientWidth` em todos os casos testados — nenhum overflow horizontal encontrado. Ver `RESPONSIVE_FINAL.md` para a tabela completa de breakpoints.

## Nada foi encontrado (para deixar registrado, não só o que foi corrigido)

- Botões (`.btn`), navegação (`.rail-link`/`.pill-nav-item`/`.tab-item`), inputs (`.field-input`) já tinham tratamento de hover/active consistente antes desta sprint — só faltava foco visível (ver `COMPONENT_CONSISTENCY.md`), não hover/active.
- Nenhum uso de `<table>` HTML real existe no app — "tabelas" no admin são listas de linhas (`.roster-row`/`.list-row`), já cobertas acima.
- Nenhuma segunda implementação de Sheet/Modal/Toast foi encontrada — os 3 sistemas de overlay são cada um uma única implementação reaproveitada em todo o app, não haviam variações a unificar.
