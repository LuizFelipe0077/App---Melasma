# GUIA DE ARQUITETURA DE PERSISTÊNCIA EM GOOGLE SHEETS
## Camada de Persistência Desacoplada de Alta Performance e Governança de Dados

---

## 1. Arquitetura da Camada de Persistência

Projetamos a camada de dados tratando o **Google Sheets** estritamente como um detalhe físico de armazenamento temporário. O fluxo segue o padrão arquitetural de portas e adaptadores (*Hexagonal Architecture*), isolando o core do negócio de detalhes de rede e I/O.

```mermaid
graph TD
    subgraph Presentation Layer (Client)
        A[HTML5 / CSS3 / Vanilla JS SPA] -->|JSON Payload / HTTPS| B[doPost / doGet Router]
    end

    subgraph Application Layer (Serverless GAS Core)
        B -->|Command DTO| C[Use Cases / Interactors]
        C -->|Domain Entities| D[Repositories Interfaces - Ports]
    end

    subgraph Infrastructure Layer (GAS Adapters)
        D -->|Implements Contracts| E[GoogleSheetsRepository Adapter]
        E -->|Writes / Reads Row Arrays| F[Data Mappers]
        E -->|Executes LockService & CacheService| G[Google Services Driver]
    end

    subgraph Storage Layer (Physical DB)
        G -->|Batch Write / Read getValues| H[Google Sheets Spreadsheet]
    end
```

### 1.1 Responsabilidades de Fluxo
*   **Use Cases:** Operam apenas com objetos de domínio e interfaces de repositórios.
*   **GoogleSheetsRepository Adapter:** Traduz os comandos de consulta e escrita do domínio em operações físicas bidimensionais (`getValues` e `setValues`) na API do Google Sheets.
*   **Data Mappers:** Mapeiam vetores/linhas do Sheets para classes de Domínio e vice-versa.

---

## 2. Organização e Finalidade das Planilhas (Abas do Sheets)

O banco de dados é dividido em **23 abas exclusivas**, garantindo que não ocorra mistura de domínios ou redundâncias desnormalizadas de dados.

```
Spreadsheet (Clinica_Integrativa_DB)
├── Administradores ....... (Dados cadastrais da equipe clínica)
├── Pacientes ............. (Dados cadastrais e vínculos de tratamento)
├── Protocolos ............ (Prescrições agregadas)
├── Tratamentos ........... (Períodos de tratamentos ativos)
├── Cronogramas ........... (Agendas consolidadas por paciente)
├── Suplementos ........... (Nutrientes e dosagens vinculados ao protocolo)
├── Horarios .............. (Horários individuais parametrizados)
├── Checkins .............. (Registros físicos de consumo dos pacientes)
├── Notificacoes .......... (Alertas push e e-mail agendados/enviados)
├── Sessoes ............... (Tokens de sessões ativas com expiração)
├── Configuracoes ......... (Variáveis e preferências do sistema)
├── Permissoes ............ (RBAC - Role Based Access Control)
├── Auditoria ............. (Trilhas de auditoria imutáveis para LGPD)
├── Logs .................. (Registros técnicos de telemetria e erros)
├── Gamificacao ........... (Estatísticas de XP e nível do paciente)
├── Streaks ............... (Histórico de consistência consecutiva)
├── Badges ................ (Conquistas e medalhas ganhas)
├── Dashboard_Cache ....... (Métricas pré-processadas do dashboard)
├── Fila_Processamento .... (Buffer para envio de e-mails em lote)
├── Controle_Locks ........ (Gerenciador lógico de semáforos e concorrência)
├── Migracoes ............. (Registro de execuções de DDL e versão do banco)
└── Versao_Banco .......... (Apenas uma linha com o SemVer da versão estrutural)
```

---

## 3. Especificação Detalhada das Colunas (Esquema Físico)

Para ilustrar a rigidez estrutural, definimos a modelagem física exata para as principais tabelas estruturais de negócio.

