# DESIGN_SYSTEM.md

Sistema de design do front-end reconstruído (`frontend/`). A base de tokens já existia parcialmente no projeto anterior ("Luxo Silencioso") — este documento descreve o que foi mantido, completado e como consumi-lo em componentes React novos.

## Arquitetura de tokens (`src/styles/tokens.css`)

Três camadas, nessa ordem de dependência:

1. **Primitivos** (`--raw-melasma-*`, `--raw-desinf-*`, `--raw-inst-*`) — hex cru do briefing. Nunca usar direto em componentes.
2. **Semânticos** (`--color-surface-base`, `--color-text-primary`, `--color-brand-primary`, `--color-danger`, `--color-shadow-tint`, etc.) — o que os componentes devem consumir.
3. **Temas** — `:root` (Institucional), `body.theme-melasma`, `body.theme-desinflamacao`. Cada um redefine os mesmos nomes semânticos. Trocar de tema = trocar a classe do `<body>`, zero mudança em componente.

A camada de aliases legados ("Seção 12: COMPATIBILIDADE") do `tokens.css` original foi **removida** nesta reconstrução — como todos os componentes são novos, não havia mais nenhum consumidor dos nomes antigos (`--shadow-sm`, `--radius-full`, `--transition-bounce`, etc.). Qualquer PR futuro deve usar diretamente os nomes semânticos atuais.

## Como trocar de tema

`src/context/ThemeContext.jsx` expõe `useTheme()` → `{ themeClass, setThemeClass }`. `setThemeClass(className)` aplica a classe direto no `document.body`. `protocolToThemeClass(protocoloNome)` (mesmo arquivo) normaliza o nome do protocolo vindo do backend (`"Melasma"`, `"Desinflamação"`) para a classe CSS correta. Cada layout de página (`PatientLayout.jsx`, `AdminDashboardPage.jsx`, `LoginPage.jsx`) chama isso uma vez no mount.

## Paletas

| Protocolo | Primária | Secundária | Fundo | Card | Texto |
|---|---|---|---|---|---|
| Melasma | `#7A3A10` | `#A35C2E` | `#F8F2EE` | `#FFFDFB` | `#3D2415` |
| Desinflamação | `#5D7A58` | `#7F9B79` | `#F4F8F3` | `#FFFFFF` | `#2F4730` |
| Institucional (login/admin) | `#4A443C` | `#6E655A` | `#F5F4F1` | `#FFFFFF` | `#2A2622` |

## Espaçamento, tipografia, motion

- Espaçamento: escala de 8px (`--space-1` = 4px até `--space-12` = 96px).
- Tipografia: `Outfit` via Google Fonts, escala `--text-xs` (12px) a `--text-5xl` (48px).
- Motion: `--duration-fast/normal/slow` (150/200/250ms) + `--ease-standard/decel/spring`. Tudo respeita `prefers-reduced-motion`.

## Componentes (`src/components/`)

| Componente | Uso |
|---|---|
| `AppShell` | Layout com sidebar (desktop) + topbar/bottom-nav (mobile). Usado por paciente e admin. |
| `Sidebar`, `MobileTopBar`, `BottomNav` | Navegação responsiva — trocam automaticamente pelo breakpoint (1024px), não por JS. |
| `Modal` | Modal genérico (Framer Motion, portal, fecha com Esc/clique fora). Base de todos os diálogos. |
| `ToastContext` / `useToast()` | Substitui `alert()`. Toast com ação opcional (ex: "Desfazer"). |
| `ConfirmContext` / `useConfirm()` | Substitui `confirm()`. Retorna uma Promise&lt;boolean&gt;. |
| `StatCard`, `HeroStatCard` | Cards de métrica (admin) e o hero de adesão/streak (paciente). |
| `SupplementCard` | Card de dose — estado pendente/concluído, feedback tátil (`navigator.vibrate`) e sonoro. |
| `WeekStrip` | Tira de 7 dias do dashboard do paciente. |
| `PatientTable` | Tabela de pacientes do admin. |
| `RegisterPatientWizard` | Wizard de 5 etapas para criar paciente (decompõe o antigo monólito de ~390 linhas). |
| `ManagePatientModal`, `ReleaseModal` | Editar/excluir paciente; liberar edição retroativa. |

## Regra de ouro

Componentes só consomem tokens semânticos (`var(--color-*)`, `var(--space-*)`, etc.), nunca hex cru nem os tokens `--raw-*`. Um novo protocolo/tema é um bloco novo em `tokens.css` — nenhum componente precisa mudar.
