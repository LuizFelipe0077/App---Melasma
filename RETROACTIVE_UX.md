# RETROACTIVE_UX.md — Fluxo da Liberação Retroativa por Data

## Modelo

Toda liberação autoriza **uma única data específica**, nunca uma janela de dias. Validade fixa de **24 horas** a partir da concessão, não configurável.

## Painel do administrador

**Gatilho**: botão "Liberar retroativo" em cada linha da lista de pacientes (`PatientTable.jsx`) e no painel de detalhe do paciente (`QuickActions.jsx`).

**Bottom Sheet** (`ReleaseModal.jsx`), nesta ordem:
1. Nome do paciente (contexto, somente leitura).
2. Campo de data (`<input type="date">`, limitado a não permitir datas futuras).
3. Ao escolher a data, busca ao vivo (`gerarDashboard` com `dataInicio=dataFim=data escolhida`) e mostra o resumo dos suplementos daquele dia com horário e status atual.
4. Motivo da liberação — opcional.
5. Texto fixo: "Esta autorização expirará automaticamente em 24 horas." — sem nenhum campo para alterar esse prazo.
6. Botão "Autorizar" envia `{ pacienteId, dataLiberada, motivo }` para `liberarRetroativo`.

## Painel do paciente

**Card no topo do Dashboard** (`RetroactiveCard.jsx`) — aparece automaticamente quando existe uma liberação ativa (busca `obterLiberacaoRetroativaAtiva` uma vez ao carregar a tela):
- Título "Retroativo disponível" com ícone 🔓.
- Texto: "Você recebeu autorização para registrar os suplementos do dia: **DD/MM/AAAA**".
- Countdown ao vivo em horas e minutos ("23h 17min"), atualizado a cada minuto, calculado localmente a partir do `expiraEm` já buscado — sem repolling.
- Botão "Registrar Retroativo" abre a tela do dia liberado.
- Some sozinho assim que o countdown chega a zero (sem nova chamada ao servidor).

## Calendário

`CalendarPage.jsx` busca a mesma liberação ativa e marca visualmente o dia correspondente (`HeatmapMonth.jsx`):
- Anel azul (`--retroactive`, cor fixa e independente do protocolo do paciente — Melasma/terracota ou Desinflamação/verde não interferem, pois é um estado de segurança, não de tema).
- Badge 🔓 sobreposto no canto do dia.
- Entrada "Retroativo liberado" na legenda.
- O destaque é **aditivo** — não substitui a cor de status (completo/parcial/perdido) do dia, só sobrepõe o indicador.

Clicar no dia destacado abre a tela interativa de registro (abaixo). Clicar em qualquer outro dia continua abrindo o Sheet somente-leitura de sempre — nenhum outro comportamento do calendário foi alterado.

## Tela do retroativo

`RetroactiveCheckinSheet.jsx`, acionada tanto pelo botão do card quanto pelo clique no dia destacado do calendário — mesma tela, mesmo componente, sem duplicação:
- Busca só o dia liberado (`gerarDashboard` com `dataInicio=dataFim=dataLiberada`).
- Mostra somente os suplementos daquele dia, horário original e status — reaproveita o mesmo componente `DoseTimelineItem.jsx` já usado na tela "Hoje", garantindo visual e comportamento de toque idênticos (tap para marcar/desmarcar).
- Nenhum controle de navegação para outro dia existe no componente — a única data possível é a que foi passada via prop.
- Marcar/desmarcar chama `registrarCheckin`/`cancelarCheckin` exatamente como o fluxo normal do dia atual — nenhuma flag especial é enviada pelo frontend; a autorização é resolvida inteiramente no backend (ver `RETROACTIVE_SECURITY.md`).

## Decisão de design: Sheet, não rota

Todo drill-down do app do paciente (dia do calendário, confirmação de "concluir todos") já usa o componente `Sheet` compartilhado, nunca uma rota nova. A tela do retroativo segue a mesma convenção — evita introduzir um padrão de navegação novo e herda de graça o gesto de arrastar-para-fechar já implementado nesse componente.
