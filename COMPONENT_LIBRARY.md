# COMPONENT_LIBRARY.md

Inventário dos componentes do front-end reconstruído (`frontend/src/components`). Todos consomem apenas tokens semânticos de `styles/tokens.css`.

| Componente | Arquivo | Responsabilidade | Substitui (identidade anterior) |
|---|---|---|---|
| `AppCanvas` | `AppCanvas.jsx` | Shell de navegação: rail (desktop) + topbar/pill-nav (mobile) + área de conteúdo | `AppShell`, `Sidebar`, `MobileTopBar`, `BottomNav` |
| `Sheet` | `Sheet.jsx` | Bottom sheet genérico (portal, Framer Motion, fecha com Esc/backdrop) | `Modal` |
| `ProgressRing` | `ProgressRing.jsx` | Anel de progresso SVG animado (adesão % + streak) | `HeroStatCard` |
| `DoseTimelineItem` | `DoseTimelineItem.jsx` | Item de dose na linha do tempo (check-in individual, undo, háptica/áudio) | `SupplementCard` |
| `HeatmapStrip` | `HeatmapStrip.jsx` | Tira semanal de adesão | `WeekStrip` |
| `HeatmapMonth` | `HeatmapMonth.jsx` | Grade mensal de adesão (Calendário) | grade inline do `CalendarPage` anterior |
| `StatChip` | `StatChip.jsx` | Card de métrica do admin | `StatCard` |
| `PatientTable` | `PatientTable.jsx` | Lista de pacientes (linhas, não mais `<table>`) | `PatientTable` (restilizado) |
| `RegisterPatientWizard` | `RegisterPatientWizard.jsx` | Wizard de 5 etapas para novo paciente, em bottom sheet | idem (restilizado + usa `SupplementFields`) |
| `ManagePatientModal` | `ManagePatientModal.jsx` | Editar/excluir paciente + seção de suplementos | idem (restilizado, ganhou `ManageSupplements`) |
| `ManageSupplements` | `ManageSupplements.jsx` | **Novo** — listar/adicionar/editar/remover suplementos de um paciente já cadastrado | não existia |
| `SupplementFields` | `SupplementFields.jsx` | Formulário controlado de suplemento (compartilhado entre wizard e gerenciamento) + helpers de parse/validação | duplicado inline no wizard antigo |
| `ReleaseModal` | `ReleaseModal.jsx` | Liberação de edição retroativa, em bottom sheet | idem (restilizado) |

## Contextos (`frontend/src/context`)

| Contexto | Uso |
|---|---|
| `AuthContext` | Sessão (token/role/userId/nome/protocolo), espelha `sessionStorage` |
| `ThemeContext` | Classe de protocolo aplicada ao `<body>`; `protocolToThemeClass()` |
| `ToastContext` | Notificações não-bloqueantes com ação opcional (substitui `alert()`) |
| `ConfirmContext` | Diálogo de confirmação assíncrono (`await confirm({...})`, substitui `confirm()`) |

## Camada de dados (inalterada nesta reconstrução visual)

`api/apiClient.js`, `api/systemConfiguration.js`, `hooks/useDashboardData.js` — não são "camada visual", preservados intactos como contrato com o backend.
