# BOTTOM_SHEETS_REPORT.md — Gesture global de swipe-down

## Estado anterior

`Sheet.jsx` (construído numa sprint anterior) já tinha drag-to-dismiss, mas restrito à barrinha (`.sheet-grabber`): `dragListener={false}` + `onPointerDown` só nesse elemento. Isso foi uma decisão deliberada, não um esquecimento — `.sheet` é ao mesmo tempo o alvo do drag E o único container com `overflow-y: auto` (nenhum consumidor tem um wrapper de scroll interno separado), então ligar o drag em qualquer ponto sem cuidado quebraria o scroll nativo do conteúdo.

## O que mudou

Único componente alterado: `frontend/src/components/Sheet.jsx` — herdado automaticamente por todos os 8 consumidores (Novo Paciente, Editar Paciente, Retroativo, Histórico/Observações, Suplementos, confirmações), sem nenhuma mudança por-consumidor, exatamente como o mecanismo original foi desenhado para propagar.

Estratégia:
- `onPointerDown` no elemento `.sheet` inteiro: se `scrollTop <= 0` no momento do toque **e** o alvo não é um elemento interativo (`button, a, input, textarea, select, [role="button"], [contenteditable]`), inicia o drag imediatamente — funciona a partir de qualquer espaço vazio ou sobre o conteúdo, não só na barra.
- Se `scrollTop > 0`, não inicia o drag — o scroll nativo segue intocado.
- `onPointerMove`: enquanto o ponteiro está pressionado e o drag ainda não começou, monitora `scrollTop`; assim que a lista chega ao topo e o movimento continua para baixo, o mesmo gesto contínuo assume o fechamento, sem precisar soltar o dedo.
- **Só touch/pen** — um clique-e-arrasta de mouse sobre o conteúdo é seleção de texto normal, não um gesto de fechar; só a barrinha continua aceitando mouse (não tem nada para selecionar).
- A barrinha manteve seu próprio handler incondicional — sempre elegível, independente da posição de scroll do conteúdo abaixo dela.

## Verificação

**Confirmado ao vivo** (via `PointerEvent` sintético `pointerType: 'touch'`):
- Iniciar o gesto sobre o título (elemento não-interativo) do `ManagePatientModal` moveu visivelmente o painel (`transform: matrix(0.97992, 0, 0, 0.97992, 0, 300)` durante o arraste) — prova que o gesto começa em qualquer lugar do conteúdo, não só na barra.
- Iniciar o mesmo gesto sobre o botão "Cancelar" **não** iniciou nenhum arraste (`transform` permaneceu `none` durante todo o movimento sintético) — prova que o gate de elementos interativos funciona e nenhum toque em botão é sequestrado pelo reconhecimento de gesto.

**Limitação conhecida, já documentada na sprint anterior para este mesmo componente**: este navegador headless de sandbox nunca reporta foco/visibilidade reais de aba, o que já havia sido comprovado (via isolamento com `git stash`) suprimir animações via `requestAnimationFrame` e afetar o reconhecimento de gestos sintéticos de ponteiro. Neste teste, o INÍCIO do gesto (a capacidade nova desta sprint) foi comprovado com sucesso; a conclusão do gesto até ultrapassar o limiar de fechamento (`handleDragEnd`, lógica **não alterada** nesta sprint, idêntica à já usada pela barrinha) não pôde ser confirmada de ponta a ponta neste ambiente pela mesma razão já conhecida — recomenda-se um teste manual rápido em dispositivo real antes do deploy, como já recomendado para o gesture da barrinha na sprint anterior.

## Nenhuma regra de negócio alterada
ESC, clique no backdrop e o botão "Cancelar"/"Fechar" de cada consumidor continuam chamando exatamente o mesmo `onClose` de sempre — o novo ponto de entrada do gesto não introduz nenhum caminho de fechamento diferente, apenas mais formas de acionar o mesmo já existente.
