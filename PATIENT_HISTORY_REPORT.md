# PATIENT_HISTORY_REPORT.md

Central de Acompanhamento Clínico do Paciente — nova área do painel administrativo.

## O que foi construído

Uma **página completa** (não modal), acessível pelo botão "Histórico" em qualquer linha da tabela de pacientes, em `/admin/paciente/:pacienteId`:

- **Cabeçalho**: avatar (inicial do nome), nome, protocolo, datas de início/fim, indicador de status (● Em dia / ● Atenção / ● Atrasado, derivado da taxa de adesão do período selecionado), botões de exportar CSV/PDF.
- **Progresso do tratamento**: dias concluídos, dias restantes, % concluído — calculado a partir das datas do paciente, independente do filtro.
- **Filtro de período**: 7 / 15 / 30 dias / todo o tratamento — controla uma única chamada a `gerarDashboard`, que por sua vez alimenta todas as seções abaixo (resumo, timeline, heatmap, gráfico, evolução semanal, alertas). Ver decisão de escopo abaixo.
- **Resumo geral**: check-ins realizados, suplementos programados, adesão %, dias perfeitos, dias com falhas, sequência atual, maior sequência.
- **Alertas**: computados no cliente a partir dos mesmos dados já carregados — sem chamada nova.
- **Gráfico de adesão**: SVG simples, % diário dos últimos 30 dias com dado (estilo Apple Health, sem biblioteca de gráficos).
- **Mapa de calor**: grade de quadrados por dia, estilo GitHub, colorido por status.
- **Evolução semanal**: cards de % por semana.
- **Linha do tempo**: todo o período selecionado, dia a dia, cada um expansível mostrando os suplementos daquele dia (nome, horário, status, horário do check-in).
- **Observações clínicas**: formulário + lista, visível só para admin, com aviso explícito de que nunca é exibido ao paciente.

## Decisão de escopo: o filtro controla tudo, exceto o cabeçalho

O pedido original descreve a timeline como "cada dia do tratamento... Dia 01... Dia 90" e, separadamente, um filtro de período. Interpretar isso literalmente significaria ter dois períodos diferentes visíveis ao mesmo tempo sem indicação clara de qual seção usa qual. Optei por um padrão único e coerente (o mesmo usado por Apple Health, Stripe Dashboard, Linear — referências citadas no próprio pedido): **o filtro de período é a fonte de verdade para todas as seções de dados**, com "Todo o tratamento" como filtro padrão — o que já entrega a visão de 90 dias completa por padrão, e permite focar em 7/15/30 dias quando necessário. Só o cabeçalho (datas, dias concluídos/restantes) é sempre relativo ao tratamento inteiro, porque essas datas são propriedades do paciente, não do filtro.

## Dados: nenhuma chamada nova além de observações clínicas

Todas as seções (resumo, timeline, heatmap, gráfico, evolução semanal, alertas) são derivadas de **uma única chamada** a `gerarDashboard` (a mesma action já usada pelo paciente, agora com `pacienteId` escolhido pelo admin) — `frontend/src/utils/buildDayRecords.js` faz o trabalho de agrupar os `rawCheckins` por dia e classificar cada um (completo/parcial/sem check-in/futuro). A única chamada verdadeiramente nova é `listarObservacoesClinicas`/`criarObservacaoClinica`.

**Limitação conhecida e documentada**: suplementos adicionados a um paciente via `adicionarSuplemento` (depois da criação) não geram check-ins `PENDENTE` futuros automaticamente (diferente do fluxo de criação, que pré-gera um registro por dose futura) — então a timeline só mostra esses suplementos nos dias em que um check-in de fato existe. É uma limitação herdada do comportamento atual do backend, não introduzida por esta funcionalidade.

**"Última atividade" nos alertas**: o sistema não rastreia acesso/login ao app em lugar nenhum hoje. O alerta usa o check-in mais recente como um proxy honesto, com o rótulo explicando isso — não inventei uma métrica de acesso que não existe.

## Mudanças de backend (aditivas, ver commits para detalhes)

1. `gerarDashboard`: `gamificacao` ganhou o campo `maiorStreak` (já calculado internamente, só não era retornado).
2. `listarPacientes`: ganhou o campo `protocoloNome` (necessário para o cabeçalho e o tema visual).
3. Duas actions novas, admin-only: `criarObservacaoClinica` e `listarObservacoesClinicas`, com uma aba nova no Sheets (`Observacoes`) seguindo exatamente o mesmo padrão arquitetural das demais (use case + repositório + rota).

Nenhuma action, payload ou resposta existente foi alterada — apenas campos novos adicionados a duas respostas já existentes, e duas actions inteiramente novas. Login, autenticação, Google Apps Script e as demais abas do Sheets não foram tocados.

## Exportação

- **CSV**: gerado inteiramente no cliente a partir dos dados já carregados (um `Blob`), sem chamada nova.
- **PDF**: em vez de adicionar uma biblioteca de geração de PDF (o projeto mantém dependências mínimas desde o início), o botão "Exportar PDF" aciona `window.print()` com uma folha de estilos `@media print` dedicada (esconde navegação/botões, expande o conteúdo) — o usuário salva como PDF pelo diálogo nativo do navegador. Troca de abordagem futura é simples, se necessário.

## Performance

90 dias na timeline/heatmap são ~91 elementos DOM — não há necessidade real de virtualização (limiar típico para justificar `react-window` é na casa dos milhares). Só um dia fica expandido por vez, então o conteúdo detalhado (lista de suplementos por dia) nunca é renderizado para mais de um dia simultaneamente.
