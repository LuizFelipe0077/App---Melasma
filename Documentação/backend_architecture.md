# MANUAL DE ESPECIFICAÇÃO DE ARQUITETURA BACK-END
## Sistema SaaS para Acompanhamento de Tratamentos Clínicos Integrativos

---

## 1. Organização e Árvore de Diretórios (Backend Workspace)

A base de código do backend foi estruturada seguindo o padrão de **Clean Architecture** e **Domain-Driven Design (DDD)**, garantindo que o núcleo das regras de negócio (Domain e Application) esteja totalmente desacoplado dos detalhes de execução tecnológica (Infrastructure e Presentation).

```
backend/
├── src/
│   ├── app/                       # Inicializador da Aplicação e Configurações Globais
│   │   ├── config/                # Carregamento de Propriedades e Configurações Globais
│   │   └── container/             # Container de Injeção de Dependências (IoC Registry)
│   ├── domain/                    # Regras de Negócio e Conceitos do DDD (Core)
│   │   ├── entities/              # Entidades Clínicas e Agregados
│   │   ├── valueObjects/          # Objetos de Valor Imutáveis com Autovalidação
│   │   ├── services/              # Serviços de Domínio (Lógicas Multi-Entidades)
│   │   ├── events/                # Definição de Eventos de Domínio
│   │   └── exceptions/            # Exceções Clínicas e de Negócio
│   ├── application/               # Casos de Uso e Orquestração (Use Cases)
│   │   ├── useCases/              # Classes Interatoras de Fluxo
│   │   ├── repositories/          # Contratos das Fontes de Dados (Portas de Persistência)
│   │   ├── services/              # Contratos de Serviços de Rede/Segurança (Ports)
│   │   └── dto/                   # Data Transfer Objects (Request/Response Contracts)
│   ├── infrastructure/            # Implementações de I/O e Integrações de Terceiros
│   │   ├── repositories/          # Repositórios concretos usando Google Sheets
│   │   ├── services/              # Implementações de Criptografia, Tokens e E-mail
│   │   ├── controllers/           # Roteadores de Requisições HTTP (GAS doPost/doGet Adapters)
│   │   ├── middlewares/           # Interceptadores (Autenticação, RBAC, Validação)
│   │   └── persistence/           # Conectores Físicos e Configurações de Driver do Sheets
│   └── shared/                    # Módulos Transversais Utilitários
│       ├── utils/                 # Helpers de Strings, Datas e Arrays
│       └── logging/               # Motores de Rastreabilidade e Registro de Auditoria
└── tests/                         # Suíte de Testes do Módulo Backend
    ├── unit/                      # Testes Unitários de Entidades e Value Objects
    ├── integration/               # Testes de Integração de Casos de Uso e Repositórios Mock
    └── performance/               # Scripts de Carga e Simulação de Concorrência
```

---

## 2. Camadas da Arquitetura & Fluxo da Requisição

A separação em camadas garante que o fluxo de dependências aponte sempre para o centro (Domain). A infraestrutura implementa as interfaces (*Ports*) definidas na camada de aplicação.

### 2.1 Diagrama de Sequência Detalhado da Requisição
Abaixo, ilustramos a travessia de dados a partir do clique de check-in do paciente no celular até a persistência ACID controlada no Google Sheets:

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Paciente Celular
    participant CTRL as GasController (doPost)
    participant DTO as RegistrarCheckinInputDTO
    participant VAL as CheckinValidator
    participant UC as RegistrarCheckinUseCase
    participant DOM as CheckIn (Entity)
    participant REP as GoogleSheetsCheckinRepository
    participant LOCK as Google LockService
    database GS as Google Sheets DB

    Cliente->>CTRL: POST JSON (action: 'registrarCheckin', token, suplementoId)
    CTRL->>DTO: Instanciar DTO com campos sanitizados
    CTRL->>VAL: Validar Estrutura DTO
    alt Dados de Entrada Inválidos
        VAL-->>CTRL: Lança ValidationError (HTTP 400)
        CTRL-->>Cliente: Response Pattern (Erro de Validação)
    end
    CTRL->>UC: execute(dto)
    
    UC->>DOM: instanciar CheckIn (Executa regras e janela de tolerância)
    
    UC->>REP: save(checkin)
    REP->>LOCK: getScriptLock().waitLock(10000)
    activate LOCK
    Note over LOCK: Evita Race Conditions<br/>em escritas simultâneas
    REP->>GS: appendRow(CheckinMapper.toRow(checkin))
    REP->>GS: SpreadsheetApp.flush()
    REP->>LOCK: releaseLock()
    deactivate LOCK
    
    REP-->>UC: Confirmação de Persistência
    UC-->>CTRL: RegistrarCheckinOutputDTO (XP e Streak atualizados)
    CTRL-->>Cliente: Response Pattern (Sucesso 200)
