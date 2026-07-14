# QUALITY ASSURANCE & TEST STRATEGY HANDBOOK
## Engenharia de Qualidade, Automação e Resiliência (TMMi e BDD)

---

## 1. Abordagem Estratégica e Pirâmide de Testes

Este manual formaliza a **Estratégia de Quality Assurance (QA)** do aplicativo de Acompanhamento Clínico Integrativo. Nossa metodologia adota os conceitos de **Shift-Left Testing** (testar cedo e constantemente no ciclo de desenvolvimento), **Risk-Based Testing** (foco nas funcionalidades críticas de saúde e segurança) e **Continuous Testing** integrado à pipeline de CI/CD.

```
                     /\
                    /  \      Exploratórios (Manual / UX) - 5%
                   /----\
                  /  E2E \    Cenários de Negócio (Playwright) - 10%
                 /--------\
                /   API    \  Contratos & Middlewares (Postman/Supertest) - 20%
               /------------\
              /  Integração  \ Persistência Sheets & LockService - 25%
             /----------------\
            /    Unitários     \ Domínio, VOs, Criptografia, Streaks - 40%
           /--------------------\
```

### 1.1 Distribuição da Pirâmide de Testes (Metas de Cobertura)
*   **Testes Unitários (40% do esforço / Cobertura > 90%):** Foco em isolar regras de domínio puras (`Email.js`, `BcryptGasService.js`, `Gamificacao.js`, cálculo de XP e Streaks).
*   **Testes de Integração (25% / Cobertura > 80%):** Validam a persistência local, mapeamento de dados (`PacienteMapper.js`) e as regras atômicas de concorrência (`LockService`).
*   **Testes de API (20%):** Validam o roteador do `GasController` contra payloads corrompidos, injeção de fórmulas e middlewares de rate limiting.
*   **Testes End-to-End (10%):** Jornadas do usuário completas (Onboarding -> Check-in -> Painel de Controle) usando emulação no Chrome/Safari.
*   **Testes Exploratórios (5%):** Roteiros manuais para identificar falhas de experiência emocional, lentidão visual ou atritos do usuário real.

---

## 2. Especificação da Suíte de Testes Automatizados

### 2.1 Testes Unitários (Domain & App Layer)
A suíte garante que funções matemáticas e fluxos de decisão clínica não quebrem após refatorações.
*   **Gamificação:** Verificação de acúmulo correto de XP com base no `StatusCheckin` (Concluído: $+10$ XP; Atrasado: $+5$ XP).
*   **Validação de Streak:** Regra de reset e aplicação do amortecedor (`Streak Freeze`) na ausência de check-in.
*   **Value Objects:** Validação de formato e imutabilidade dos dados de entrada (`Email`, `Telefone`, `UUID`).

### 2.2 Testes de API e Contratos
Os endpoints doPost do Google Apps Script são testados simulando payloads e avaliando o envelope JSON de retorno:
*   **Cenário de Login Correto:** Verifica retorno de status 200, JWT válido, e omissão do `senhaHash`.
*   **Cenário de Injeção de Fórmula:** Envio de caracteres de fórmula (`=`, `+`) e verificação de sanitização pelo `InputSanitizer`.

---

## 3. Testes Não-Funcionais: Performance, Carga e Resiliência

Como a persistência utiliza o Google Sheets e o runtime executa sob o ecossistema do Google Apps Script, os limites de infraestrutura determinam a estratégia de testes não-funcionais.

### 3.1 Limitações de Cotas e Metas de Desempenho (SLA)
*   **Tempo Máximo de Execução de Script (Google Apps Script):** 6 minutos por requisição.
*   **Metas de Desempenho (SLA):**
    *   Carregamento do App (PWA offline-cached): $< 1.2$ segundos.
    *   Resposta do check-in na API: $< 1.8$ segundos.
    *   Leitura do Dashboard Clínico: $< 2.2$ segundos.

### 3.2 Cenários de Testes de Carga e Estresse

