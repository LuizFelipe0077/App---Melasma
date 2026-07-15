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
          <div class="card modal-content" style="max-width: 500px;">
            <h3 class="text-h1 text-xl mb-2">Cadastrar Novo Paciente</h3>
            <p class="text-p mb-5">Preencha os dados básicos para gerar as credenciais de acesso do paciente.</p>
            
            <form id="register-patient-form">
              <div class="form-group">
                <label for="reg-nome" class="form-label">Nome Completo</label>
                <input type="text" id="reg-nome" class="form-input" required placeholder="Ex: Mariana Costa">
              </div>
              <div class="form-group">
                <label for="reg-email" class="form-label">E-mail (Login)</label>
                <input type="email" id="reg-email" class="form-input" required placeholder="Ex: mariana@email.com">
              </div>
              <div class="form-group">
                <label for="reg-telefone" class="form-label">WhatsApp</label>
                <input type="tel" id="reg-telefone" class="form-input" required placeholder="Ex: (11) 99999-9999">
              </div>
              <div class="form-group">
                <label for="reg-senha" class="form-label">Senha de Acesso (Manual)</label>
                <input type="password" id="reg-senha" class="form-input" required placeholder="Ex: Maria@2026">
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="reg-datainicio" class="form-label">Início do Protocolo</label>
                  <input type="date" id="reg-datainicio" class="form-input" required>
                </div>
                <div class="form-group">
                  <label for="reg-datafim" class="form-label">Fim (Previsão)</label>
                  <input type="date" id="reg-datafim" class="form-input" required>
                </div>
              </div>

              <div class="flex gap-3 justify-end mt-4">
                <button type="button" id="btn-close-register" class="btn btn-outline">Cancelar</button>
                <button type="submit" class="btn btn-primary">Confirmar Cadastro</button>
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

    openRegBtn.addEventListener('click', () => {
      regModal.classList.add('active');
    });

    closeRegBtn.addEventListener('click', () => {
      regModal.classList.remove('active');
      regForm.reset();
    });

    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('reg-nome').value;
      const email = document.getElementById('reg-email').value;
      const telefone = document.getElementById('reg-telefone').value;
      const senha = document.getElementById('reg-senha').value;
      const dataInicio = new Date(document.getElementById('reg-datainicio').value).toISOString();
      const dataFim = new Date(document.getElementById('reg-datafim').value).toISOString();

      try {
        await ApiClient.call('criarPaciente', {
          nome,
          email,
          telefone,
          senha,
          dataInicio,
          dataFim
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
