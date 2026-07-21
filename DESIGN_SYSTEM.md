# DESIGN_SYSTEM.md — "Ritual"

Segunda reconstrução completa do front-end (branch `redesign/frontend-v2`). O sistema anterior ("Luxo Silencioso" — bento-grid, Outfit, modais centrados) foi **descartado por completo**; nada foi reaproveitado. Este documento descreve o sistema novo.

## Conceito

**Ritual** — o tratamento diário como um pequeno ritual de autocuidado, não uma lista de tarefas. Referências: boutique editorial, Apple Health (anel de progresso), apps nativos de bem-estar (bottom sheets, navegação mínima).

## Tipografia

- **Display** (`--font-display`): `Fraunces` — serifada editorial, peso 340 (`--weight-display`), usada em todo título e número grande (nome do paciente, "Hoje", %, "Bem-vinda de volta").
- **Corpo/UI** (`--font-body`): `Inter` — usada em labels, botões, texto de apoio.
- Escala: `--text-xs` (12px) a `--text-lg` (19px) para UI; `--display-sm/md/lg` (28/40/56px) para títulos.
- `.eyebrow`: rótulo pequeno, maiúsculo, tracking largo — usado como "kicker" acima de títulos (ex: "BOA NOITE", "ACOMPANHAMENTO CLÍNICO INTEGRATIVO").

## Cor — arquitetura em 3 camadas

1. **Primitivos** (`--p-*`): hex por protocolo, do briefing original, nunca consumidos direto.
2. **Papel** (`--surface`, `--ink`, `--accent`, `--line`, `--success`, `--danger`, `--warning`...): o que a cor significa.
3. **Protocolo**: `:root` (Institucional — login/admin), `body.protocol-melasma`, `body.protocol-desinflamacao`.

| Protocolo | Accent | Accent secundário | Surface | Ink |
|---|---|---|---|---|
| Melasma | `#7A3A10` | `#A35C2E` | `#F8F2EE` | `#3D2415` |
| Desinflamação | `#5D7A58` | `#7F9B79` | `#F4F8F3` | `#2F4730` |
| Institucional | `#4A443C` | `#6E655A` | `#F6F5F2` | `#262320` |

Trocar de protocolo = trocar uma classe no `<body>` (`useTheme().setThemeClass(...)`, ver `context/ThemeContext.jsx`) — nenhum componente muda.

## Espaço, forma, sombra

- Espaço: grade de 8px (`--space-1` a `--space-9`, 4px–72px).
- Forma: `--radius-sm` 10px, `--radius-md` 14px, `--radius-lg` 26px (cards grandes, sheets), `--radius-pill` para tudo circular/pílula.
- Sombra: **única e suave** por elevação — `--shadow-card` (cards), `--shadow-sheet` (bottom sheets), `--shadow-rail` (navegação) — nada de camadas múltiplas ou glassmorphism.

## Motion

Assinatura "settle": `--ease-glide` (saída suave) e `--ease-settle` (uma leve sobreposição elástica, usada quando algo "assenta no lugar" — sheets, anel de progresso). Durações: 140/240/420ms.

## Navegação

- **Desktop (≥1024px)**: `.rail` — trilho fino de 76px, só ícones, item ativo vira um botão preenchido com a cor do protocolo.
- **Mobile (<1024px)**: `.pill-nav` — pílula flutuante fixa no rodapé, com ícone+label, item ativo preenchido.
- Nunca sidebar de texto nem bottom-nav de borda a borda (identidade anterior).

## Padrões de interação

- **Bottom sheet** (`components/Sheet.jsx`) substitui todo modal centralizado — sobe do rodapé em qualquer largura, com um "grabber" visual no mobile.
- **Anel de progresso** (`components/ProgressRing.jsx`) substitui a barra linear — SVG animado, % no centro em serifada, streak abaixo.
- **Linha do tempo** (`.timeline`) substitui o bento-grid do dia — um trilho vertical conectando as doses, ponto preenchido quando concluída.
- **Heatmap** (`components/HeatmapStrip.jsx`, `HeatmapMonth.jsx`) substitui a tira de calendário antiga e a grade de mês — células coloridas por adesão.

Ver `COMPONENT_LIBRARY.md` para a lista completa de componentes e `UX_DECISIONS.md` para o raciocínio por trás de cada escolha.
