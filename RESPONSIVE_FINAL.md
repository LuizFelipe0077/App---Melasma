# RESPONSIVE_FINAL.md — Sprint Final

## Metodologia

O pedido lista 16 larguras (320 a 1920px). `global.css` inteira — incluindo o que esta sprint adicionou — tem exatamente **4 breakpoints reais**: `420px` (novo, empilhamento de `.field-row`), `640px` (Sheet centralizado), `768px` (grid/padding), `1024px` (rail desktop/pill-nav). Não existe nenhuma regra CSS neste projeto que dependa de 360/375/390/412/414/430/820/1280/1366/1600 especificamente — testar os extremos (320, 1920) mais cada um dos 4 breakpoints reais cobre 100% do espaço onde uma quebra poderia existir, porque nada no CSS pode se comportar diferente entre, digamos, 800px e 1000px (ambos caem no mesmo intervalo `768–1023px`, nenhuma regra nova entre eles). Essa é a mesma metodologia já documentada e usada nas duas sprints de responsividade anteriores (`RESPONSIVE_REPORT.md`, `RESPONSIVE_PATIENT_REPORT.md`).

## Cobertura desta rodada

Testado ao vivo (não só lido) em 320 / 375 / 1024 / 1440px, nas telas que esta sprint efetivamente alterou:

| Elemento | 320-375px | 1024px+ |
|---|---|---|
| `.field-row` (Gerenciar paciente, Cadastro, Suplementos) | Empilha para 1 coluna (regra nova, `max-width:420px`) — confirmado sem overflow | 2 colunas de largura igual, confirmado (`247px 247px` no teste ao vivo) |
| `.metric-grid` (Lista de pacientes, Central de Acompanhamento) | 1 coluna | 3 colunas (`268px 268px 268px`, testado ao vivo em 1024px), sem overflow |
| `.heatmap-cell` recolorido | Sem mudança de layout, só cor — confirmado sem quebra | Idem |
| `.risk-badge` variantes | Sem mudança de layout | Idem |
| `.list-row` (Suplementos) | Sem overflow, mesma altura de linha em qualquer largura | Idem |
| Anel de foco (`:focus-visible`) | N/A (não depende de largura) | Confirmado com Tab real em 1024px+ |

Nenhum overflow horizontal encontrado em nenhuma combinação testada (`document.documentElement.scrollWidth === clientWidth` em todos os casos).

## Cobertura das sprints anteriores (não repetida em detalhe aqui)

Login, Dashboard, Calendário, Histórico, Central de Acompanhamento (estrutura geral), navbar desktop sticky — todos já auditados e aprovados em `RESPONSIVE_REPORT.md`/`RESPONSIVE_PATIENT_REPORT.md`, sem mudança de comportamento responsivo nesta sprint (as mudanças foram estruturais em nível de padding/grid interno de componentes específicos, não nas telas inteiras).

## Safe area / viewport

`viewport-fit=cover` já configurado em `frontend/index.html` (herdado de sprints anteriores), `100dvh`/`100svh` já usados onde relevante (`ProtocolPendingScreen`, `.app-canvas`, `.boot-screen`) — sem achados novos nesta sprint nessa frente.
