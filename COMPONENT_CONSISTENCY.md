# COMPONENT_CONSISTENCY.md — Sprint Final

## Botões

`.btn-danger` (preenchido, vermelho sólido) já existia e é usado corretamente em `ConfirmContext.jsx` como a ação primária **dentro de um diálogo de confirmação** dedicado. `ManagePatientModal.jsx`'s botão "Excluir conta" reinventava uma cor de perigo via `.btn-ghost` + `style={{color:'var(--danger)'}}` inline, sem estado de hover.

**Decisão tomada, diferente do que o plano original previa**: não troquei para `.btn-danger` puro e simples. Esse botão fica no rodapé de um formulário de edição, ao lado de "Salvar" (a ação primária real da tela) — torná-lo um botão vermelho **preenchido** faria ele competir visualmente com "Salvar" pela atenção, quando na verdade é uma ação secundária/tucked-away que só abre o diálogo de confirmação real (onde `.btn-danger` preenchido já aparece corretamente). Em vez disso criei `.btn-ghost-danger` (mesmo formato ghost, cor de texto `--danger`, **com hover em `--danger-wash` que não existia antes**) — resolve a duplicação de estilo inline sem quebrar a hierarquia visual da tela. `.btn-danger` continua reservado para ações primárias de confirmação, `.btn-ghost-danger` para gatilhos secundários — dois papéis diferentes, duas classes diferentes, ambos agora nomeados em vez de inline.

## Linhas de lista

Duas famílias já existiam separadamente: `.roster-row` (linha clicável de página inteira, ex: lista de pacientes) e um padrão inline repetido em 2 lugares (`ManageSupplements.jsx`, `RegisterPatientWizard.jsx`) para linhas **não-clicáveis** dentro de um Sheet já com seu próprio padding. Como o padding de `.roster-row` (`--space-4 --space-5`) é pensado para um card de largura cheia sem padding próprio, reaplicá-lo dentro de um Sheet já padded teria dobrado o espaçamento — não era, de fato, o mesmo caso de uso. Criada `.list-row` (mesma anatomia visual — nome/meta à esquerda, ações à direita — mas com o padding menor correto para um container já padded, sem `cursor:pointer` porque não há clique na linha). 2 implementações inline → 1 classe.

## Badges de risco

Ver `DESIGN_SYSTEM_AUDIT.md` — `RiskCard.jsx` migrado de 5 cores inline para 3 variantes de `.risk-badge` reaproveitando os mesmos tokens wash/ink de `.chip-*`.

## `StatChip` — bug real encontrado

`{ ink, success, danger }` era o mapa completo de cores — um `tone="warning"` (nunca de fato usado em produção, mas exposto pela API do componente) resultava em `color: undefined`, silenciosamente renderizando com a cor herdada do pai em vez de âmbar. Corrigido junto com a remoção do `style={{flex:1}}` (agora redundante, o componente vive dentro de `.metric-grid`).

## Texto de ênfase — 9 ocorrências unificadas em 2 classes

Nove lugares diferentes escreviam `style={{color:'var(--ink)'}}` inline para destacar um trecho de texto que por padrão herdaria `--ink-soft` (de `.body-sm`/`.body-md`) ou a cor do pai (`<strong>` solto): `ClinicalNotes.jsx`, `AlertsPanel.jsx`, `ConsistencyMap.jsx`, `ChronologicalRecord.jsx` (×2), `ProtocolPendingScreen.jsx`, e `PatientDashboardPage.jsx` (×3, essas com `fontWeight` extra também repetido). Duas classes novas cobrem os dois casos reais: `.text-ink` (utilitário genérico, "esse elemento é `--ink` em vez de herdado") e `.body-md-strong` (o caso específico e 3× repetido de `.body-md` + `--ink` + peso médio, usado nas 3 linhas de info do dashboard do paciente). Nenhum dos dois muda a aparência final — só elimina a duplicação.

## Acessibilidade — operabilidade por teclado

`PatientTable.jsx` (linha de paciente) e `ChronologicalRecord.jsx` (linha de dia) eram `<div onClick>` sem `tabIndex`/`role`/`onKeyDown` — inoperáveis por teclado. Ambas ganharam `role="button" tabIndex={0}` + handler de `Enter`/`Espaço`. **Ressalva honesta sobre `PatientTable.jsx`**: essa linha contém 2 botões próprios (Histórico, Liberar retroativo) aninhados dentro do `role="button"` — tecnicamente não é o padrão ARIA mais puro (um elemento com `role="button"` "idealmente" não deveria conter outro conteúdo interativo), mas é um padrão pragmático amplamente usado em produção (linhas de tabela com ação primária + ações secundárias) e é estritamente melhor do que o estado anterior, que não tinha nenhuma operabilidade por teclado. `ChronologicalRecord.jsx`'s linha não tem esse problema (sem elementos aninhados focáveis).

Confirmado ao vivo com uma tecla Tab real (não `.focus()` via script, que não necessariamente aciona `:focus-visible`): o anel de foco aparece corretamente e `Enter` aciona a mesma ação do clique.
