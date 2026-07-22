# PATIENT_UX_REPORT.md — Sprint UX Premium

Sumário executivo da sprint. Detalhes específicos de cada frente em seu próprio relatório (`OPTIMISTIC_UI_REPORT.md`, `CALENDAR_UX_REPORT.md`, `MOTIVATION_SYSTEM.md`, `RESPONSIVE_PATIENT_REPORT.md`, `PERFORMANCE_PATIENT.md`, `E2E_PATIENT_REPORT.md`).

## Parte 1 — Pop-up de vazamento de senha

**Investigado, não é um bug do app.** `frontend/src/pages/LoginPage.jsx` já segue as boas práticas antes mesmo desta sprint:
```html
<input id="email" type="email" autoComplete="email" .../>
<input id="password" type="password" autoComplete="current-password" .../>
```
Um único campo de senha, sem reaproveitamento de valores, `autoComplete` correto para um formulário de login (não é cadastro, então `current-password` é o valor certo — `new-password` só se aplicaria a um formulário de criação/troca de senha, que não existe nesta tela).

O aviso "esta senha apareceu em um vazamento de dados" é gerado inteiramente pelo **Gerenciador de Senhas do Google/Chrome** (Password Checkup), que roda no navegador contra uma base própria do Google — não existe atributo HTML, header HTTP ou API JS que uma página possa usar para desativar essa verificação a partir de dentro do site. É uma configuração do usuário em `chrome://settings/passwords` → "Verificação de Senhas". Não há nada a corrigir no código; documentado aqui para fechar a investigação.

## Parte 2 — Check-in instantâneo

Ver `OPTIMISTIC_UI_REPORT.md`. Resumo: o check-in agora atualiza a interface (card, anel de progresso, "Sua semana", contadores) no instante do clique, antes de qualquer resposta de rede — a chamada ao backend roda em paralelo e só reconcilia ou reverte o estado depois.

## Parte 3 — Remover o som

`frontend/src/components/DoseTimelineItem.jsx` tinha uma função `playChime()` (Web Audio API, oscilador sintetizado tocando um "ding") disparada em todo clique de check-in. Removida por completo — nenhum áudio é reproduzido em lugar nenhum do app agora (confirmado por busca em toda a árvore `frontend/src` por `Audio(`/`playChime`/`.mp3`/`.wav`: zero ocorrências restantes). O feedback tátil (`navigator.vibrate`) foi mantido — vibração não é som. Em seu lugar, o botão de check ganhou uma animação de mola (scale 0.6→1.15→1, Framer Motion) ao concluir, e `scale: 0.85` no toque.

## Parte 4 — Bloqueio por data do protocolo

Novo componente `frontend/src/components/ProtocolPendingScreen.jsx`, ativado em `frontend/src/pages/PatientLayout.jsx` sempre que `session.dataInicio` estiver no futuro. Enquanto ativo, **nenhuma sub-rota do paciente chega a montar** — `Hoje`/`Histórico`/`Calendário` nunca disparam fetch, o usuário nunca vê suplementação, check-in, calendário ou histórico. Contagem regressiva em dias (ou horas, se faltar menos de 1 dia) atualizada a cada minuto. Liberação é automática — no minuto em que a data vira, o próprio cálculo de data libera o conteúdo no próximo tick, sem exigir refresh. Testado ao vivo com um paciente cujo `dataInicio` estava 3-5 dias no futuro: tela exibida corretamente, incluindo em navegação direta para `/paciente/calendario` (o bloqueio não pode ser contornado por URL).

## Parte 5 — Calendário premium

Ver `CALENDAR_UX_REPORT.md`.

## Parte 6 — Motivação e psicologia

Ver `MOTIVATION_SYSTEM.md`.

## Parte 7 — Dashboard mais motivador

`frontend/src/pages/PatientDashboardPage.jsx` ganhou uma linha de informações logo abaixo da saudação: "Hoje faltam N suplementos", "Próximo horário HH:MM" (só aparece se houver algo pendente) e "Dias restantes" (novo util compartilhado `frontend/src/utils/treatmentInfo.js`, também usado pelo calendário — elimina duplicação de lógica de data entre as duas telas). O anel de progresso e a sequência de dias já existiam e foram mantidos.

## Parte 8 — Microinterações

Passe de refinamento pontual, sem biblioteca nova (Framer Motion já era dependência): animação de mola no botão de check, hover com sombra nos cards de suplemento pendente (`@media (hover: hover)`, não afeta touch), hover/active mais expressivo nas células do calendário (`scale(1.1)`/`scale(0.94)`). Botões (`.btn`), navegação (`.rail-link`/`.pill-nav-item`) e o `Sheet` de detalhe já tinham transições consistentes de sprints anteriores — confirmado que continuam corretas, não duplicadas.

## Parte 9 — Navbar desktop fixa

**Causa raiz confirmada e corrigida.** `.rail` (a barra lateral de ícones do desktop) nunca teve `position: sticky`/`fixed` — era um item flex comum, então rolava junto com o conteúdo da página. Adicionado `position: sticky; top: 0; height: 100dvh;` dentro do breakpoint `@media (min-width: 1024px)`. Verificado ao vivo em 1440px: `getComputedStyle(.rail).position === 'sticky'`, e a barra permanece em `top: 0` mesmo depois de rolar 1000px de conteúdo.

## Parte 10-12

Ver `RESPONSIVE_PATIENT_REPORT.md`, `PERFORMANCE_PATIENT.md`, `E2E_PATIENT_REPORT.md`.

## Escopo

Nenhuma mudança de backend foi necessária nesta sprint — `session.dataInicio`/`dataFim` já estavam disponíveis desde a sprint anterior, e todo o resto é comportamento/visual puro do frontend. `npm run build` limpo, sem erros.