| Usuários Simultâneos | Objetivo | Comportamento Esperado | Limitação do Google Sheets |
| :---: | :--- | :--- | :--- |
| **10** | Uso Padrão (Diário) | Respostas em $< 1$s. LockService limpa em milissegundos. | Operação normal e fluida. |
| **50** | Pico Médio (Horários de Dose) | Fila de escrita concorrida. LockService serializa requisições. | Atraso aceitável de até 3s. |
| **100** | Estresse Clínico | Algumas escritas entram em fila. Limite de conexões simultâneas do GAS testado. | Risco de timeout em 1% das chamadas. |
| **500** | Carga Limite | Sobrecarga de chamadas. Exaustão de cota diária de leitura/escrita. | Sistema retorna HTTP 429 via Rate Limiter. |

### 3.3 Testes de Resiliência
Simulação de falhas de infraestrutura:
*   **Planilha Bloqueada (Concorrência):** Testado injetando atrasos artificiais em escritas paralelas para verificar se o `LockService` evita condições de corrida (*Race Conditions*) sem corromper as células.
*   **Desconexão de Rede (Offline PWA):** Desativação de internet no navegador do paciente para verificar se os dados de check-in são mantidos no cache offline e enfileirados para sincronização posterior.

---

## 4. Testes de Acessibilidade (WCAG 2.2) e Usabilidade

### 4.1 Conformidade com WCAG 2.2 (Nível AA)
*   **Contraste Visual:** Validação de cores Terracota/Verde Oliva contra o fundo escuro/claro garantindo contraste mínimo de **4.5:1** para textos normais e **3:1** para ícones grandes.
*   **Navegação Teclado:** Garantia de que todos os botões clicáveis (`.clickable`) possuem anel de foco visível (`:focus-visible`) e podem ser ativados via tecla `Tab` + `Enter`.
*   **Leitores de Tela:** Uso obrigatório de atributos ARIA (`aria-label`, `aria-checked`, `role="group"`) em componentes dinâmicos como os cards de suplementação.

---

## 5. BDD (Behavior Driven Development) - Especificações Gherkin

### 5.1 Funcionalidade: Check-in de Suplementação
```gherkin
Feature: Registro de Check-in Terapêutico
  Como um paciente cadastrado no sistema
  Desejo confirmar a ingestão do meu suplemento no horário correto
  Para acumular XP e consolidar minha consistência no tratamento

  Scenario: Registro de check-in no horário correto (Dentro da janela)
    Given que o paciente está autenticado no aplicativo
    And seu tratamento está no estado "ATIVO"
    When ele confirma o check-in do suplemento programado dentro de 60 minutos do horário prescrito
    Then o sistema deve gravar o evento com status "CONCLUIDO"
    And deve adicionar 10 XP à Gamificação do paciente
    And deve incrementar o Streak diário em 1
    And o Dashboard visual deve atualizar imediatamente

  Scenario: Bloqueio de check-in retroativo sem liberação do clínico
    Given que o paciente está autenticado no aplicativo
    And ele tenta realizar um check-in de um suplemento com data de ontem
    And o paciente não possui permissão de edição retroativa liberada
    When ele envia a requisição de check-in
    Then o sistema deve rejeitar o registro com uma mensagem amigável
    And o Streak diário do paciente deve ser preservado sem alteração
```

### 5.2 Funcionalidade: Controle de Acesso Administrativo
```gherkin
Feature: Gestão de Pacientes pelo Clínico
  Como um médico ou clínico administrador autenticado
  Desejo cadastrar novos pacientes e liberar janelas de edição retroativa
  Para gerenciar o protocolo sem expor dados clínicos a terceiros

  Scenario: Liberação manual de edição retroativa temporária
    Given que o administrador está autenticado no painel de controle
    When ele concede 24 horas de edição retroativa para o Paciente "Carla Souza"
    Then o sistema cria um registro na tabela "Permissoes" com validade de 24 horas
    And grava um evento imutável "SECURITY_PERMISSAO_CONCEDIDA" no log de Auditoria
```

---

## 6. Engenharia do Caos (Chaos Engineering)

Simulamos interrupções controladas para validar o comportamento defensivo do sistema:

