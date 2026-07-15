window.contentPart2 = [
  {
    slug: 'fluxo-completo',
    title: 'Fluxo Completo de Operação',
    html: `
      <p>Entenda o ciclo de vida completo do sistema a partir do momento em que um usuário realiza uma ação.</p>
      
      <div class="mermaid">
      sequenceDiagram
        autonumber
        actor P as Paciente
        participant F as Frontend (GH Pages)
        participant B as Backend (GAS)
        participant S as Database (Sheets)

        P->>F: Clica em "Check-in"
        F->>F: Exibe Loading Local
        F->>B: POST /exec (action: registrarCheckin, token: JWT)
        B->>B: TokenService.validate()
        B->>B: RateLimiter.check()
        B->>S: Leitura (Busca suplemento)
        S-->>B: Dados do Suplemento
        B->>S: Escrita (Insere linha no Checkins)
        B->>S: Atualiza linha na Gamificação (XP++)
        B-->>F: Response 200 (Success)
        F->>F: Atualiza interface (Toca som / Toast)
        F-->>P: Feedback visual de conclusão
      </div>
    `
  },
  {
    slug: 'atualizacoes',
    title: 'Atualizações de Sistema e Rollback',
    html: `
      <p>Bugs acontecem. Novas features são lançadas. Esteja preparado para atualizar as camadas da aplicação de forma segura e fazer rollback em caso de falha.</p>

      <h3>Atualizando o Frontend</h3>
      <p>Basta modificar o HTML/JS local, commitar e enviar pro GitHub. O <strong>GitHub Actions</strong> cuidará da invalidação de cache do site.</p>
      <pre><code class="language-bash">git add .
git commit -m "fix: corrige alinhamento do card de suplemento"
git push origin main</code></pre>

      <h3>Atualizando o Backend (Apps Script)</h3>
      <p>Se você alterar o backend, enviar via <code>clasp push</code> <strong>NÃO</strong> atualiza a API em produção imediatamente (o que é excelente, previne acidentes). Ele envia um "Rascunho".</p>
      
      <ol class="step-list">
        <li class="step-item">Faça a alteração: <code>clasp push</code></li>
        <li class="step-item">Abra o editor online: <code>clasp open</code></li>
        <li class="step-item">Vá em <strong>Implantar</strong> > <strong>Gerenciar implantações</strong>.</li>
        <li class="step-item">Edite a implantação de Produção (o ícone de lápis) e em <strong>Versão</strong>, mude de "versão N" para <strong>Nova versão</strong>. Salve.</li>
      </ol>
      <div class="alert alert-info">
        <div class="alert-icon">💡</div>
        <div>Esta técnica de <strong>Versionamento de Deploy</strong> permite que a URL do backend continue sempre a mesma.</div>
      </div>

      <h3>Como fazer Rollback (Desfazer cagada)</h3>
      <p>Se o backend novo der erro, volte na mesma tela de <em>Gerenciar Implantações</em>, clique em editar, e na versão escolha a "versão N-1" que funcionava antes. Pressione Concluído. O sistema volta ao normal imediatamente, sem precisar mexer no código!</p>
    `
  },
  {
    slug: 'backup',
    title: 'Backup e Restauração',
    html: `
      <p>Os dados residem no Google Sheets. Um backup de Google Sheets é a coisa mais simples e poderosa do sistema.</p>

      <h3>1. Rotina de Backup Automática via Cron (Trigger)</h3>
      <p>É altamente recomendado acessar o painel do Apps Script, ir no menu "Acionadores (Triggers)", e criar um gatilho mensal para gerar uma cópia da planilha.</p>
      
      <h3>2. Backup Manual (Export)</h3>
      <p>A qualquer momento, abra o Sheets > <code>Arquivo > Fazer download > Microsoft Excel (.xlsx)</code>. Pronto. Todo seu banco offline e seguro.</p>

      <h3>3. Como Restaurar um Backup Completo</h3>
      <ol class="step-list">
        <li class="step-item">Crie um novo Google Sheets importando o <code>.xlsx</code> de backup.</li>
        <li class="step-item">Copie o ID do NOVO Spreadsheet.</li>
        <li class="step-item">No Apps Script, vá nas Configurações, edite o <code>DATABASE_SPREADSHEET_ID</code> para o novo ID. Pronto. A API volta a ler o banco saudável em milissegundos.</li>
      </ol>
    `
  },
  {
    slug: 'seguranca',
    title: 'Postura de Segurança (SecOps)',
    html: `
      <p>Checklist rigoroso de segurança da API v1.0.</p>

      <div class="checklist-item">
        <input type="checkbox" id="chk-sec-1" checked disabled>
        <div class="checklist-label">
          <strong>Propriedades Blindadas:</strong> <code>JWT_SECRET</code> e senhas não existem hardcoded. Estão trancadas no PropertiesService.
        </div>
      </div>
      <div class="checklist-item">
        <input type="checkbox" id="chk-sec-2" checked disabled>
        <div class="checklist-label">
          <strong>CORS Protection:</strong> O Google Apps Script trata chamadas de outras origens transparentemente e nós rejeitamos endpoints não autorizados no GasRouter.
        </div>
      </div>
      <div class="checklist-item">
        <input type="checkbox" id="chk-sec-3" checked disabled>
        <div class="checklist-label">
          <strong>Anti-Brute Force (RateLimiter):</strong> Habilitado no <code>GasController</code>. Usando a infraestrutura de Caching L4 da Google. Mais de 5 logins errados banem a conexão por 15 minutos.
        </div>
      </div>
      <div class="checklist-item">
        <input type="checkbox" id="chk-sec-4" checked disabled>
        <div class="checklist-label">
          <strong>Defesa XSS Activa:</strong> Todos os campos no Painel Admin sofrem parse HTML (escape) antes de serem formatados no grid.
        </div>
      </div>
    `
  },
  {
    slug: 'troubleshooting',
    title: 'Troubleshooting: Resolução de Problemas',
    html: `
      <p>FAQ de Desastres Reais e como resolvê-arlos em Produção.</p>

      <div class="alert alert-danger">
        <div class="alert-icon">🔥</div>
        <div>
          <div class="alert-title">Sintoma: O Frontend mostra erro de CORS ou erro de Rede ("Network Error").</div>
          <strong>Causa provável:</strong> A URL da API <code>/exec</code> configurada no frontend no <code>ApiClient.js</code> está errada, aponta pra ambiente local, ou você configurou as permissões do Web App GAS para "Apenas Eu" ao invés de "Qualquer pessoa".<br>
          <strong>Solução:</strong> Refaça o Deploy do GAS verificando as permissões na janela final e atualize o código frontend.
        </div>
      </div>

      <div class="alert alert-warn">
        <div class="alert-icon">⚠️</div>
        <div>
          <div class="alert-title">Sintoma: Login administrativo não funciona, dá sempre "Credenciais inválidas".</div>
          <strong>Causa provável:</strong> Variáveis no PropertiesService não conferem.<br>
          <strong>Solução:</strong> Confira no GAS > Configurações se os campos <code>ADMIN_EMAIL</code> não possuem espaços perdidos. Garanta que <code>ADMIN_PASS_HASH</code> é realmente um Hash de Bcrypt válido (e não uma senha crua!).
        </div>
      </div>

      <div class="alert alert-info">
        <div class="alert-icon">💡</div>
        <div>
          <div class="alert-title">Sintoma: Novos pacientes não aparecem, ou sistema lança erro no insert.</div>
          <strong>Causa provável:</strong> As colunas da aba do Google Sheets foram embaralhadas ou removidas acidentalmente.<br>
          <strong>Solução:</strong> Restaure a primeira linha (cabeçalhos) para seguir EXATAMENTE o padrão do Capítulo 3.
        </div>
      </div>
    `
  },
  {
    slug: 'faq',
    title: 'Perguntas Frequentes (FAQ)',
    html: `
      <h3>O App funciona Offline no celular?</h3>
      <p>Sim. Devido à arquitetura implementada, os arquivos frontends (HTML/JS/CSS) e assets são baixados num PWA (Progressive Web App). Quando offline, o app abre perfeitamente, porém as ações de gravação (checkin) requerem que a internet volte.</p>

      <h3>Quantos usuários essa arquitetura Sheets+GAS aguenta?</h3>
      <p>Para um caso de uso Clínico / SaaS em estágio MVP até Series A, tranquilamente atende algumas dezenas a centenas de pacientes (graças à re-estruturação de requests e do Rate Limit com Cache). Sheets têm limite de de 10 milhões de células, o que equivale a um uso de anos para um MVP médio. A gargalo real são quotas diárias de execução do Google, por isso os requests em batch e deduplicação aplicadas na Sprint de Performance ajudam imensamente.</p>
    `
  },
  {
    slug: 'checklist-final',
    title: 'Matriz de Prontidão de Implantação',
    html: `
      <p>Não anuncie o produto aos seus clientes antes de bater o olho neste Checklist de Go-Live e garantir que tudo está 100%.</p>

      <table class="data-table">
        <thead>
          <tr>
            <th>Componente</th>
            <th>Check / Verificação</th>
            <th>Status Desejado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Google Sheets</strong></td>
            <td>Banco Privado criado, abas idênticas à arquitetura. Nenhuma linha de espaço vazio antes da linha de cabeçalho.</td>
            <td><span class="badge badge-ready">Ready</span></td>
          </tr>
          <tr>
            <td><strong>GAS Properties</strong></td>
            <td>SPREADSHEET_ID, JWT_SECRET, ADMIN_EMAIL configurados de forma segura sem vazar no source control.</td>
            <td><span class="badge badge-ready">Ready</span></td>
          </tr>
          <tr>
            <td><strong>GAS Web App</strong></td>
            <td>Deploy criado com permissão "Executar como: EU" e "Acesso: QUALQUER UM". Nenhuma tela de OAuth aparece aos usuários finais.</td>
            <td><span class="badge badge-ready">Ready</span></td>
          </tr>
          <tr>
            <td><strong>GitHub Actions</strong></td>
            <td>O Push pra main faz deploy via actions da pasta frontend pro GitHub Pages corretamente.</td>
            <td><span class="badge badge-ready">Ready</span></td>
          </tr>
          <tr>
            <td><strong>Frontend Env</strong></td>
            <td>O arquivo <code>ApiClient.js</code> está apontando para o <code>/exec</code> de Produção e não para um script de desenvolvimento <code>/dev</code>.</td>
            <td><span class="badge badge-todo">Verify</span></td>
          </tr>
        </tbody>
      </table>
    `
  },
  {
    slug: 'fluxogramas',
    title: 'Arquitetura e Fluxogramas Avançados',
    html: `
      <h2>Lifecycle do Rate Limiting via Cache</h2>
      <div class="mermaid">
      stateDiagram-v2
        direction LR
        [*] --> Requisição_Chega
        Requisição_Chega --> Verifica_Chave : Ler CacheService
        Verifica_Chave --> Libera_Acesso : Falhas < Max
        Verifica_Chave --> Bloqueia_Acesso : Falhas >= Max
        
        Libera_Acesso --> Executa_App
        Executa_App --> Sucesso : Deleta Chave Cache
        Executa_App --> Falha_Login : Incrementa Cache++
        
        Bloqueia_Acesso --> Timer : Aguarda 15 min
        Timer --> Requisição_Chega : Cache Expira
      </div>

      <h2>Fluxo de Setup de Database</h2>
      <div class="mermaid">
      graph TD
        A[Google Drive] -->|Criar Documento| B[Google Sheets]
        B -->|Criar Abas| C(Pacientes, Checkins, Protocolos)
        C -->|Definir Permissão| D{Público?}
        D -->|Sim - ERRO CRÍTICO| E[Vazamento de Dados]
        D -->|Não - RESTRITO| F[Apenas Admin acessa]
        F --> G[Copiar ID da Planilha]
        G --> H[Colar no Properties do GAS]
      </div>
    `
  },
  {
    slug: 'manual-visual',
    title: 'Manual Visual & Placeholders',
    html: `
      <p>Nesta seção, reserve o espaço para capturar os prints do sistema real rodando e anexá-los (Basta colocar os prints na pasta <code>Documentação/manual-deploy/assets</code> e linká-los).</p>

      <h3>1. Dashboard Admin de Alta Performance</h3>
      <div class="img-placeholder">
        📸 O print desta tela deverá ser inserido aqui: <br>
        Mostrar o <code>DashboardAdminPage.js</code> listando os pacientes com % de sucesso verde/amarelo.
      </div>

      <h3>2. Celular: Visão do Paciente (UX)</h3>
      <div class="img-placeholder">
        📱 O print desta tela deverá ser inserido aqui: <br>
        Tirar um Print num Mobile do App instalado (PWA). Deve exibir o Card "Check-in Realizado" com a microanimação ativa e as métricas de XP/Streak no painel.
      </div>
    `
  },
  {
    slug: 'evolucao-futura',
    title: 'Evolução Futura (Rumo a Microservices)',
    html: `
      <p>Este sistema nasceu sobre <strong>DDD (Domain-Driven Design)</strong> e <strong>Clean Architecture</strong>. Isso significa que evoluir esta aplicação no futuro é puramente "plugar cabos diferentes", sem reescrever o código de negócios.</p>

      <div class="alert alert-info">
        <div class="alert-icon">✨</div>
        <div>
          <div class="alert-title">De GAS para AWS Serverless / Node.js</div>
          As Entities (<code>Paciente.js</code>), Value Objects (<code>UUID.js</code>) e UseCases (<code>LoginUseCase.js</code>) NÃO possuem nenhuma dependência do Google Sheets (Zero Lock-in).
        </div>
      </div>

      <h3>Como será a próxima migração:</h3>
      <ol class="step-list">
        <li class="step-item">
          <strong>Database Level Up:</strong> Trocaremos o <code>GoogleSheetsPacienteRepository</code> por um <code>PostgreSQLPacienteRepository</code>. Apenas cria-se um arquivo novo. O restante do sistema nem saberá que a base de dados mudou, pois a <em>Interface de Repositório</em> será mantida (Graças à Injeção de Dependências - IoC Container).
        </li>
        <li class="step-item">
          <strong>Backend Express / Nest.js:</strong> Substituiremos o <code>GasController.js</code> por uma rota Express.js no Node puro. Todos os UseCases migram de Ctrl+C e Ctrl+V, pois são JavaScript Universal.
        </li>
        <li class="step-item">
          <strong>Frontend Agnostic:</strong> O <code>ApiClient.js</code> no frontend trocará o base_url do GAS para <code>https://api.clinica.com</code>. Nenhuma linha de CSS ou Componente HTML precisará ser regravada.
        </li>
      </ol>

      <p>Você está preparado para atingir milhões de check-ins diários com tranquilidade no futuro. <strong>Boa sorte e bom Go-Live!</strong></p>
    `
  }
];
