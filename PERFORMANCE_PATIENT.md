# PERFORMANCE_PATIENT.md — Parte 11

## Bundle

```
npm run build (frontend, após todas as mudanças desta sprint)
dist/index.html                 2.22 kB
dist/assets/index-*.css        22.62 kB  (era 22.13 kB antes da sprint)
dist/assets/index-*.js        367.46 kB  (era 361.32 kB antes da sprint)
```
Crescimento de ~6KB no JS e ~0.5KB no CSS — proporcional ao que foi adicionado (2 componentes novos, 2 utils novos, lógica de optimistic update) e sem nenhuma dependência nova (Framer Motion já era usado em todo o app).

## Re-renders

- **`DoseTimelineItem`** envolvido em `React.memo`. Como `PatientDashboardPage` já memoiza `slots` via `useMemo([dashboard])`, quando o `dashboard` não muda de identidade (ex: abrir/fechar o Sheet de "Concluir todos", que é estado local não relacionado), os objetos `suplemento`/`checkin` de cada item permanecem referencialmente estáveis entre renders — `React.memo` evita o re-render desses cards nesse cenário. **Ressalva honesta**: quando o próprio `dashboard` muda (ex: um check-in em qualquer suplemento), `buildTodaySlots` reconstrói o array inteiro com objetos novos, então todos os cards re-renderizam de qualquer forma — isso é esperado e correto (o `ProgressRing`/`HeatmapStrip` também precisam atualizar nesse momento), não é um problema de performance real dado o tamanho típico da lista (poucos suplementos por dia).
- **`ProgressRing`/`HeatmapStrip`**: recebem só valores primitivos (`rate`, `streak` — números), não objetos/arrays literais inline — não perdem memoização por identidade de props a cada render do pai. Confirmado que o novo `mutate()` não introduziu nenhuma prop de objeto novo recriada a cada render nesses dois componentes.
- **`useDashboardData.mutate`**: usa `useCallback` com array de dependências vazio — identidade estável entre renders, não invalida memoizações downstream que dependem dela.
- **`CalendarPage`**: `treatmentInfo`/`days` continuam em `useMemo` com as dependências corretas, sem mudança de comportamento nesta sprint além de reusar `buildTreatmentInfo`.

## Optimistic UI e custo de rede

Antes: cada check-in disparava `registrarCheckin` + um `gerarDashboard` completo via `reload()` — 2 requisições. Agora: só `registrarCheckin` — a reconciliação usa os campos que a própria resposta já traz (`status`, `streak`, `xpTotal`), sem requisição extra. Isso reduz o tráfego de rede por check-in pela metade, além de eliminar o flash de loading que o `reload()` causava.

## Limitação honesta

Lighthouse/Web Vitals reais exigem um navegador auditando a página servida por URL — não disponível neste ambiente de sandbox (mesma limitação já documentada em `E2E_FINAL_REPORT.md` da sprint anterior). O que é verificável aqui — bundle size comparativo e revisão estática de re-renders — está reportado acima sem nenhuma métrica inventada.