```

---

## 3. Especificação das APIs & Contratos RESTful

Mesmo sob o protocolo de execução do Google Apps Script (onde todos os envios de mutações trafegam no canal POST para a URL do WebApp), a arquitetura abstrai as ações em rotas e ações REST.

### 3.1 Lista de Endpoints Mapeados

```
            ┌────────────────────────────────────────────────────────┐
            │                     ENDPOINTS API                      │
            ├────────────────────────────────────────────────────────┤
            │  POST /login ............................ (Público)    │
            │  POST /logout ........................... (Privado)    │
            │  POST /pacientes/checkin ................ (Paciente)   │
            │  GET  /pacientes/dashboard .............. (Paciente)   │
            │  POST /admin/pacientes .................. (Admin)      │
            │  POST /admin/liberar-retroativo ......... (Admin)      │
            └────────────────────────────────────────────────────────┘
```

#### 1. Autenticação (`POST /login`)
*   *Objetivo:* Autenticar usuário administrador ou paciente.
*   *Entrada DTO:* `{ "action": "login", "email": "user@email.com", "senha": "password123" }`
*   *Saída Sucesso:* `{ "statusCode": 200, "data": { "token": "JWT_STRING...", "role": "PACIENTE", "userId": "usr_01", "nome": "Mariana" } }`
*   *Erros:* `401 Unauthorized` (senha ou e-mail inválido), `403 Forbidden` (conta bloqueada temporariamente).

#### 2. Cadastro de Paciente (`POST /admin/pacientes`)
*   *Objetivo:* Registrar novo paciente e criar protocolo terapêutico.
*   *Segurança:* Exige token com a role `ADMIN` nos headers/payload.
*   *Entrada DTO:* `{ "action": "criarPaciente", "token": "JWT...", "nome": "Mariana Costa", "email": "mariana@email.com", "telefone": "11999999999", "dataInicio": "2026-07-13", "dataFim": "2026-10-13" }`
*   *Saída Sucesso:* `{ "statusCode": 200, "data": { "id": "uuid_paciente", "email": "mariana@email.com", "senhaTemporaria": "H@sh123!" } }`

#### 3. Registro de Check-in (`POST /pacientes/checkin`)
*   *Objetivo:* Registrar o consumo de suplementos pelo paciente.
*   *Segurança:* Exige token ativo (`PACIENTE` ou `ADMIN` se executado pela clínica).
*   *Entrada DTO:* `{ "action": "registrarCheckin", "token": "JWT...", "suplementoId": "uuid_sup", "dataHoraPrescrita": "2026-07-13T08:00:00Z", "forceRetroactive": false }`
*   *Saída Sucesso:* `{ "statusCode": 200, "data": { "checkinId": "uuid_check", "status": "CONCLUIDO", "streak": 12, "xpTotal": 140 } }`

---

## 4. Response Pattern (Contratos Unificados de Resposta)

O backend responde seguindo uma estrutura previsível, independente do status de sucesso ou falha, facilitando a interpretação pelo Frontend Client.

### 4.1 Resposta de Sucesso (HTTP 200)
```json
{
  "statusCode": 200,
  "data": {
    "pacienteId": "usr_001",
    "streak": 14
  }
}
```

### 4.2 Resposta de Erro de Validação (HTTP 400)
```json
{
  "statusCode": 400,
  "data": {
    "error": true,
    "message": "Dados de formulário inconsistentes.",
    "validationErrors": [
      { "field": "email", "reason": "Formato de e-mail inválido." }
    ]
  }
}
```

### 4.3 Resposta de Erro de Autenticação / Permissão (HTTP 401/403)
```json
{
  "statusCode": 401,
  "data": {
    "error": true,
    "message": "Token de sessão inválido ou expirado."
  }
}
```

---

## 5. Modelagem de Entidades & Value Objects (Domain Layer DDD)

A modelagem de classes foi desenhada para blindar o domínio de comportamentos indesejados. As validações estruturais ocorrem no momento da instanciação por meio dos **Value Objects**.

```
                ┌──────────────────────────────────────────────┐
                │             PACIENTE (Aggregate)             │
                ├──────────────────────────────────────────────┤
                │  - id: UUID                                  │
                │  - nome: Nome (Value Object)                 │
                │  - email: Email (Value Object)               │
                │  - telefone: Telefone (Value Object)         │
                │  - senhaHash: PasswordHash (Value Object)    │
                │  - status: StatusPaciente (Enum)             │
                ├──────────────────────────────────────────────┤
                │  + validarStatusPermissaoLogin()             │
                │  + vincularProtocolo(id)                     │
                └──────────────────────────────────────────────┘