### 3.1 Aba: `Suplementos`
*   **Finalidade:** Armazenar os suplementos e nutrientes que compõem os protocolos.
*   **Estrutura de Dados:**
    *   `id`: *VARCHAR(36) [PK]* - Formato UUID v4. Obrigatório.
    *   `protocoloId`: *VARCHAR(36) [FK]* - Vínculo com a tabela `Protocolos`. Obrigatório.
    *   `nome`: *VARCHAR(100)* - Nome comercial ou científico do suplemento. Obrigatório.
    *   `dosagem`: *VARCHAR(50)* - Dosagem prescrita (ex: "500mg", "1 cápsula"). Obrigatório.
    *   `horarios`: *TEXT [JSON]* - Vetor contendo horários em formato de array de string stringificado (ex: `["08:00", "22:00"]`). Obrigatório.
    *   `instrucoes`: *TEXT* - Orientações médicas (ex: "Tomar em jejum com água"). Opcional.

### 3.2 Aba: `Gamificacao`
*   **Finalidade:** Manter o saldo e nível de adesão do paciente.
*   **Estrutura de Dados:**
    *   `id`: *VARCHAR(36) [PK]* - Formato UUID v4. Obrigatório.
    *   `pacienteId`: *VARCHAR(36) [FK / UQ]* - Vínculo de relação 1:1 com a aba `Pacientes`. Obrigatório.
    *   `xpTotal`: *INTEGER* - Experiência total acumulada. Obrigatório. Padrão: `0`.
    *   `streakAtual`: *INTEGER* - Quantidade de dias consecutivos cumpridos. Obrigatório. Padrão: `0`.
    *   `maiorStreak`: *INTEGER* - Recorde histórico do paciente. Obrigatório. Padrão: `0`.
    *   `conquistas`: *TEXT [JSON]* - Array contendo os slugs das medalhas desbloqueadas. Obrigatório. Padrão: `[]`.

---

## 4. Estratégia de Identificadores & Chaves Lógicas

*   **Identificadores UUID v4:** Nunca utilizamos o índice físico da linha da tabela (ex: linha 15) como ID, pois reordenações, paginações ou migrações físicas quebram a integridade referencial.
*   **Primary Key (PK) Lógica:** Representa a coluna A de cada aba, contendo obrigatoriamente um UUID gerado em tempo de execução no Backend.
*   **Foreign Key (FK) Lógica:** Colunas de relacionamento referenciando a PK de outra aba. Repositórios concretos validam a existência lógica do ID de destino antes de persistir alterações.

---

## 5. Arquitetura de Índices Lógicos em Memória (Lookup e Cache)

Como a API do Google Sheets não possui suporte a índices de busca (Indexes), projetamos a camada de persistência para simular **Índices Lógicos em Memória** via *HashMaps* utilizando o `CacheService` do Apps Script.

```
       [ Chamada de Consulta: findByEmail("luiz@email.com") ]
                                  │
                                  ▼
             ┌──────────────────────────────────────────┐
             │       VERIFICA INDEX CACHE (10ms)        │
             ├──────────────────────────────────────────┤
             │ email_cache_index: {                     │
             │   "luiz@email.com": "usr_uuid_123"       │
             │ }                                        │
             └────────────────────┬─────────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼ (Cache Hit - 10ms)                              ▼ (Cache Miss - 1.5s)
 [ Carrega linha direta pelo ID ]               [ Tabela Scan completa no Sheets ]
                                                           │
                                                           ▼
                                                [ Popula index_cache ]
```

### 5.1 Tempo de Expiração da Camada de Cache

| Recurso | Tipo de Cache | Expiração (segundos) | Racional Técnico |
| :--- | :--- | :---: | :--- |
| **Sessões (`Sessoes`)** | CacheService Privado | 3600 (1 hora) | Garante validações de autenticação em menos de 5ms a cada chamada de rota. |
| **Configurações (`Configuracoes`)** | CacheService Público | 7200 (2 horas) | Variáveis estáticas e design tokens de layout que raramente sofrem alteração clínica. |
| **Protocolo Clínico (`Protocolos`)** | CacheService Público | 1800 (30 min) | Permite carregar prescrições pesadas de suplementação sem bater fisicamente no Sheets a cada check-in. |

---

## 6. Controle de Concorrência e Conflitos de Gravação

