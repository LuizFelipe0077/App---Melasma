window.contentPart1 = [
  {
    slug: 'visao-geral',
    title: 'Visão Geral & Arquitetura',
    html: `
      <p>Bem-vindo ao <strong>Deployment & Operations Handbook</strong>. Este manual é o guia definitivo para implantar, manter e escalar a aplicação de Tracking Clínico.</p>
      
      <div class="alert alert-info">
        <div class="alert-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        <div>
          <div class="alert-title">Arquitetura Serverless de Baixo Custo (V1.0)</div>
          A versão atual foi arquitetada para máxima economia, utilizando o ecossistema Google Workspace (Google Sheets + Apps Script) como backend, e GitHub Pages como host estático para o Frontend SPA.
        </div>
      </div>

      <h2>Topologia da Aplicação</h2>
      <p>A arquitetura opera em um modelo estritamente desacoplado, permitindo que a camada visual (Frontend) evolua independentemente do Banco de Dados (Backend).</p>

      <div class="mermaid">
      graph TD
        A[Usuário/Paciente] -->|Acessa App via Web/PWA| B(GitHub Pages)
        B -->|Carrega SPA JavaScript| C{App no Navegador}
        C -->|Requisições HTTP POST| D[Google Apps Script]
        D -->|Processa Lógica Clean Arch| E[Google Sheets]
        
        style B fill:#1e293b,stroke:#64748b,color:#fff
        style D fill:#4f46e5,stroke:#4338ca,color:#fff
        style E fill:#16a34a,stroke:#15803d,color:#fff
      </div>

      <h2>As 3 Camadas</h2>
      <ul>
        <li><strong>Frontend (GitHub Pages):</strong> Interface HTML/CSS/JS nativa. Roteamento via Hash, consumindo API via requisições POST.</li>
        <li><strong>Backend Controller (Google Apps Script):</strong> Funciona como um gateway e processador. É <em>stateless</em>, ou seja, não guarda dados, delegando isso ao banco. Usa <code>CacheService</code> para rate-limiting.</li>
        <li><strong>Database (Google Sheets):</strong> Armazenamento persistente dividido em abas. É a fonte única da verdade (Single Source of Truth).</li>
      </ul>
    `
  },
  {
    slug: 'estrutura-projeto',
    title: 'Estrutura do Repositório',
    html: `
      <p>O repositório é monorepo, contendo tanto o frontend quanto o backend em pastas separadas. Conhecer essa estrutura é vital para o deploy.</p>

      <pre><code class="language-bash">ANTIGRAVITY/
├── backend/                  # Código Fonte do Servidor (Apps Script)
│   ├── src/
│   │   ├── application/      # Casos de Uso (Regras de Aplicação)
│   │   ├── domain/           # Entidades e Value Objects
│   │   ├── infrastructure/   # Controladores, Repositórios Sheets
│   │   └── shared/           # Configurações Globais (CORS, JWT)
│   ├── appsscript.json       # Manifesto de deploy do Google
│   └── package.json          # Dependências dev (linting, tests)
│
├── frontend/                 # Código Fonte da Interface Web
│   ├── src/
│   │   ├── infrastructure/   # Chamadas de API (ApiClient.js)
│   │   ├── presentation/     # UI, Componentes e Estilos
│   │   └── app.js            # Entry-point (Roteador)
│   ├── index.html            # Arquivo principal que carrega a SPA
│   └── package.json          # Server de desenvolvimento local
│
└── Documentação/             # Este e outros manuais do sistema</code></pre>

      <div class="alert alert-warn">
        <div class="alert-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <div>
          <div class="alert-title">Nunca misture os pacotes</div>
          O <code>package.json</code> do backend é independente do frontend. Ao realizar instalações, certifique-se de estar na pasta correta via terminal.
        </div>
      </div>
    `
  },
  {
    slug: 'google-sheets',
    title: 'Criando o Google Sheets',
    html: `
      <p>O Google Sheets serve como Banco de Dados Relacional. As abas são as tabelas. As colunas, os atributos.</p>
      
      <h3>1. Criação Inicial</h3>
      <ol class="step-list">
        <li class="step-item">Acesse <a href="https://sheets.google.com" target="_blank">sheets.google.com</a> logado com a conta administradora da clínica.</li>
        <li class="step-item">Crie uma nova planilha em branco e nomeie-a como <strong>Clinical Tracker DB - PROD</strong>.</li>
        <li class="step-item">Copie o ID da Planilha que fica na URL: <code>https://docs.google.com/spreadsheets/d/<b>SEU_SPREADSHEET_ID</b>/edit</code>. Guarde este ID, você precisará dele depois.</li>
      </ol>

      <h3>2. Criando as Abas (Tabelas)</h3>
      <p>O sistema exige exatamente estas abas (nomeie exatamente assim, sensível a maiúsculas):</p>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Aba</th>
            <th>Cabeçalho da Coluna A</th>
            <th>Coluna B</th>
            <th>Coluna C</th>
            <th>Coluna D</th>
            <th>Coluna E</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Pacientes</strong></td>
            <td>id</td>
            <td>nome</td>
            <td>email</td>
            <td>telefone</td>
            <td>senhaHash</td>
          </tr>
          <tr>
            <td><strong>Protocolos</strong></td>
            <td>id</td>
            <td>pacienteId</td>
            <td>dataInicio</td>
            <td>dataFim</td>
            <td>-</td>
          </tr>
          <tr>
            <td><strong>Suplementos</strong></td>
            <td>id</td>
            <td>protocoloId</td>
            <td>nome</td>
            <td>dosagem</td>
            <td>horarios</td>
          </tr>
          <tr>
            <td><strong>Checkins</strong></td>
            <td>id</td>
            <td>pacienteId</td>
            <td>suplementoId</td>
            <td>dataHoraPrescrita</td>
            <td>dataHoraRealizada</td>
          </tr>
        </tbody>
      </table>

      <div class="alert alert-danger">
        <div class="alert-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <div>
          <div class="alert-title">Linha 1 Reservada</div>
          A linha 1 (linha de título) DEVE existir e conter os nomes exatos das colunas. O backend em Apps Script lê a partir da linha 2. Nunca deixe linhas em branco soltas no meio do banco de dados.
        </div>
      </div>
      
      <h3>3. Compartilhamento e Proteção</h3>
      <p>A planilha NÃO deve ser pública. O compartilhamento deve ficar como "Restrito". O Apps Script roda sob a autoridade do desenvolvedor que fez o deploy e consegue acessar a planilha privadamente.</p>
    `
  },
  {
    slug: 'configurar-apps-script',
    title: 'Configurando Google Apps Script',
    html: `
      <p>O Google Apps Script (GAS) é o servidor que irá ler e gravar no Google Sheets, e expor a API via Web App.</p>

      <h3>1. Inicialização do Projeto Google</h3>
      <ol class="step-list">
        <li class="step-item">Abra o Google Drive, vá em Novo > Mais > Google Apps Script. (Se não tiver, clique em "Conectar mais aplicativos" e busque "Google Apps Script").</li>
        <li class="step-item">Nomeie o projeto como <strong>Clinical Backend API</strong>.</li>
        <li class="step-item">Vá em "Configurações do Projeto" (ícone de engrenagem na barra esquerda).</li>
        <li class="step-item">Marque a caixa: <strong>"Mostrar o arquivo appsscript.json no editor"</strong>.</li>
      </ol>

      <h3>2. Configuração de Propriedades de Script (PropertiesService)</h3>
      <p>Ainda na aba de configurações do projeto, desça até a seção <strong>Propriedades do script</strong> e adicione as chaves criptografadas (variáveis de ambiente do servidor):</p>

      <pre><code class="language-json">DATABASE_SPREADSHEET_ID = [ID_COPIADO_NO_CAP_3]
JWT_SECRET = [GERAR_UMA_CHAVE_ALEATORIA_SEGURA]
ADMIN_EMAIL = [SEU_EMAIL_DE_ACESSO_AO_PAINEL]
ADMIN_PASS_HASH = [HASH_BCRYPT_GERADO_VIA_SCRIPTS_LOCAIS]</code></pre>

      <div class="alert alert-info">
        <div class="alert-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        <div>
          <div class="alert-title">Segurança de JWT e Senha</div>
          As senhas NÃO devem ser guardadas em texto puro aqui. Gere o hash <code>ADMIN_PASS_HASH</code> rodando o script utilitário local <code>node scratch/generate_hash.js</code> no repositório.
        </div>
      </div>
    `
  },
  {
    slug: 'deploy-backend',
    title: 'Subindo TODO o Backend',
    html: `
      <p>Não iremos copiar e colar arquivo por arquivo no editor web do Google. Usaremos a ferramenta de linha de comando oficial (CLI) do Google: o <strong>clasp</strong>.</p>
      
      <h3>1. Instalando Dependências</h3>
      <p>No seu terminal local (VS Code), certifique-se de que o Node.js está instalado e rode:</p>
      <pre><code class="language-bash">npm install -g @google/clasp</code></pre>

      <h3>2. Autenticação no Clasp</h3>
      <p>Para o clasp se comunicar com seu Google Drive, efetue login:</p>
      <pre><code class="language-bash">clasp login</code></pre>
      <p>O navegador irá abrir. Logue com a mesma conta onde você criou o Apps Script. Permita os acessos solicitados.</p>

      <h3>3. Vinculando o Repositório ao Projeto GAS</h3>
      <p>Navegue até a pasta do backend e vincule ao Script ID (que você encontra na aba Configurações no site do Google Apps Script):</p>
      <pre><code class="language-bash">cd backend/
clasp clone &lt;SEU_SCRIPT_ID&gt;</code></pre>

      <h3>4. Enviando o Código</h3>
      <p>O comando `push` envia todos os arquivos da máquina local para a nuvem da Google:</p>
      <pre><code class="language-bash">clasp push</code></pre>
      <p>Vá até o editor online do Apps Script, atualize a página, e verá dezenas de arquivos estruturados e organizados. Seu código backend inteiro foi enviado!</p>
    `
  },
  {
    slug: 'permissoes',
    title: 'Configurando Permissões e IAM',
    html: `
      <p>Para que o Web App (API) funcione via requisições do frontend, o fluxo de permissões de execução é fundamental.</p>

      <h3>Identidades e Execução</h3>
      <ul>
        <li><strong>Nível de Banco:</strong> O Google Sheets pertence a VOCÊ.</li>
        <li><strong>Nível de Servidor:</strong> O Apps Script é executado sob a SUA autoridade (Execute As: Me).</li>
        <li><strong>Nível de Cliente:</strong> O paciente ou admin usando a página web no celular.</li>
      </ul>

      <p>O Google Apps Script cria uma ponte. Quando o Paciente acessa, o Apps Script intercepta o request público e o executa localmente disfarçado de você, para escrever na sua planilha.</p>
      
      <div class="alert alert-warn">
        <div class="alert-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
        </div>
        <div>
          <div class="alert-title">Não exponha o Spreadsheet</div>
          Por isso, <strong>jamais</strong> compartilhe publicamente o Google Sheets. A API Web App exposta na próxima etapa será o único funil de dados, protegido por CORS, JWT e arquitetura limpa.
        </div>
      </div>
    `
  },
  {
    slug: 'publicando-apps-script',
    title: 'Publicando o Web App (API)',
    html: `
      <p>Este é o passo mais crítico. O Apps Script deve ser publicado como <strong>Web App</strong> para escutar requisições <code>POST</code> do frontend.</p>

      <h3>Passo a Passo de Deploy Oficial</h3>
      <ol class="step-list">
        <li class="step-item">No editor online do Apps Script, clique no botão azul <strong>"Implantar"</strong> (Deploy) no canto superior direito.</li>
        <li class="step-item">Selecione <strong>"Nova implantação"</strong> (New Deployment).</li>
        <li class="step-item">No ícone de engrenagem "Selecionar tipo", escolha <strong>Aplicativo da Web</strong>.</li>
        <li class="step-item">Preencha os dados criticamente:
          <ul>
            <li><strong>Descrição:</strong> V1.0 Produção</li>
            <li><strong>Executar como:</strong> <code>Eu (seu_email@gmail.com)</code> <em>(CRÍTICO: não selecione 'Usuário que acessa o web app')</em></li>
            <li><strong>Quem pode acessar:</strong> <code>Qualquer pessoa</code> (A API não pode pedir login Google, nós usamos nosso JWT customizado).</li>
          </ul>
        </li>
        <li class="step-item">Clique em <strong>Implantar</strong>.</li>
        <li class="step-item">O Google pedirá para "Autorizar acessos". Prossiga, confirme o aviso de "App não verificado" (clique em Avançado > Acessar).</li>
      </ol>

      <h3>Obtendo a Endpoint URL</h3>
      <p>Após implantar, você receberá a <strong>URL do App da Web</strong>. Ela termina em <code>/exec</code>.</p>
      <pre><code>https://script.google.com/macros/s/AKfycb...XyZ/exec</code></pre>
      <p>Guarde esta URL! Ela é sua API.</p>
    `
  },
  {
    slug: 'configurar-github',
    title: 'Configurando o GitHub',
    html: `
      <p>O repositório do GitHub guardará seu código para evolução futura e, mais importante, hospedará sua página estática gratuitamente via <strong>GitHub Pages</strong>.</p>
      
      <h3>1. Inicialização do Repositório</h2>
      <pre><code class="language-bash">git init
git add .
git commit -m "feat: initial commit - Go Live Readiness"</code></pre>

      <h3>2. Criando o Repo no GitHub</h3>
      <p>Acesse <a href="https://github.com/new" target="_blank">github.com/new</a>, nomeie seu repositório como <code>clinical-tracker</code> e coloque-o como Público (necessário para GitHub Pages free, embora possa ser privado se for Pro).</p>
      
      <h3>3. Vinculando (Push)</h3>
      <pre><code class="language-bash">git branch -M main
git remote add origin https://github.com/SEU_USER/clinical-tracker.git
git push -u origin main</code></pre>

      <p>Agora todo o código base está seguro e com controle de versão.</p>
    `
  },
  {
    slug: 'subir-frontend',
    title: 'Subindo e Hospedando o Frontend',
    html: `
      <p>Utilizaremos a funcionalidade nativa do GitHub para hospedar sites estáticos.</p>

      <h3>Ativando o GitHub Pages</h3>
      <ol class="step-list">
        <li class="step-item">Acesse o seu repositório no GitHub.</li>
        <li class="step-item">Vá em <strong>Settings</strong> > aba lateral <strong>Pages</strong>.</li>
        <li class="step-item">Sob "Build and deployment", selecione <strong>Deploy from a branch</strong>.</li>
        <li class="step-item">Na opção Branch, selecione a branch <code>main</code>, mas selecione o diretório <code>/frontend</code> (Nota: Se o GH Pages não permitir a subpasta, mude a fonte do repositório para a raíz, ou utilize Github Actions para o deploy).
          <div class="alert alert-info">
            <div class="alert-icon">💡</div>
            <div>A melhor abordagem para Monorepos no GitHub Pages estático livre é configurar um GitHub Action simples que copia a pasta `frontend` para uma branch `gh-pages`. O arquivo <code>.github/workflows/deploy.yml</code> do projeto já cuida disso automatizado!</div>
          </div>
        </li>
      </ol>

      <p>Após alguns minutos, a URL pública estará disponível em algo como <code>https://SEU_USER.github.io/clinical-tracker/</code>.</p>
    `
  },
  {
    slug: 'ligando-front-back',
    title: 'Ligando Frontend ao Backend (CORS & Endpoints)',
    html: `
      <p>A aplicação não funcionará até que o Frontend saiba quem é o Backend. Precisamos injetar a URL do Apps Script obtida no <a href="#publicando-apps-script">Capítulo 7</a>.</p>

      <h3>Atualizando o Endpoint</h3>
      <p>Localize o arquivo de comunicação da API no projeto local e altere a constante da URL.</p>
      <pre><code class="language-javascript">// frontend/src/infrastructure/api/ApiClient.js
const API_URL = 'COLE_AQUI_A_SUA_URL_DO_APPS_SCRIPT_QUE_TERMINA_EM_/exec';</code></pre>
      
      <h3>Atualizando o Deployment</h3>
      <p>Como fizemos uma alteração em código local do Frontend, precisamos commitar e enviar para o Github.</p>
      <pre><code class="language-bash">git add frontend/src/infrastructure/api/ApiClient.js
git commit -m "chore: connect frontend to prod backend"
git push origin main</code></pre>
      
      <p>O GitHub Pages será recompilado em minutos (via Actions). Quando terminar, seu Frontend oficial já estará "conversando" online com seu Backend no Google!</p>
    `
  }
];
