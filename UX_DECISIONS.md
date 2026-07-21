# UX_DECISIONS.md

Por que cada decisão da reconstrução "Ritual" melhora a experiência do paciente, ponto a ponto.

**Anel de progresso em vez de barra linear com gradiente.**
Uma barra "enche" — remete a uma barra de carregamento de sistema. Um anel remete a algo que se "completa" (Apple Activity, relógios). O número no centro, em serifada, vira o protagonista visual em vez de dividir atenção com o resto do card. Reforça a sensação de "meta do dia", não "progresso de tarefa".

**Linha do tempo vertical em vez de grid de cards.**
O bento-grid tratava cada suplemento como um bloco isolado, sem noção de sequência no tempo. Uma linha do tempo com um trilho conectando os pontos comunica visualmente "o dia é uma jornada com etapas", o que é exatamente o modelo mental que se quer reforçar (ritual, não checklist).

**Rail de ícones (desktop) + pill-nav flutuante (mobile) em vez de sidebar com texto / bottom-nav de borda a borda.**
Uma sidebar cheia de texto e fundo sólido ocupa espaço permanente e compete visualmente com o conteúdo. Um rail fino, só ícones, reduz a "carga administrativa" da tela — o app deixa de parecer um painel de sistema. No mobile, uma pill flutuante (em vez de uma barra fixa de ponta a ponta) reforça a sensação de "elemento nativo sobreposto", como em apps iOS modernos, em vez de "barra de navegação de site".

**Bottom sheet em vez de modal centralizado.**
Modais centralizados são um padrão de desktop/formulário corporativo. Bottom sheets são o padrão nativo de app mobile (e cada vez mais comum em desktop premium) — comunicam "uma camada temporária que sobe para você agir e depois desce", reforçando fluidez em vez de interrupção. Também funciona melhor em telas pequenas (usa a largura toda, não precisa "encolher" um formulário).

**Fraunces (serifada) para títulos e números, Inter para o resto.**
Uma serifada editorial em pesos leves comunica "clínica boutique, cuidado, atenção ao detalhe" — o oposto de uma fonte geométrica única (Outfit, usada antes em tudo), que é neutra mas genérica, comum a qualquer produto de produtividade. Reservar a serifada para títulos/números e manter Inter no resto evita exagero (a serifada em textos longos cansaria a leitura).

**Botão "Concluir todos os suplementos de hoje" com confirmação explícita.**
Sem confirmação, um toque acidental marcaria várias doses de uma vez — um erro caro de desfazer (mesmo com o `cancelarCheckin` aditivo, desfazer 5 doses uma a uma é fricção). A confirmação em bottom sheet, com a pergunta explícita, dá ao paciente um momento consciente de "sim, eu realmente tomei tudo", que é também psicologicamente mais alinhado com o conceito de ritual/disciplina do que um clique casual.

**Heatmap em vez de círculos individuais de status.**
Um heatmap (cor sólida por densidade de adesão) permite ler o padrão de um mês inteiro num relance — reforça "constância" como conceito central da gamificação madura pedida (sem estrelinhas, sem infantilização), na linha de hábitos e disciplina em vez de pontuação de jogo.

**Gerenciar suplementos dentro do modal do paciente (não uma tela separada).**
Editar/adicionar/remover suplemento é uma ação de manutenção pontual, não um destino de navegação — mantê-la como uma seção expansível dentro do fluxo "gerenciar paciente" evita fragmentar a navegação do admin em mais uma tela para uma tarefa secundária.