Em sistemas SaaS onde múltiplos usuários (Clínicos administradores e Pacientes) operam simultaneamente, conflitos de concorrência no Sheets corrompem a gravação das linhas.

```
            MUTAÇÃO SIMULTÂNEA NA MESMA PLANILHA
           ┌───────────────────┬───────────────────┐
     Thread 1 (Paciente)                 Thread 2 (Admin)
           │                                   │
           ▼                                   ▼
    [ Lock.waitLock() ]                 [ Lock.waitLock() ]
     (Adquire bloqueio)                  (Fica em Fila de Espera)
           │                                   │
           ▼ (Executa Escrita)                 │
    SpreadsheetApp.flush()                     │
    lock.releaseLock() ────────────────────────┘
                                               ▼ (Adquire bloqueio liberado)
                                        Executa Escrita baseada em dados novos
```

### 6.1 Lock Pessimista
*   **Onde usar:** Nas abas críticas de alteração de saldo, registros e check-ins (`Checkins`, `Gamificacao`).
*   *Mecanismo:* O repositório solicita um bloqueio exclusivo via `LockService.getScriptLock()` com tempo limite de fila de 10 segundos antes de ler e escrever. Isso serializa as escritas concorrentes, eliminando condições de corrida (*race conditions*).

### 6.2 Lock Otimista (Versionamento de Linha)
*   **Onde usar:** No cadastro e modificação de prontuários do paciente (`Pacientes`).
*   *Mecanismo:* A linha possui uma coluna `version` (inteiro incremental). Ao gravar alterações, o repositório verifica se a versão enviada pelo frontend bate com a versão atual no Sheets. Se houver diferença, significa que outro administrador alterou os dados concorrentemente, abortando a escrita e solicitando que o usuário reabra o prontuário para mesclar.

---

## 7. Migration Manager (Estruturação e Versionamento do Banco)

Para viabilizar que alterações estruturais ocorram sem interrupção de serviço, projetamos um **Migration Manager** para gerenciar a evolução estrutural das planilhas.

```typescript
// backend/src/infrastructure/persistence/MigrationManager.js
export class MigrationManager {
  private static migrations = [
    {
      version: '1.0.0',
      up: (ss) => {
        // Cria abas base
        ss.insertSheet('Pacientes');
      }
    },
    {
      version: '1.1.0',
      up: (ss) => {
        // Altera aba de Pacientes adicionando coluna deletedAt na coluna J
        const sheet = ss.getSheetByName('Pacientes');
        sheet.getRange('J1').setValue('deletedAt');
      }
    }
  ];

  static runMigrations() {
    const currentVersion = this.getCurrentVersion();
    const ss = SpreadsheetApp.openById(SystemConfiguration.DATABASE_SPREADSHEET_ID);
    
    for (const migration of this.migrations) {
      if (isVersionGreater(migration.version, currentVersion)) {
        migration.up(ss);
        this.updateVersion(migration.version);
      }
    }
  }
}
```

---

## 8. Limitações Físicas & Planos de Contingência do Google Sheets

O Google Sheets não é um banco de dados relacional robusto. Mapeamos seus gargalos físicos para desenhar limites operacionais seguros para a aplicação integrativa.

| Limitação Física | Impacto no SaaS | Racional Técnico | Plano de Contingência / Mitigação |
| :--- | :--- | :--- | :--- |
| **Limite de 10 milhões de células** | Esgotamento de espaço de escrita. | Planilhas pesadas com dezenas de colunas atingirão o limite após milhares de check-ins. | Executar arquivamento anual (*Data Archiving*) movendo check-ins antigos para uma planilha histórica legada de leitura fria. |
| **Tempo máximo de execução (6 minutos)** | Timeout em relatórios e consolidação. | Consultas complexas que varrem toda a planilha estouram o limite de processamento síncrono do GAS. | Utilizar cache materializado na aba `Dashboard_Cache` e indexação de dados na memória RAM do servidor. |
| **Contenção de escrita concorrente** | Lock timeouts e lentidão de resposta. | Chamadas paralelas aguardando na fila do `LockService` expiram após 10 segundos, retornando erros. | Otimização extrema de escritas agrupando atualizações clínicas em lote (*Batch Processing*) e fila local assíncrona. |

