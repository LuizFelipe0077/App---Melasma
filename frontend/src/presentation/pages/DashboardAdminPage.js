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
        <aside style="background-color: var(--color-surface-card); border-right: 1px solid var(--color-border-subtle); padding: var(--space-5); display: flex; flex-direction: column; justify-content: space-between;" class="hidden-mobile">
          <div>
            <div class="brand-logo" style="margin-bottom: var(--space-8);">
              ✨ <span style="font-weight: 300;">Clinical</span> Admin
            </div>
            
            <nav style="display: flex; flex-direction: column; gap: var(--space-2);">
              <a href="#" class="btn btn-outline" style="justify-content: flex-start; border-color: transparent; background: var(--color-surface-hover); font-weight: 500;">
                <span style="opacity: 0.7; margin-right: 8px;">👥</span> Pacientes Ativos
              </a>
              <a href="#" class="btn btn-outline" style="justify-content: flex-start; border-color: transparent; font-weight: 500;">
                <span style="opacity: 0.7; margin-right: 8px;">⚙️</span> Configurações (GAS)
              </a>
            </nav>
          </div>
          
          <div style="border-top: 1px solid var(--color-border-subtle); padding-top: var(--space-4);">
            <button id="btn-admin-logout-sidebar" class="btn btn-outline" style="width: 100%; border-color: transparent; justify-content: flex-start; color: var(--color-brand-danger);">
              Encerrar Sessão
            </button>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
          <div class="container" style="max-width: 1400px;">
            <!-- Header -->
            <header class="header" style="border: none; padding-bottom: 0;">
              <div>
                <h1 class="text-h1" style="font-size: var(--text-2xl);">Painel de Monitoramento Clínico</h1>
                <p class="text-p">Gestão de adesão e cadastros de pacientes do consultório.</p>
              </div>
              
              <div style="display: flex; gap: var(--space-3);">
                <button id="btn-open-register-modal" class="btn btn-primary">
                  <span style="font-size: 1.2rem;">+</span> Novo Paciente
                </button>
                <button id="btn-admin-logout-mobile" class="btn btn-outline hidden-desktop" style="padding: 8px 16px;">Sair</button>
              </div>
            </header>

            <!-- High Density Stats -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-4); margin-top: var(--space-6); margin-bottom: var(--space-6);">
              
              <div class="card" id="filter-abandon" style="cursor: pointer; border-left: 4px solid var(--color-brand-danger);">
                <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: 8px;">Alerta de Abandono (<60%)</p>
                <h3 class="stat-num" style="font-size: var(--text-3xl); font-weight: 600; color: var(--color-brand-danger);">--</h3>
              </div>

              <div class="card" id="filter-excellent" style="cursor: pointer; border-left: 4px solid var(--color-brand-success);">
                <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: 8px;">Adesão Excelente (>90%)</p>
                <h3 class="stat-num" style="font-size: var(--text-3xl); font-weight: 600; color: var(--color-brand-success);">--</h3>
              </div>

              <div class="card" id="stat-total" style="border-left: 4px solid var(--color-brand-primary);">
                <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: 8px;">Total de Pacientes Ativos</p>
                <h3 class="stat-num" style="font-size: var(--text-3xl); font-weight: 600; color: var(--color-text-primary);">--</h3>
              </div>

            </div>

            <!-- Patient Data Table (High Density) -->
            <section class="card" style="padding: 0; overflow: hidden;">
              <div style="padding: var(--space-4) var(--space-5); border-bottom: 1px solid var(--color-border-subtle); display: flex; justify-content: space-between; align-items: center; background: var(--color-surface-base);">
                <h3 class="text-h1" style="font-size: var(--text-lg); margin: 0;">Lista de Acompanhamento</h3>
                <input type="text" id="input-search-patient" class="form-input" style="max-width: 300px; padding: 8px 12px; font-size: var(--text-sm);" placeholder="Buscar por nome ou email...">
              </div>
              
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: var(--text-sm);">
                  <thead style="background-color: var(--color-surface-hover); border-bottom: 1px solid var(--color-border-subtle);">
                    <tr>
                      <th style="padding: 12px 24px; font-weight: 500; color: var(--color-text-secondary);">Paciente / Contato</th>
                      <th style="padding: 12px 24px; font-weight: 500; color: var(--color-text-secondary);">Taxa de Adesão</th>
                      <th style="padding: 12px 24px; font-weight: 500; color: var(--color-text-secondary); text-align: right;">Ações de Controle</th>
                    </tr>
                  </thead>
                  <tbody id="patient-list-tbody">
                    <!-- Loaded dynamically -->
                    <tr><td colspan="3" style="padding: 24px; text-align: center;"><div class="skeleton" style="height: 20px; width: 100%;"></div></td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>

        <!-- Register Paciente Modal (Card Overlay) -->
        <div id="register-modal" class="hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
          <div class="card" style="max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;">
            <h3 class="text-h1" style="font-size: var(--text-xl); margin-bottom: var(--space-2);">Cadastrar Novo Paciente</h3>
            <p class="text-p" style="margin-bottom: var(--space-5);">Preencha os dados básicos para gerar as credenciais de acesso do paciente.</p>
            
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
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
                <div class="form-group">
                  <label for="reg-datainicio" class="form-label">Início do Protocolo</label>
                  <input type="date" id="reg-datainicio" class="form-input" required>
                </div>
                <div class="form-group">
                  <label for="reg-datafim" class="form-label">Fim (Previsão)</label>
                  <input type="date" id="reg-datafim" class="form-input" required>
                </div>
              </div>

              <div style="display: flex; gap: var(--space-3); justify-content: flex-end; margin-top: var(--space-4);">
                <button type="button" id="btn-close-register" class="btn btn-outline">Cancelar</button>
                <button type="submit" class="btn btn-primary">Confirmar Cadastro</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Concede Retroactive Release Modal -->
        <div id="release-modal" class="hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
          <div class="card" style="max-width: 500px; width: 90%;">
            <h3 class="text-h1" style="font-size: var(--text-xl);">Liberar Edição Retroativa</h3>
            <p class="text-p">Conceder autorização temporária para o paciente preencher check-ins antigos que esqueceu de registrar.</p>
            
            <form id="release-form">
              <input type="hidden" id="release-patient-id">
              <div class="form-group">
                <label for="release-hours" class="form-label">Janela de Liberação (Em horas)</label>
                <input type="number" id="release-hours" class="form-input" min="1" max="72" value="24" required>
              </div>
              <div class="form-group" style="margin-bottom: var(--space-5);">
                <label for="release-reason" class="form-label">Justificativa Clínica/Operacional</label>
                <textarea id="release-reason" class="form-input" minlength="10" required placeholder="Ex: Paciente esqueceu de registrar o consumo do suplemento matinal ontem." style="min-height: 80px; resize: vertical;"></textarea>
              </div>
              
              <div style="display: flex; gap: var(--space-3); justify-content: flex-end;">
                <button type="button" id="btn-close-release" class="btn btn-outline">Cancelar</button>
                <button type="submit" class="btn btn-success">Autorizar Liberação</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    `;

    this.#setupAdminListeners();
    await this.#loadPatientsList();
  }

  #setupAdminListeners() {
    document.getElementById('btn-admin-logout').addEventListener('click', () => {
      sessionStorage.clear();
      this.#onLogout();
    });

    const regModal = document.getElementById('register-modal');
    const openRegBtn = document.getElementById('btn-open-register-modal');
    const closeRegBtn = document.getElementById('btn-close-register');
    const regForm = document.getElementById('register-patient-form');

    openRegBtn.addEventListener('click', () => {
      regModal.classList.remove('hidden');
    });

    closeRegBtn.addEventListener('click', () => {
      regModal.classList.add('hidden');
      regForm.reset();
    });

    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('reg-nome').value;
      const email = document.getElementById('reg-email').value;
      const telefone = document.getElementById('reg-telefone').value;
      const dataInicio = new Date(document.getElementById('reg-datainicio').value).toISOString();
      const dataFim = new Date(document.getElementById('reg-datafim').value).toISOString();

      try {
        const res = await ApiClient.call('criarPaciente', {
          nome,
          email,
          telefone,
          dataInicio,
          dataFim
        });

        alert(`Paciente cadastrado com sucesso!\nSenha Temporária gerada: ${res.senhaTemporaria}`);
        regModal.classList.add('hidden');
        regForm.reset();
        await this.#loadPatientsList();
      } catch (err) {
        alert(`Erro ao cadastrar: ${err.message}`);
      }
    });

    // Release Modal handlers
    const releaseModal = document.getElementById('release-modal');
    const closeReleaseBtn = document.getElementById('btn-close-release');
    const releaseForm = document.getElementById('release-form');

    closeReleaseBtn.addEventListener('click', () => {
      releaseModal.classList.add('hidden');
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
        releaseModal.classList.add('hidden');
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
          document.getElementById('release-modal').classList.remove('hidden');
        });
      });

      tbody.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', (e) => {
          const pId = row.getAttribute('data-id');
          // Extensible: click loads detailed patient reports in an admin modal view
          alert(`Carregando relatório clínico de evolução do paciente ID: ${pId}`);
        });
      });

    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="3" class="error-text">Erro ao ler lista: ${err.message}</td></tr>`;
    }
  }
}
