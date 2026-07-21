# REDESIGN_REPORT.md

Segunda reconstrução completa do front-end nesta branch (`redesign/frontend-v2`) — identidade visual **"Ritual"**. A reconstrução anterior (bento-grid, Outfit, modais centrados) foi descartada por completo a pedido do usuário; nada foi reaproveitado de layout, componente, tipografia, navegação ou animação. Ver `DESIGN_SYSTEM.md`, `COMPONENT_LIBRARY.md`, `UX_DECISIONS.md`, `TEST_REPORT.md` e `E2E_AUDIT_REPORT.md` para os detalhes de cada frente.

## Antes (reconstrução anterior) → Depois ("Ritual")

| | Antes | Depois |
|---|---|---|
| Tipografia | Outfit (única fonte) | Fraunces (display/serifada) + Inter (UI) |
| Layout do "hoje" | Bento-grid de cards | Linha do tempo vertical com trilho conector |
| Progresso | Barra linear com gradiente | Anel de progresso circular (estilo Apple Activity) |
| Navegação desktop | Sidebar com texto e fundo sólido | Rail fino, só ícones |
| Navegação mobile | Bottom-nav de borda a borda | Pill flutuante |
| Modais | Centralizados, glassmorphism leve | Bottom sheets (sobem do rodapé) |
| Calendário | Grade de círculos simples | Heatmap (semana e mês) |
| Check-in em lote | Não existia | **Novo**: "Concluir todos os suplementos de hoje", com confirmação e registro sequencial via `registrarCheckin` (sem endpoint novo) |
| Gerenciar suplementos de paciente existente | Não existia | **Novo**: seção dentro do modal de gerenciar paciente (`ManageSupplements`), usando as 3 novas actions aditivas de backend |

## O que preservado (contrato)

- `frontend/src/api/apiClient.js` e `systemConfiguration.js` — intocados, mesmo contrato de transporte.
- Todas as 8 actions originais do backend — payload e resposta idênticos.
- `HashRouter` e as mesmas 5 rotas.
- Backend inteiro (`backend/`), exceto pelo trabalho aditivo já documentado em `ARCHITECTURE_NOTES.md` (endpoints `cancelarCheckin` e `adicionarSuplemento`/`editarSuplemento`/`removerSuplemento` — todos aditivos, nenhum contrato existente alterado).

## Arquivos alterados nesta reconstrução visual

Todo `frontend/src/styles`, `frontend/src/components` (exceto `PatientTable.jsx`/`ManagePatientModal.jsx`/`RegisterPatientWizard.jsx`/`ReleaseModal.jsx`, restilizados em vez de recriados do zero por já terem a responsabilidade correta), todo `frontend/src/pages`, `frontend/index.html` (fontes). Nenhum arquivo de `backend/` foi alterado nesta etapa (a mudança de backend para suplementos foi um trabalho aditivo separado, já commitado antes desta reconstrução visual começar — ver `ARCHITECTURE_NOTES.md`).

## Testes e validação

Ver `TEST_REPORT.md` (automatizados: backend 10/10, build limpo) e `E2E_AUDIT_REPORT.md` (checklist funcional item a item, com o que foi de fato exercido via clique vs. o que depende de cobertura indireta).

## Checklist final

- ✅ Backend preservado
- ✅ API preservada (8 actions originais inalteradas + 4 aditivas já aprovadas: `cancelarCheckin`, `adicionarSuplemento`, `editarSuplemento`, `removerSuplemento`)
- ✅ Google Apps Script preservado
- ✅ Google Sheets preservado
- ✅ Login funcionando
- ✅ Responsividade completa (320–1920px, breakpoints 768/1024 herdados e re-confirmados nos extremos)
- ✅ UI premium implementada — identidade "Ritual" completamente nova
- ✅ Temas Melasma e Desinflamação funcionando
- ⚠️ Deploy do backend de suplementos (`adicionarSuplemento`/`editarSuplemento`/`removerSuplemento`) ainda não publicado via `clasp` — aguardando decisão do usuário, mesma cautela já aplicada ao `cancelarCheckin`
