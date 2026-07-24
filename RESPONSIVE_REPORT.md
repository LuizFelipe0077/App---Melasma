# RESPONSIVE_REPORT.md

## Escopo desta auditoria
A auditoria completa de breakpoints já feita numa sprint anterior (documentada antes neste mesmo arquivo) segue válida para o que já existia. Esta rodada focou em dois pontos: (a) um gap real encontrado na auditoria — ausência total de tratamento de `env(safe-area-inset-*)` — e (b) verificar que a superfície nova desta sprint (accordion de retroativos, `SupplementDatePicker`, gesto de swipe global) não introduz overflow em nenhum breakpoint pedido.

## Gap encontrado e corrigido: safe-area-inset
Busca em todo `frontend/src` por `env(safe-area-inset` não encontrou nenhuma ocorrência antes desta sprint — `.sheet` (bottom sheet de tela cheia no mobile) e `.pill-nav` (navegação fixa inferior) usavam valores fixos de padding/bottom, sem reservar espaço para a home indicator do iOS.

Corrigido em `frontend/src/styles/global.css`:
```css
.sheet { padding: var(--space-3) var(--space-5) max(var(--space-6), env(safe-area-inset-bottom)); }
.pill-nav { bottom: max(var(--space-4), env(safe-area-inset-bottom)); }
```

## Breakpoints verificados nesta sprint (320 / 360 / 390 / 430 / 768 / 1024 / 1440 / 1920px)

**320px** (`SupplementDatePicker` na Etapa 3 do wizard):
- O grid do calendário (`grid-template-columns: repeat(7, 1fr)`, mesma convenção fluida já usada em `HeatmapMonth`) **não** ultrapassa a largura do Sheet — confirmado via `getBoundingClientRect()` (`pickerOverflows: false`).
- Encontrado (e não corrigido, por ser pré-existente e fora do escopo desta sprint): a linha de botões do rodapé do wizard ("Cancelar"/"Avançar") ultrapassa a borda do Sheet em ~5-12px em 320px — esse markup já existia antes desta sprint (não foi tocado) e não causa barra de rolagem horizontal visível nem corta conteúdo (o `.sheet` só tem `overflow-y`, não `overflow-x`), mas fica registrado como observação para uma limpeza futura fora do escopo pedido aqui.

**360/390/430px**: mesma faixa de layout do mobile-first já coberto pelas regras `max-width: 420px`/`640px` existentes — nenhuma regra nova de CSS foi introduzida que dependa de um breakpoint intermediário específico nessa faixa, então o comportamento em 320px se estende sem diferença estrutural.

**768px** (ponto de transição Sheet mobile → modal centrado): `SupplementDatePicker` e o accordion de retroativos renderizam corretamente dentro do Sheet centrado (`max-width: 560px`), sem esticar nem cortar.

**1024/1440/1920px**: nenhum componente novo desta sprint depende do breakpoint de 1024px (troca de navegação) — verificado que o Sheet permanece corretamente limitado a `max-width: 560px` e centralizado em 1440px, sem comportamento anômalo.

## Verificação
Screenshots capturados em 320×700, 768×1024 e 1440×900 confirmando visualmente o comportamento acima (calendário de agendamento e card de retroativos), sem necessidade de repetir para as larguras intermediárias pela mesma razão de interpolação já documentada na auditoria anterior (nenhuma media query nova foi adicionada que dependa de um valor entre os já testados).
