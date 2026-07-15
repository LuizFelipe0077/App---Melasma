import { ApiClient } from '../../infrastructure/api/ApiClient.js';

export class DashboardAdminPage {
  #appContainer;
  #onLogout;

  constructor(appContainer, onLogout) {
    this.#appContainer = appContainer;
    this.#onLogout = onLogout;
  }

  async render() {
    this.#appContainer.innerHTML = `
      <div class="app-shell">
        <!-- Sidebar Navigation (Admin) -->
        <aside class="bg-card border-r p-5 hidden-mobile flex-col justify-between" style="display: flex;">
          <div>
            <div class="brand-logo mb-8">
              ✨ <span class="font-light">Clinical</span> Admin
            </div>
            
            <nav class="flex flex-col gap-2">
              <button class="btn btn-outline justify-start border-transparent bg-hover font-medium">
                <span class="opacity-70 mr-2">👥</span> Pacientes Ativos
              </button>
              <button id="btn-admin-config" class="btn btn-outline justify-start border-transparent font-medium">
                <span class="opacity-70 mr-2">⚙️</span> Configurações (GAS)
              </button>
            </nav>
          </div>
          
          <div class="border-t pt-4">
            <button id="btn-admin-logout-sidebar" class="btn btn-outline w-full justify-start border-transparent text-danger">
              Encerrar Sessão
            </button>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
          <div class="container">
            <!-- Header -->
            <header class="header">
              <div>
                <h1 class="text-h1 text-2xl">Painel de Monitoramento Clínico</h1>
                <p class="text-p">Gestão de adesão e cadastros de pacientes do consultório.</p>
              </div>
              
              <div class="flex gap-3">
                <button id="btn-open-register-modal" class="btn btn-primary">
                  <span class="text-xl leading-none">+</span> Novo Paciente
                </button>
                <button id="btn-admin-logout-mobile" class="btn btn-outline hidden-desktop px-4">Sair</button>
              </div>
            </header>

            <!-- High Density Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6">
              
              <div class="card cursor-pointer card-stat" id="filter-abandon" style="--stat-color: var(--color-brand-danger);">
                <p class="text-sm text-secondary mb-2">Alerta de Abandono (<60%)</p>
                <h3 class="stat-num text-3xl font-semibold text-danger">--</h3>
              </div>

              <div class="card cursor-pointer card-stat" id="filter-excellent" style="--stat-color: var(--color-brand-success);">
                <p class="text-sm text-secondary mb-2">Adesão Excelente (>90%)</p>
                <h3 class="stat-num text-3xl font-semibold text-success">--</h3>
              </div>

              <div class="card card-stat" id="stat-total" style="--stat-color: var(--color-brand-primary);">
                <p class="text-sm text-secondary mb-2">Total de Pacientes Ativos</p>
                <h3 class="stat-num text-3xl font-semibold text-primary">--</h3>
              </div>

            </div>

            <!-- Patient Data Table (High Density) -->
            <section class="card p-0 overflow-hidden">
              <div class="p-4 px-5 border-b flex justify-between items-center bg-base">
                <h3 class="text-h1 text-lg m-0">Lista de Acompanhamento</h3>
                <input type="text" id="input-search-patient" class="form-input" style="max-width: 300px; padding: 8px 12px;" placeholder="Buscar por nome ou email...">
              </div>
              
              <div class="table-wrapper border-transparent rounded-none">
                <table>
                  <thead class="bg-hover">
                    <tr>
                      <th>Paciente / Contato</th>
                      <th>Taxa de Adesão</th>
                      <th class="text-right">Ações de Controle</th>
                    </tr>
                  </thead>
                  <tbody id="patient-list-tbody">
                    <!-- Loaded dynamically -->
                    <tr><td colspan="3" class="text-center p-6"><div class="skeleton w-full" style="height: 20px;"></div></td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>

        <!-- Register Paciente Modal -->
        <div id="register-modal" class="modal-overlay">
          <div class="card modal-content" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-h1 text-xl" id="wizard-title">Cadastrar Novo Paciente (Etapa 1/5)</h3>
              <span class="text-xs font-semibold px-2 py-1 rounded bg-hover" id="wizard-progress-badge" style="color: var(--color-text-primary);">20%</span>
            </div>
            
            <form id="register-patient-form">
              <!-- Etapa 1: Dados Pessoais -->
              <div id="step-1-container" class="wizard-step-container">
                <h4 class="font-semibold text-sm mb-3 text-secondary">Etapa 1: Dados Pessoais & Acesso</h4>
                <div class="form-group">
                  <label for="reg-nome" class="form-label">Nome Completo</label>
                  <input type="text" id="reg-nome" class="form-input" placeholder="Ex: Mariana Costa">
                </div>
                <div class="form-group">
                  <label for="reg-email" class="form-label">E-mail (Login)</label>
                  <input type="email" id="reg-email" class="form-input" placeholder="Ex: mariana@email.com">
                </div>
                <div class="form-group">
                  <label for="reg-telefone" class="form-label">WhatsApp</label>
                  <input type="tel" id="reg-telefone" class="form-input" placeholder="Ex: (11) 99999-9999">
                </div>
                <div class="form-group">
                  <label for="reg-senha" class="form-label">Senha de Acesso (Manual)</label>
                  <input type="password" id="reg-senha" class="form-input" placeholder="Ex: Maria@2026">
                </div>
                <div class="form-group">
                  <label for="reg-observacoes" class="form-label">Observações Administrativas (Opcional)</label>
                  <textarea id="reg-observacoes" class="form-input" style="min-height: 80px;" placeholder="Histórico clínico breve do paciente..."></textarea>
                </div>
              </div>

              <!-- Etapa 2: Protocolo -->
              <div id="step-2-container" class="wizard-step-container hidden">
                <h4 class="font-semibold text-sm mb-3 text-secondary">Etapa 2: Escolha do Protocolo Clínico</h4>
                <div class="form-group">
                  <label for="reg-protocolo" class="form-label">Protocolo Base</label>
                  <select id="reg-protocolo" class="form-input" style="background: rgba(0,0,0,0.2); border: 1px solid var(--color-border-strong); color: var(--color-text-primary);">
                    <option value="Melasma" style="background: var(--color-surface-base);">MELASMA (Identidade Luxuosa Terracota)</option>
                    <option value="Desinflamação" style="background: var(--color-surface-base);">DESINFLAMAÇÃO (Identidade Herbal Wellness)</option>
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="form-group">
                    <label for="reg-datainicio" class="form-label">Início do Tratamento</label>
                    <input type="date" id="reg-datainicio" class="form-input">
                  </div>
                  <div class="form-group">
                    <label for="reg-datafim" class="form-label">Fim (Previsão)</label>
                    <input type="date" id="reg-datafim" class="form-input">
                  </div>
                </div>
              </div>

              <!-- Etapa 3: Suplementação -->
              <div id="step-3-container" class="wizard-step-container hidden">
                <h4 class="font-semibold text-sm mb-3 text-secondary">Etapa 3: Prescrever Suplementos Customizados</h4>
                
                <!-- Sub-form to Add a Supplement -->
                <div class="card p-4 mb-4" style="background: rgba(0,0,0,0.15); border: 1px dashed var(--color-border-strong);">
                  <h5 class="font-semibold text-xs mb-2">Prescrever Novo Item</h5>
                  
                  <div class="grid grid-cols-2 gap-2 mb-2">
                    <div class="form-group m-0">
                      <label for="sup-nome" class="form-label">Nome do Suplemento</label>
                      <input type="text" id="sup-nome" class="form-input" placeholder="Ex: Vitamina C">
                    </div>
                    <div class="form-group m-0">
                      <label for="sup-dosagem" class="form-label">Dosagem</label>
                      <input type="text" id="sup-dosagem" class="form-input" placeholder="Ex: 500mg (1 cápsula)">
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2 mb-2">
                    <div class="form-group m-0">
                      <label for="sup-quantidade" class="form-label">Quantidade Prescrita</label>
                      <input type="number" id="sup-quantidade" class="form-input" value="1" min="1">
                    </div>
                    <div class="form-group m-0">
                      <label for="sup-tipo" class="form-label">Tipo</label>
                      <select id="sup-tipo" class="form-input" style="background: rgba(0,0,0,0.2); border: 1px solid var(--color-border-strong); color: var(--color-text-primary);">
                        <option value="Manipulado" style="background: var(--color-surface-base);">Manipulado</option>
                        <option value="Industrializado" style="background: var(--color-surface-base);">Industrializado</option>
                        <option value="Fitoterápico" style="background: var(--color-surface-base);">Fitoterápico</option>
                        <option value="Vitamina" style="background: var(--color-surface-base);">Vitamina</option>
                        <option value="Mineral" style="background: var(--color-surface-base);">Mineral</option>
                        <option value="Outro" style="background: var(--color-surface-base);">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group mb-2">
                    <label for="sup-horarios" class="form-label">Horários (Separados por vírgula)</label>
                    <input type="text" id="sup-horarios" class="form-input" placeholder="Ex: 08:00, 13:00, 22:00">
                  </div>

                  <div class="form-group mb-2">
                    <label for="sup-rep-preset" class="form-label">Regra de Repetição</label>
                    <select id="sup-rep-preset" class="form-input" style="background: rgba(0,0,0,0.2); border: 1px solid var(--color-border-strong); color: var(--color-text-primary);">
                      <option value="todos" style="background: var(--color-surface-base);">Todos os dias</option>
                      <option value="dias_alternados" style="background: var(--color-surface-base);">Dias alternados</option>
                      <option value="finais_de_semana" style="background: var(--color-surface-base);">Finais de semana</option>
                      <option value="Seg,Qua,Sex" style="background: var(--color-surface-base);">Segunda, Quarta e Sexta</option>
                      <option value="Ter,Qui" style="background: var(--color-surface-base);">Terça e Quinta</option>
                    </select>
                  </div>

                  <div class="form-group mb-3">
                    <label for="sup-instrucoes" class="form-label">Instruções de Uso (Observações)</label>
                    <input type="text" id="sup-instrucoes" class="form-input" placeholder="Ex: Tomar com estômago cheio">
                  </div>

                  <button type="button" id="btn-add-supplement-to-list" class="btn btn-primary w-full" style="padding: 10px 16px;">
                    ➕ Adicionar Item à Prescrição
                  </button>
                </div>

                <!-- Prescribed Items List -->
                <div class="border rounded p-3 bg-hover" style="border-color: var(--color-border-strong);">
                  <h5 class="font-semibold text-xs mb-2" style="color: var(--color-text-primary);">Itens Prescritos nesta Sessão:</h5>
                  <div id="wizard-supplements-list-container" class="flex flex-col gap-2">
                    <p class="text-xs text-tertiary text-center py-2" id="lbl-no-supplements">Nenhum suplemento adicionado ainda.</p>
                  </div>
                </div>
              </div>

              <!-- Etapa 4: Notificações -->
              <div id="step-4-container" class="wizard-step-container hidden">
                <h4 class="font-semibold text-sm mb-3 text-secondary">Etapa 4: Agendamento & Notificações</h4>
                <p class="text-xs text-tertiary mb-4">Escolha a regra de aviso no celular do paciente para as doses:</p>
                <div id="wizard-notifications-mapping-container" class="flex flex-col gap-3">
                  <!-- Generated dynamically based on supplements added in step 3 -->
                  <p class="text-xs text-tertiary text-center py-2">Adicione suplementos na etapa anterior primeiro.</p>
                </div>
              </div>

              <!-- Etapa 5: Resumo -->
              <div id="step-5-container" class="wizard-step-container hidden">
                <h4 class="font-semibold text-sm mb-3 text-secondary">Etapa 5: Confirmar Dados e Finalizar</h4>
                <div class="border rounded p-4 bg-hover mb-4" style="border-color: var(--color-border-strong); font-size: var(--text-sm); line-height: 1.6;">
                  <div class="mb-3">
                    <strong style="color: var(--color-text-primary);">Paciente:</strong> <span id="summary-nome">--</span><br>
                    <strong style="color: var(--color-text-primary);">Acesso:</strong> <span id="summary-email">--</span> (<span id="summary-telefone">--</span>)<br>
                    <strong style="color: var(--color-text-primary);">Protocolo:</strong> <span id="summary-protocolo">--</span> (<span id="summary-datas">--</span>)
                  </div>
                  <div class="border-t pt-3" style="border-color: var(--color-border-subtle);">
                    <strong style="color: var(--color-text-primary);">Suplementos Prescritos:</strong>
                    <ul id="summary-supplements-ul" class="list-disc pl-5 mt-1 flex flex-col gap-1 text-xs">
                      <li>Nenhum item adicionado.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Navigation Controls -->
              <div class="flex gap-3 justify-between mt-6">
                <button type="button" id="btn-wizard-prev" class="btn btn-outline hidden">Voltar</button>
                <button type="button" id="btn-close-register" class="btn btn-outline">Cancelar</button>
                
                <div class="flex gap-2">
                  <button type="button" id="btn-wizard-next" class="btn btn-primary">Avançar</button>
                  <button type="submit" id="btn-wizard-submit" class="btn btn-success hidden">Confirmar e Salvar</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Concede Retroactive Release Modal -->
        <div id="release-modal" class="modal-overlay">
          <div class="card modal-content" style="max-width: 500px;">
            <h3 class="text-h1 text-xl">Liberar Edição Retroativa</h3>
            <p class="text-p">Conceder autorização temporária para o paciente preencher check-ins antigos que esqueceu de registrar.</p>
            
            <form id="release-form">
              <input type="hidden" id="release-patient-id">
              <div class="form-group">
                <label for="release-hours" class="form-label">Janela de Liberação (Em horas)</label>
                <input type="number" id="release-hours" class="form-input" min="1" max="72" value="24" required>
              </div>
              <div class="form-group mb-5">
                <label for="release-reason" class="form-label">Justificativa Clínica/Operacional</label>
                <textarea id="release-reason" class="form-input" minlength="10" required placeholder="Ex: Paciente esqueceu de registrar o consumo do suplemento matinal ontem."></textarea>
              </div>
              
              <div class="flex gap-3 justify-end">
                <button type="button" id="btn-close-release" class="btn btn-outline">Cancelar</button>
                <button type="submit" class="btn btn-success">Autorizar Liberação</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Manage Patient Modal -->
        <div id="manage-patient-modal" class="modal-overlay">
          <div class="card modal-content" style="max-width: 500px; max-height: 90vh; overflow-y: auto;">
            <h3 class="text-h1 text-xl mb-2">Gerenciar Paciente</h3>
            <p class="text-p mb-5">Visualize, edite ou gerencie as informações da conta do paciente.</p>
            
            <form id="manage-patient-form">
              <input type="hidden" id="manage-id">
              
              <div class="form-group">
                <label for="manage-nome" class="form-label">Nome Completo</label>
                <input type="text" id="manage-nome" class="form-input" required>
              </div>
              <div class="form-group">
                <label for="manage-email" class="form-label">E-mail (Login)</label>
                <input type="email" id="manage-email" class="form-input" required>
              </div>
              <div class="form-group">
                <label for="manage-telefone" class="form-label">WhatsApp</label>
                <input type="tel" id="manage-telefone" class="form-input" required>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="manage-datainicio" class="form-label">Início do Protocolo</label>
                  <input type="date" id="manage-datainicio" class="form-input" required>
                </div>
                <div class="form-group">
                  <label for="manage-datafim" class="form-label">Fim (Previsão)</label>
                  <input type="date" id="manage-datafim" class="form-input" required>
                </div>
              </div>

              <div class="form-group">
                <label for="manage-status" class="form-label">Status da Conta</label>
                <select id="manage-status" class="form-input" style="background: rgba(0,0,0,0.2); border: 1px solid var(--color-border-strong); color: var(--color-text-primary);">
                  <option value="ATIVO" style="background: var(--color-surface-base);">ATIVO (Acesso liberado)</option>
                  <option value="INATIVO" style="background: var(--color-surface-base);">INATIVO (Acesso bloqueado)</option>
                </select>
              </div>

              <div class="border-t pt-4 mt-4" style="border-color: var(--color-border-subtle);">
                <h4 class="text-base font-semibold mb-2" style="color: var(--color-text-primary);">🔑 Segurança & Senha</h4>
                <div class="form-group mb-2">
                  <label class="form-label">Hash da Senha Atual</label>
                  <input type="text" id="manage-current-hash" class="form-input" readonly disabled style="opacity: 0.6;">
                </div>
                <div class="form-group">
                  <label for="manage-new-senha" class="form-label">Definir Nova Senha (Opcional)</label>
                  <input type="password" id="manage-new-senha" class="form-input" placeholder="Digite apenas se quiser alterar a senha">
                </div>
              </div>

              <div class="flex gap-3 justify-between mt-6">
                <button type="button" id="btn-delete-patient" class="btn btn-outline text-danger" style="border-color: var(--color-brand-danger);">Excluir Conta</button>
                <div class="flex gap-2">
                  <button type="button" id="btn-close-manage" class="btn btn-outline">Cancelar</button>
                  <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Toast notifications overlay -->
        <div id="toast-overlay" class="toast-overlay">
          <span id="toast-message" class="font-medium text-sm">Ação realizada!</span>
          <button id="btn-toast-undo" class="btn" style="background: rgba(255,255,255,0.2); padding: 4px 12px;">Desfazer</button>
        </div>

      </div>
    `;

    this.#setupAdminListeners();
    await this.#loadPatientsList();
  }

  #setupAdminListeners() {
    const handleLogout = () => {
      sessionStorage.clear();
      this.#onLogout();
    };

    document.getElementById('btn-admin-logout-sidebar')?.addEventListener('click', handleLogout);
    document.getElementById('btn-admin-logout-mobile')?.addEventListener('click', handleLogout);

    document.getElementById('btn-admin-config')?.addEventListener('click', () => {
      alert('Configurações do Google Apps Script serão integradas nesta área na próxima atualização.');
    });

    const regModal = document.getElementById('register-modal');
    const openRegBtn = document.getElementById('btn-open-register-modal');
    const closeRegBtn = document.getElementById('btn-close-register');
    const regForm = document.getElementById('register-patient-form');

    let currentStep = 1;
    let currentSuplementos = [];

    const updateWizard = () => {
      document.querySelectorAll('.wizard-step-container').forEach(el => el.classList.add('hidden'));
      document.getElementById(`step-${currentStep}-container`).classList.remove('hidden');
      
      const titleEl = document.getElementById('wizard-title');
      const badgeEl = document.getElementById('wizard-progress-badge');
      titleEl.textContent = `Cadastrar Novo Paciente (Etapa ${currentStep}/5)`;
      badgeEl.textContent = `${currentStep * 20}%`;

      const btnPrev = document.getElementById('btn-wizard-prev');
      const btnNext = document.getElementById('btn-wizard-next');
      const btnSubmit = document.getElementById('btn-wizard-submit');

      if (currentStep === 1) {
        btnPrev.classList.add('hidden');
        btnNext.classList.remove('hidden');
        btnSubmit.classList.add('hidden');
      } else if (currentStep === 5) {
        btnPrev.classList.remove('hidden');
        btnNext.classList.add('hidden');
        btnSubmit.classList.remove('hidden');
      } else {
        btnPrev.classList.remove('hidden');
        btnNext.classList.remove('hidden');
        btnSubmit.classList.add('hidden');
      }
    };

    const renderSupplementsList = () => {
      const container = document.getElementById('wizard-supplements-list-container');
      if (currentSuplementos.length === 0) {
        container.innerHTML = `<p class="text-xs text-tertiary text-center py-2" id="lbl-no-supplements">Nenhum suplemento adicionado ainda.</p>`;
        return;
      }

      container.innerHTML = currentSuplementos.map((s, idx) => `
        <div class="flex justify-between items-center bg-base p-2 rounded border animate-fade-in" style="border-color: var(--color-border-subtle); font-size: var(--text-xs); margin-bottom: 4px;">
          <div>
            <strong style="color: var(--color-text-primary);">${s.nome}</strong> - ${s.dosagem} (${s.quantidade} cáps)<br>
            <span class="text-secondary">Horários: ${s.horarios.join(', ')} | Repetição: ${s.diasSemana.join(', ')}</span>
          </div>
          <button type="button" class="btn btn-outline text-danger btn-remove-sup-wizard" data-idx="${idx}" style="padding: 4px 8px; font-size: 10px; border-color: rgba(239, 68, 68, 0.2);">Excluir</button>
        </div>
      `).join('');

      container.querySelectorAll('.btn-remove-sup-wizard').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(btn.getAttribute('data-idx'), 10);
          currentSuplementos.splice(index, 1);
          renderSupplementsList();
        });
      });
    };

    const btnAddSup = document.getElementById('btn-add-supplement-to-list');
    btnAddSup.addEventListener('click', () => {
      const nome = document.getElementById('sup-nome').value.trim();
      const dosagem = document.getElementById('sup-dosagem').value.trim();
      const quantidade = parseInt(document.getElementById('sup-quantidade').value, 10) || 1;
      const tipo = document.getElementById('sup-tipo').value;
      const horariosRaw = document.getElementById('sup-horarios').value.trim();
      const rep = document.getElementById('sup-rep-preset').value;
      const instrucoes = document.getElementById('sup-instrucoes').value.trim();

      if (!nome || !dosagem || !horariosRaw) {
        alert('Por favor, preencha Nome, Dosagem e Horários para adicionar.');
        return;
      }

      const horarios = horariosRaw.split(',').map(h => h.trim()).filter(h => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timeRegex.test(h);
      });

      if (horarios.length === 0) {
        alert('Horários inválidos. Use formato HH:MM (ex: 08:00, 20:00).');
        return;
      }

      const diasSemana = rep === 'todos' ? ['todos'] : rep.split(',');

      currentSuplementos.push({
        nome,
        dosagem,
        quantidade,
        tipo,
        horarios,
        diasSemana,
        instrucoes
      });

      document.getElementById('sup-nome').value = '';
      document.getElementById('sup-dosagem').value = '';
      document.getElementById('sup-quantidade').value = '1';
      document.getElementById('sup-horarios').value = '';
      document.getElementById('sup-instrucoes').value = '';

      renderSupplementsList();
    });

    const renderNotificationsStep = () => {
      const container = document.getElementById('wizard-notifications-mapping-container');
      if (currentSuplementos.length === 0) {
        container.innerHTML = `<p class="text-xs text-tertiary text-center py-2">Prescreva suplementos na etapa anterior primeiro.</p>`;
        return;
      }

      container.innerHTML = currentSuplementos.map((s, idx) => `
        <div class="flex flex-col gap-1 bg-base p-3 rounded border" style="border-color: var(--color-border-subtle); font-size: var(--text-xs);">
          <span style="font-weight: 600; color: var(--color-text-primary);">${s.nome} (${s.dosagem})</span>
          <div class="flex items-center gap-2">
            <label for="notif-select-${idx}" class="form-label m-0" style="font-size: 11px;">Notificação:</label>
            <select id="notif-select-${idx}" class="form-input" style="padding: 6px 12px; font-size: var(--text-xs); background: rgba(0,0,0,0.2); border: 1px solid var(--color-border-strong); color: var(--color-text-primary); flex: 1;">
              <option value="no_horario">No horário exato</option>
              <option value="5min_antes">5 minutos antes</option>
              <option value="15min_antes">15 minutos antes</option>
              <option value="30min_antes">30 minutos antes</option>
              <option value="5min_depois">5 minutos depois</option>
            </select>
          </div>
        </div>
      `).join('');
    };

    const renderSummaryStep = () => {
      document.getElementById('summary-nome').textContent = document.getElementById('reg-nome').value || '--';
      document.getElementById('summary-email').textContent = document.getElementById('reg-email').value || '--';
      document.getElementById('summary-telefone').textContent = document.getElementById('reg-telefone').value || '--';
      document.getElementById('summary-protocolo').textContent = document.getElementById('reg-protocolo').value || '--';
      
      const startVal = document.getElementById('reg-datainicio').value;
      const endVal = document.getElementById('reg-datafim').value;
      document.getElementById('summary-datas').textContent = `${startVal || '--'} a ${endVal || '--'}`;

      const ul = document.getElementById('summary-supplements-ul');
      if (currentSuplementos.length === 0) {
        ul.innerHTML = `<li>Nenhum suplemento adicionado.</li>`;
        return;
      }

      ul.innerHTML = currentSuplementos.map(s => `
        <li><strong>${s.nome}</strong>: ${s.dosagem} (${s.quantidade} cáps) nos horários [${s.horarios.join(', ')}] [Repetição: ${s.diasSemana.join(', ')}]</li>
      `).join('');
    };

    const btnNext = document.getElementById('btn-wizard-next');
    const btnPrev = document.getElementById('btn-wizard-prev');

    btnNext.addEventListener('click', () => {
      if (currentStep === 1) {
        const nome = document.getElementById('reg-nome').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const telefone = document.getElementById('reg-telefone').value.trim();
        const senha = document.getElementById('reg-senha').value.trim();

        if (!nome || !email || !telefone || !senha) {
          alert('Por favor, preencha todos os dados pessoais e de acesso.');
          return;
        }
      } else if (currentStep === 2) {
        const start = document.getElementById('reg-datainicio').value;
        const end = document.getElementById('reg-datafim').value;

        if (!start || !end) {
          alert('Por favor, selecione as datas de início e fim do tratamento.');
          return;
        }
        if (new Date(end) < new Date(start)) {
          alert('A data de fim não pode ser anterior à data de início.');
          return;
        }
      } else if (currentStep === 3) {
        if (currentSuplementos.length === 0) {
          alert('Adicione pelo menos um suplemento ao tratamento do paciente.');
          return;
        }
      }

      currentStep++;
      if (currentStep === 4) {
        renderNotificationsStep();
      } else if (currentStep === 5) {
        currentSuplementos.forEach((s, idx) => {
          const select = document.getElementById(`notif-select-${idx}`);
          if (select) {
            s.notificacao = select.value;
          }
        });
        renderSummaryStep();
      }

      updateWizard();
    });

    btnPrev.addEventListener('click', () => {
      currentStep--;
      updateWizard();
    });

    openRegBtn.addEventListener('click', () => {
      currentStep = 1;
      currentSuplementos = [];
      updateWizard();
      regModal.classList.add('active');
    });

    closeRegBtn.addEventListener('click', () => {
      regModal.classList.remove('active');
      regForm.reset();
      currentStep = 1;
      currentSuplementos = [];
      updateWizard();
    });

    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('reg-nome').value;
      const email = document.getElementById('reg-email').value;
      const telefone = document.getElementById('reg-telefone').value;
      const senha = document.getElementById('reg-senha').value;
      const observacoes = document.getElementById('reg-observacoes').value;
      const protocoloNome = document.getElementById('reg-protocolo').value;
      const dataInicio = new Date(document.getElementById('reg-datainicio').value).toISOString();
      const dataFim = new Date(document.getElementById('reg-datafim').value).toISOString();

      try {
        await ApiClient.call('criarPaciente', {
          nome,
          email,
          telefone,
          senha,
          dataInicio,
          dataFim,
          protocoloNome,
          observacoes,
          suplementos: currentSuplementos
        });

        alert(`Paciente cadastrado com sucesso!`);
        regModal.classList.remove('active');
        regForm.reset();
        await this.#loadPatientsList();
      } catch (err) {
        alert(`Erro ao cadastrar: ${err.message}`);
      }
    });

    // Manage Patient Modal handlers
    const manageModal = document.getElementById('manage-patient-modal');
    const manageForm = document.getElementById('manage-patient-form');
    const closeManageBtn = document.getElementById('btn-close-manage');
    const deletePatientBtn = document.getElementById('btn-delete-patient');

    closeManageBtn.addEventListener('click', () => {
      manageModal.classList.remove('active');
      manageForm.reset();
    });

    manageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pacienteId = document.getElementById('manage-id').value;
      const nome = document.getElementById('manage-nome').value;
      const email = document.getElementById('manage-email').value;
      const telefone = document.getElementById('manage-telefone').value;
      const status = document.getElementById('manage-status').value;
      const dataInicio = new Date(document.getElementById('manage-datainicio').value).toISOString();
      const dataFim = new Date(document.getElementById('manage-datafim').value).toISOString();
      const senha = document.getElementById('manage-new-senha').value;

      try {
        await ApiClient.call('editarPaciente', {
          pacienteId,
          nome,
          email,
          telefone,
          status,
          dataInicio,
          dataFim,
          senha: senha || null
        });

        alert('Paciente atualizado com sucesso!');
        manageModal.classList.remove('active');
        manageForm.reset();
        await this.#loadPatientsList();
      } catch (err) {
        alert(`Erro ao salvar alterações: ${err.message}`);
      }
    });

    deletePatientBtn.addEventListener('click', async () => {
      const pacienteId = document.getElementById('manage-id').value;
      const nome = document.getElementById('manage-nome').value;
      
      if (!confirm(`Tem certeza absoluta que deseja excluir permanentemente a conta de ${nome}?`)) {
        return;
      }

      try {
        await ApiClient.call('excluirPaciente', { pacienteId });
        alert('Paciente excluído com sucesso!');
        manageModal.classList.remove('active');
        manageForm.reset();
        await this.#loadPatientsList();
      } catch (err) {
        alert(`Erro ao excluir paciente: ${err.message}`);
      }
    });

    // Release Modal handlers
    const releaseModal = document.getElementById('release-modal');
    const closeReleaseBtn = document.getElementById('btn-close-release');
    const releaseForm = document.getElementById('release-form');

    closeReleaseBtn.addEventListener('click', () => {
      releaseModal.classList.remove('active');
      releaseForm.reset();
    });

    releaseForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pacienteId = document.getElementById('release-patient-id').value;
      const horasLiberadas = document.getElementById('release-hours').value;
      const motivo = document.getElementById('release-reason').value;

      try {
        await ApiClient.call('liberarEdicaoRetroativa', {
          pacienteId,
          horasLiberadas,
          motivo
        });

        alert('Permissão de edição retroativa concedida com sucesso!');
        releaseModal.classList.remove('active');
        releaseForm.reset();
      } catch (err) {
        alert(`Erro ao conceder liberação: ${err.message}`);
      }
    });

    // Search bar filter
    const searchInput = document.getElementById('input-search-patient');
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#patient-list-tbody tr');
      rows.forEach(row => {
        const name = row.querySelector('.patient-name').textContent.toLowerCase();
        if (name.includes(q)) {
          row.classList.remove('hidden');
        } else {
          row.classList.add('hidden');
        }
      });
    });
  }

  async #loadPatientsList() {
    const tbody = document.getElementById('patient-list-tbody');
    
    try {
      const livePatients = await ApiClient.call('listarPacientes');

      // Helper function for XSS sanitization
      const escapeHTML = (str) => {
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      };

      // Update counters
      document.querySelector('#filter-abandon .stat-num').textContent = livePatients.filter(p => p.rate < 60).length;
      document.querySelector('#filter-excellent .stat-num').textContent = livePatients.filter(p => p.rate >= 90).length;
      document.getElementById('stat-total').querySelector('.stat-num').textContent = livePatients.length;

      tbody.innerHTML = livePatients.map(p => {
        let badgeStyle = '';
        let badgeText = '';
        if (p.rate >= 90) {
          badgeStyle = 'background: rgba(143, 162, 148, 0.15); color: var(--color-brand-success);';
          badgeText = 'Excelente';
        } else if (p.rate < 60) {
          badgeStyle = 'background: rgba(239, 68, 68, 0.15); color: var(--color-brand-danger);';
          badgeText = 'Alerta';
        } else {
          badgeStyle = 'background: rgba(245, 158, 11, 0.15); color: var(--color-brand-warning);';
          badgeText = 'Regular';
        }

        return `
          <tr data-id="${escapeHTML(p.id)}" style="border-bottom: 1px solid var(--color-border-subtle); transition: background 0.2s; cursor: pointer;">
            <td style="padding: 16px 24px;">
              <div style="font-weight: 500; color: var(--color-text-primary);">${escapeHTML(p.nome)}</div>
              <div style="font-size: var(--text-xs); color: var(--color-text-tertiary);">${escapeHTML(p.email)}</div>
            </td>
            <td style="padding: 16px 24px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 600; color: var(--color-text-primary);">${p.rate}%</span>
                <span class="badge" style="${badgeStyle}">${badgeText}</span>
              </div>
            </td>
            <td style="padding: 16px 24px; text-align: right;">
              <button class="btn btn-outline btn-release-trigger" data-id="${escapeHTML(p.id)}" style="padding: 6px 12px; font-size: var(--text-xs);">Liberar Retroativo</button>
            </td>
          </tr>
        `;
      }).join('');

      // Bind dynamic actions
      tbody.querySelectorAll('.btn-release-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pId = e.target.getAttribute('data-id');
          document.getElementById('release-patient-id').value = pId;
          document.getElementById('release-modal').classList.add('active');
        });
      });

      tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', (e) => {
          const pId = row.getAttribute('data-id');
          const p = livePatients.find(item => item.id === pId);
          if (!p) return;

          document.getElementById('manage-id').value = p.id;
          document.getElementById('manage-nome').value = p.nome;
          document.getElementById('manage-email').value = p.email;
          document.getElementById('manage-telefone').value = p.telefone;
          document.getElementById('manage-datainicio').value = p.dataInicio;
          document.getElementById('manage-datafim').value = p.dataFim;
          document.getElementById('manage-status').value = p.status;
          document.getElementById('manage-current-hash').value = p.senhaHash;
          document.getElementById('manage-new-senha').value = ''; // clear

          document.getElementById('manage-patient-modal').classList.add('active');
        });
      });

    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="3" class="error-text">Erro ao ler lista: ${err.message}</td></tr>`;
    }
  }
}