```
  INCIDENTE INJETADO                    COMPORTAMENTO ESPERADO DO SISTEMA
┌─────────────────────────┐            ┌──────────────────────────────────────────────┐
│ Falha na leitura do GAS │───────────►│ Frontend exibe banner de aviso não-invasivo.  │
│ (Timeout de API)        │            │ Ativa fila de re-tentativa com backoff.       │
└─────────────────────────┘            └──────────────────────────────────────────────┘
┌─────────────────────────┐            ┌──────────────────────────────────────────────┐
│ Planilha cheia / erro   │───────────►│ Use cases falham atomicamente.               │
│ de escrita Sheets       │            │ Transação cancelada; dados não são perdidos. │
└─────────────────────────┘            └──────────────────────────────────────────────┘
```

*   **Experimento 1: Atraso artificial de Rede (Latency Spike):** Injetamos latência de 5000ms no WebApp. O aplicativo deve ativar a animação de carregamento (spinner discreto) e não travar o clique do usuário.
*   **Experimento 2: Bloqueio de Permissão de Acesso:** Alteramos dinamicamente as permissões de leitura da planilha. O backend deve falhar em modo fechado (*fail-closed*), recusar solicitações de alteração e disparar um e-mail de alerta para o administrador.

---

## 7. Quality Gates e Pipeline de CI/CD

Estes critérios de aceitação determinam se uma alteração está qualificada para merge e deploy automatizado no GitHub Pages.

```
                  ┌────────────────────────────────────────┐
                  │           Git Commit / Push            │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │              Lint Check                │
                  │   ESLint sem avisos ou erros críticos  │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │           Testes Unitários             │
                  │     100% aprovados, cobertura > 90%    │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │            Security Scan               │
                  │      Trivy / Gitleaks sem segredos     │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │            Quality Gate OK!            │
                  │      Deploy Automatizado no Pages      │
                  └────────────────────────────────────────┘
```

---

## 8. Decisões Arquiteturais de Qualidade (ADRs)

### ADR 027: Testes de Integração com Planilha Local (In-Memory Fallback)
*   **Decisão:** Em ambientes de teste locais e de CI (GitHub Actions), os repositórios caem para um adaptador em memória que emula as tabelas do Google Sheets.
*   **Justificativa:** Executar testes unitários e de integração dependendo da conexão com a API real do Google Sheets aumentaria a latência dos testes de <1s para >30s, além de esgotar as cotas diárias de execução da conta de serviço.

### ADR 028: Testabilidade por Design nos Controllers
*   **Decisão:** Todos os controladores dependem de injeção de dependência via construtores, nunca instanciando repositórios diretamente dentro de métodos.
*   **Justificativa:** Permite que mocks e stubs de repositórios e serviços de criptografia sejam facilmente injetados durante as suítes de testes de unidade.

---

## 9. Matriz de Maturidade de Qualidade (TMMi)

Avaliamos a estratégia de testes do nosso aplicativo utilizando o modelo TMMi (Test Maturity Model integration) como referência:

```
Nível 1 (Inicial) ──► Nível 2 (Definido) ──► Nível 3 (Integrado) ──► Nível 4 (Medido / QA Pro) ──► Nível 5 (Otimizado / CI-CD Grade)
                                                                             ▲
                                                                     [ Nosso Sistema ]
```

*   **Nível 1 (Inicial):** Testes são executados de forma puramente ad-hoc e manual antes do deploy, sem documentação ou automação.
*   **Nível 2 (Definido):** Suíte básica de testes unitários escrita, mas executada manualmente pelos desenvolvedores. Sem CI/CD ativo.
*   **Nível 3 (Integrado):** Testes automatizados executados a cada Pull Request. Casos de uso de BDD definidos e integrados à documentação.
*   **Nível 4 (Medido / QA Pro - Nosso Sistema):** Testes de API cobrindo injeção de fórmulas e contratos, testes unitários com cobertura superior a 90% validando concorrência de LockService, testes de resiliência e experimentos de Chaos Engineering planejados, cobertura de acessibilidade WCAG 2.2 e design PWA offline validados.
*   **Nível 5 (Otimizado):** Pipeline contínua com testes dinâmicos de carga injetados a cada deploy, auto-análise de logs e falhas com Inteligência Artificial e detecção automática de regressões de performance.

---
> Quality Assurance & Test Strategy Handbook homologado para guiar os ciclos de testes contínuos e conformidade do sistema.
