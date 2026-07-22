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

---

## Evolução — Central de Decisão Clínica

A página ganhou uma segunda camada: além de mostrar o histórico, ela agora **explica e prioriza** — índices calculados, risco, mapa de consistência por período do dia, resumo com insights derivados, ações rápidas e um prontuário cronológico de verdade, organizados em 3 abas (**Visão Geral**, **Histórico Clínico**, **Intervenções**).

### Índice de Adesão (0-100)

`adesão×0.6 + consistência×0.25 + sequência×0.15`, onde:
- **Adesão** = `taxaAdesaoGeral` do período selecionado.
- **Consistência** = `100 − min(100, desvio-padrão dos % semanais × 2)` — penaliza uma adesão que oscila muito entre semanas, mesmo com boa média.
- **Sequência** = `min(100, streakAtual / maiorStreak × 100)` — quão perto o paciente está da sua melhor marca.

Faixas: ≥90 Excelente · 75–89 Boa · 60–74 Moderada · 40–59 Baixa · <40 Crítica. O card mostra as 3 barras que compõem a nota — a "explicação visual" é literal, não apenas textual.

### Risco de Baixa Adesão (0-100, maior = mais risco)

`(diasPerdidos/diasPassados)×40 + (streakAtual==0 ? 20 : 0) + min(30, diasSemAtividade×5) + (checkins7d < esperado7d×50% ? 10 : 0)`.

Faixas: <20 Muito Baixo · 20–39 Baixo · 40–59 Moderado · 60–79 Alto · ≥80 Crítico. "Frequência de acesso" usa o mesmo proxy dos alertas (check-in mais recente) — rotulado como tal na UI, não como rastreamento real de login.

### Mapa de Consistência

Agrupa check-ins pelo horário prescrito: Manhã (05h–12h), Tarde (12h–18h), Noite (18h–05h), calculando % de conclusão por período. Aponta explicitamente qual período tem mais falhas.

### Resumo Clínico

Dias perfeitos e maior sequência (reaproveitados); suplemento mais negligenciado (menor `taxaAdesao` entre os prescritos); melhor horário de adesão (período com maior % no Mapa de Consistência); período de maior consistência/dificuldade (melhor/pior janela de 7 dias corridos dentro do período carregado).

**Nenhum destes indicadores exige chamada de API nova** — todos derivam de `gerarDashboard`, já carregado (`frontend/src/utils/patientInsights.js`).

### Ações rápidas

WhatsApp e "Enviar lembrete" abrem `wa.me/<telefone>` (o segundo com uma mensagem pré-escrita via `?text=`) — decisão explícita para não inventar um sistema de notificação/SMS que não existe no backend. Editar paciente e Liberar edição reaproveitam `ManagePatientModal`/`ReleaseModal` já existentes, agora também presentes nesta página. Adicionar observação abre um `Sheet` com o formulário de `ClinicalNotes`.

### Aba Histórico Clínico — prontuário cronológico

Substitui a timeline simples anterior por `ChronologicalRecord.jsx`, que mescla por dia: check-ins, observações clínicas (os 5 tipos originais), liberações retroativas concedidas naquele dia, e marcação automática de "quebra de sequência" (um dia sem check-in logo após um período de adesão).

### Aba Intervenções

Reaproveita o mesmo backend de Observações Clínicas — **nenhuma tabela nova**. `CriarObservacaoClinicaUseCase.TIPOS_VALIDOS` ganhou 4 valores (`CONTATO`, `MUDANCA_PROTOCOLO`, `ORIENTACAO`, `FEEDBACK`); `ClinicalNotes.jsx` ganhou dois props opcionais (`tipoOptions` restringe o formulário, `filterTipos` filtra a lista) para renderizar como uma visão separada dos mesmos dados. Um registro criado na aba Intervenções não aparece em "Adicionar observação" (e vice-versa), porque cada instância filtra por um conjunto de tipos diferente.

### Backend — 2 mudanças mínimas adicionais

1. `CriarObservacaoClinicaUseCase`: 4 tipos novos na lista já existente (1 linha).
2. Nova action de leitura `listarPermissoesRetroativas` (`GoogleSheetsPermissaoRepository.findAllByPacienteId` + `ListarPermissoesRetroativasUseCase`) — expõe o histórico completo de liberações retroativas de um paciente; a aba `PermissoesRetroativas` já guardava isso, só não tinha uma rota de listagem. Sem mudança de schema.

Nenhuma action/payload/resposta existente foi alterada nesta rodada. `npm test`: 13/13.