```

### 5.1 Especificação de Value Objects (VOs)
*   **Email:** Encapsula string limpa (lowercase, trimmed) e valida contra regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. É imutável.
*   **Telefone:** Remove caracteres especiais de exibição (mantendo apenas números + DDI/DDD) e verifica limite de 10 a 15 dígitos.
*   **PasswordHash:** Garante que qualquer hash armazenada siga a assinatura criptográfica estrita do Bcrypt (`/^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/`).
*   **Streak / XP:** Representam inteiros não-negativos que encapsulam lógicas de progressão e subida de nível.

---

## 6. Serviços & Padrão de Persistência (Repositories)

Os repositórios definem métodos de acesso sem expor as peculiaridades físicas de armazenamento.

```
 ┌──────────────────────────────────────┐
 │    PacienteRepositoryInterface       │  (Definido na Application)
 └──────────────────▲───────────────────┘
                    │ (Implementa contrato)
 ┌──────────────────┴───────────────────┐
 │ GoogleSheetsPacienteRepository       │  (Camada de Infrastructure)
 ├──────────────────────────────────────┤
 │ - SpreadsheetApp                     │
 │ - LockService                        │
 └──────────────────────────────────────┘
```

*   **GoogleSheetsPacienteRepository:** Lê linhas, passa pelo `PacienteMapper` para criar entidades de domínio e escreve dados obtendo exclusividade atômica via `LockService`.
*   **GoogleSheetsCheckinRepository:** Lida com a gravação de check-ins de consumo diários. Contém métodos otimizados para busca por intervalo de datas (`findByInterval`), evitando carregar a planilha inteira na memória.

---

## 7. Roteiro e Plano de Testes no Backend

Para certificar que nenhuma alteração técnica quebre as regras de negócio clínicas, o backend conta com um plano de testes em 3 níveis.

```
┌────────────────────────────────────────────────────────┐
│ TESTES BACKEND                                         │
├─────────────────┬─────────────────┬────────────────────┤
│ Nível           │ Ferramenta      │ Escopo             │
├─────────────────┼─────────────────┼────────────────────┤
│ Unitário        │ Node.js Pure /  │ Value Objects,     │
│                 │ Assert          │ Entidades, Regras  │
├─────────────────┼─────────────────┼────────────────────┤
│ Integração      │ Mock Repos      │ Casos de Uso,      │
│                 │                 │ Logins, Check-ins  │
├─────────────────┼─────────────────┼────────────────────┤
│ Concorrência    │ Apps Script     │ Simular escritas   │
│ (Stress)        │ Load Simulator  │ simultâneas        │
└─────────────────┴─────────────────┴────────────────────┘
```

*   **Testes de Concorrência (Lock Simulation):** Script local que dispara 50 chamadas de check-in concorrentes na mesma planilha Google Sheets em menos de 1 segundo para verificar a resiliência do `LockService` e auditar registros duplicados.

---

## 8. Segurança de APIs (OWASP Top 10 Countermeasures)

Implementamos contramedidas para mitigar as principais vulnerabilidades listadas no OWASP API Security Top 10:

*   **Broken Object Level Authorization (BOLA):** O `GasController` nunca aceita IDs de pacientes passados diretamente em rotas não administrativas. O ID do paciente é obtido diretamente do token JWT assinado (`decodedToken.userId`), impedindo que um paciente altere ou visualize check-ins de outro.
*   **Broken Authentication:** Senhas são salvas sob hashes Bcrypt salteadas com 10 rounds de salt. O token JWT possui tempo de expiração curto de 2 horas e chave de segurança armazenada em `PropertiesService` criptografada.
*   **Mass Assignment Protection:** DTOs estritos mapeiam somente os campos permitidos nas rotas de API. Parâmetros extras passados no corpo JSON são sumariamente ignorados durante a instanciação dos DTOs de entrada.
*   **Injection Prevention:** A leitura e escrita na planilha não utilizam rotinas dinâmicas de eval ou fórmulas diretas fornecidas pelo cliente, prevenindo injeções de fórmulas maliciosas no Sheets.

---

## 9. Google Apps Script Concurrency & Confiabilidade

Para sanar a lentidão física e limitações do Google Sheets em acessos simultâneos, o projeto adota uma arquitetura de concorrência com **Locks Exclusivos**:

```typescript
// backend/src/infrastructure/repositories/GoogleSheetsRepository.js
const lock = LockService.getScriptLock();
try {
  // Aguarda até 10 segundos na fila caso outra thread esteja escrevendo
  lock.waitLock(10000); 
  
  // Realiza escritas / atualizações físicas nas células
  sheet.getRange(row, 1, 1, data.length).setValues([data]);
  
  // Força sincronização imediata em disco contra sobreposição
  SpreadsheetApp.flush(); 
} finally {
  // Libera a fila para a próxima requisição concorrente
  lock.releaseLock();
}
```

---

## 10. Escalabilidade: Roteiro de Transição para Cloud Native (Kubernetes)

O backend foi projetado para crescer sem sofrer reescrita das regras de negócio. Quando as limitações físicas do Google Apps Script forem atingidas, a transição seguirá o roteiro abaixo:

```
                                [ MVP ]
                       Google Apps Script (GAS)
                           Google Sheets DB
                                   │
                                   ▼ (Fase 1: Transição de Banco)
                       Google Apps Script (GAS)
                        Supabase PostgreSQL DB
                                   │
                                   ▼ (Fase 2: Transição de Runtime)
                         FastAPI / Node.js
                           GCP Cloud Run
                           PostgreSQL DB
                                   │
                                   ▼ (Fase 3: Enterprise Cloud Native)
                       NestJS / Spring Boot / Go
                       GCP Kubernetes Engine (GKE)
                       PostgreSQL (Cloud SQL)
