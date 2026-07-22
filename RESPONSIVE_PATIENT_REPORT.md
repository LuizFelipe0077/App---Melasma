# RESPONSIVE_PATIENT_REPORT.md — Parte 10

Reaudita os elementos **novos** desta sprint nos mesmos breakpoints já cobertos na sprint de estabilização anterior (320/768/1024/1920 — ver `RESPONSIVE_REPORT.md` para a metodologia completa e a cobertura dos elementos pré-existentes, não repetida aqui).

## Elementos verificados

| Elemento | 320px | 1024px+ |
|---|---|---|
| `ProtocolPendingScreen` (tela de bloqueio) | Sem overflow horizontal; texto e badge de contagem regressiva legíveis, botão "Sair" não sobrepõe o conteúdo | Conteúdo centralizado com `max-width: 440px`, não estica |
| Linha de info do dashboard ("Hoje faltam / Próximo horário / Dias restantes") | `flex-wrap: wrap` evita overflow — os 3 blocos quebram linha graciosamente em telas estreitas | 3 blocos lado a lado sem quebra |
| `.calendar-treatment-badge` | Sem overflow, os dois números ficam lado a lado dentro do card | Igual, com mais respiro |
| Legenda do calendário (5 itens agora, incluindo "Hoje") | `flex-wrap: wrap` já existente absorve o item extra sem quebrar layout | Uma linha só |
| `.rail` sticky (Parte 9) | N/A — `.rail` só existe a partir de 1024px (`display:none` abaixo disso, navegação mobile usa `.pill-nav`, inalterado) | Confirmado sticky, ver `PATIENT_UX_REPORT.md` |

## Resultado

Nenhum desalinhamento ou overflow horizontal encontrado em nenhum elemento novo desta sprint, em nenhum dos breakpoints testados. `document.documentElement.scrollWidth === clientWidth` em todos os casos verificados via `javascript_tool`.