---

## 9. Roteiro de Transição e Migração Física do Banco de Dados

Quando a clínica expandir ou a concorrência atingir os limites físicos do Google Sheets, a transição para bancos corporativos relacionais ou NoSQL ocorrerá sem reescrever as regras de negócio da aplicação.

```
       ESTADO ATUAL (MVP Sheets)
       Use Cases ──► PacienteRepositoryInterface ──► GoogleSheetsPacienteRepository ──► Sheets
                                                                │
                                                        (Troca o Adaptador)
                                                                ▼
       MIGRAÇÃO EXECUTADA (PostgreSQL/Supabase)
       Use Cases ──► PacienteRepositoryInterface ──► PostgresPacienteRepository ──► Supabase DB
```

### 9.1 Mapeamento de Mudança na Migração
*   **O que permanece idêntico (100% de reuso):** Toda a camada visual do Frontend, o Roteamento API (`GasController`), os Casos de Uso (`CriarPacienteUseCase`), as Entidades do Domínio e os Validadores.
*   **O que muda (Infrastructure Adapters):** Os repositórios concretos (`GoogleSheetsPacienteRepository` é desativado e substituído pela implementação do `PostgresPacienteRepository`).
*   **O que é deletado:** As rotinas do `LockService` e o gerenciador de tabelas `DatabaseSetup`, pois a integridade ACID passará a ser gerenciada nativamente pelo PostgreSQL.

---

## 10. Decisões Arquiteturais de Persistência (ADRs)

### ADR 008: Abstração de I/O em Repositórios Concretos
*   **Decisão:** Bloquear a importação ou uso do objeto global `SpreadsheetApp` fora do diretório `infrastructure/repositories/`.
*   **Justificativa:** Garantir o desacoplamento arquitetural completo. Qualquer lógica que precise consultar dados do sheets deve depender exclusivamente dos contratos abstratos de repositório.

### ADR 009: Utilização de TextEncoder e Subtle Crypto no Node.js/GAS
*   **Decisão:** Utilizar criptografia HMAC-SHA256 nativa nas duas pontas (com suporte a Web Crypto API no Node e Utilities no GAS).
*   **Justificativa:** Viabilizar a consistência de hashes de senhas e geração de tokens em ambientes híbridos, permitindo executar testes offline de integração local sem dependência com o Google Apps Script.

---

## 11. Matriz de Maturidade de Persistência em Google Sheets

Abaixo, avaliamos e mapeamos a escala de governança de dados da camada física base do nosso MVP.

### 11.1 Matriz de Maturidade

```
Nível 1 (Planilhas Avulsas) ──► Nível 2 (Abas Coesas) ──► Nível 3 (Indexado/GAS Lock) ──► Nível 4 (Big Tech Grade) ──► Nível 5 (AWS/GCP Dedicated RDS)
                                                                                                 ▲
                                                                                       [ Nossa Solução ]
```

*   **Nível 1:** Múltiplos arquivos soltos no Drive, leitura por index numérico de célula, acoplamentos de escrita.
*   **Nível 2:** Abas organizadas no mesmo arquivo Spreadsheet, chaves lógicas textuais básicas, sem controle de concorrência ou versionamento de tabelas.
*   **Nível 3:** Abas normalizadas em 3FN, chaves primárias em UUID v4, controle de semáforo concorrente via `LockService` e indexação estática.
*   **Nível 4 (Nossa Persistência):** Nível 3 somado a caches reativos em memória (`CacheService`), monitoramento de telemetria de R/W, Soft Delete clínico estruturado, trilha de auditoria imutável (compliance LGPD), `Migration Manager` para migrações contínuas de colunas, e isolamento total sob *Hexagonal Architecture*.
*   **Nível 5:** Migração completa para PostgreSQL corporativo sob Google Cloud SQL com replicação geodistribuída, balanceadores de queries lógicas e RTO/RPO menores que 1 minuto.

---
> Guia de Persistência em Google Sheets homologado. Pronto para servir de referência técnica no setup físico da infraestrutura do banco de dados do MVP.