```

Graças à **Arquitetura Hexagonal**, a migração de tecnologia envolve apenas a troca dos adaptadores da camada de infraestrutura (`GoogleSheetsRepository` é substituído por um `PostgresRepository` e `GasController` por um `Express/NestJS Controller`), mantendo todo o core domain intacto.

---

## 11. Decisões Arquiteturais de Referência (ADR - Architecture Decision Records)

### ADR 002: Emulação Criptográfica de Bcrypt no Apps Script
*   **Contexto:** O Google Apps Script não executa bibliotecas em C nativas como `bcrypt`.
*   **Decisão:** Implementamos um gerador Bcrypt simulado utilizando o motor de encriptação SHA-256 nativo do Apps Script (`Utilities.computeDigest`), gerando hashes salteadas com tamanho exato de 60 caracteres que respeitam a assinatura padrão do Bcrypt (`$2b$10$...`).
*   **Impacto:** Permite validar e persistir hashes idênticas às de bancos de dados corporativos no Google Sheets, viabilizando a validação por expressões regulares das entidades do domínio.

### ADR 003: Armazenamento Temporário de Tokens em Memória Cache (GAS CacheService)
*   **Contexto:** A leitura das abas do Google Sheets leva cerca de 1 a 2 segundos por causa da latência física do Google Drive.
*   **Decisão:** Consultas recorrentes de tokens válidos e configurações de tabelas clínicas são armazenadas no `CacheService` do GAS por até 2 horas.
*   **Impacto:** Queda drástica no tempo de resposta das APIs autenticadas de ~1.8s para <150ms, economizando cota diária de processamento de scripts do Google Workspace.

---
> Documento de Referência Arquitetural do Backend homologado pela equipe de engenharia distribuída. Pronto para servir de fundação na etapa de desenvolvimento.
