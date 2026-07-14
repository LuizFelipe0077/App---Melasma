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
      <div class="admin-wrapper">
        <header class="admin-header">
          <div class="admin-profile">
            <h2>Painel do Clínico</h2>
            <p>Gerenciamento e monitoramento de adesão clínica</p>
          </div>
          <button id="btn-admin-logout" class="btn-logout">Sair</button>
        </header>

        <section class="admin-stats">
          <div class="stat-box clickable" id="filter-abandon">
            <span class="stat-num color-danger">--</span>
            <span class="stat-desc">Alerta Abandono</span>
          </div>
          <div class="stat-box clickable" id="filter-excellent">
            <span class="stat-num color-success">--</span>
            <span class="stat-desc">Adesão Excelente</span>
          </div>
          <div class="stat-box" id="stat-total">
            <span class="stat-num">--</span>
            <span class="stat-desc">Pacientes Ativos</span>
          </div>
        </section>

        <section class="admin-actions">
          <button id="btn-open-register-modal" class="btn-primary-admin">+ Cadastrar Novo Paciente</button>
        </section>

        <section class="patient-list-section card">
          <div class="section-header">
            <h3>Lista de Acompanhamento</h3>
            <input type="text" id="input-search-patient" placeholder="Buscar paciente por nome...">
          </div>
          <div class="patient-table-wrapper">
            <table class="patient-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Adesão</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody id="patient-list-tbody">
                <!-- Loaded dynamically -->
              </tbody>
            </table>
          </div>
        </section>

        <!-- Register Paciente Modal -->
        <div id="register-modal" class="modal hidden">
          <div class="modal-content">
            <h3>Cadastrar Novo Paciente</h3>
            <form id="register-patient-form">
              <div class="form-group">
                <label for="reg-nome">Nome Completo</label>
                <input type="text" id="reg-nome" required placeholder="Ex: Mariana Costa">
              </div>
              <div class="form-group">
                <label for="reg-email">E-mail</label>
                <input type="email" id="reg-email" required placeholder="Ex: mariana@email.com">
              </div>
              <div class="form-group">
                <label for="reg-telefone">Telefone</label>
                <input type="tel" id="reg-telefone" required placeholder="Ex: (11) 99999-9999">
              </div>
              <div class="form-group">
                <label for="reg-datainicio">Data Início do Protocolo</label>
                <input type="date" id="reg-datainicio" required>
              </div>
              <div class="form-group">
                <label for="reg-datafim">Data Fim do Protocolo</label>
                <input type="date" id="reg-datafim" required>
              </div>
              <div class="modal-buttons">
                <button type="button" id="btn-close-register" class="btn-secondary">Cancelar</button>
                <button type="submit" class="btn-success">Confirmar Cadastro</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Concede Retroactive Release Modal -->
        <div id="release-modal" class="modal hidden">
          <div class="modal-content">
            <h3>Liberar Edição Retroativa</h3>
            <p>Conceder autorização temporária para preencher check-ins antigos.</p>
            <form id="release-form">
              <input type="hidden" id="release-patient-id">
              <div class="form-group">
                <label for="release-hours">Horas de Janela de Liberação</label>
                <input type="number" id="release-hours" min="1" max="72" value="24" required>
              </div>
              <div class="form-group">
                <label for="release-reason">Justificativa Clínica/Operacional</label>
                <textarea id="release-reason" minlength="10" required placeholder="Ex: Paciente esqueceu de registrar o consumo do Detox matinal durante viagem."></textarea>
              </div>
              <div class="modal-buttons">
                <button type="button" id="btn-close-release" class="btn-secondary">Cancelar</button>
                <button type="submit" class="btn-success">Conceder Liberação</button>
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
      // Mock patient database fetch for administrative views
      // Under backend sheets implementation, readAllRows gets all patient data
      const mockPatients = [
        { id: 'usr_001', nome: 'Mariana Costa', email: 'mariana@email.com', rate: 94 },
        { id: 'usr_002', nome: 'Ana Julia Paiva', email: 'anajulia@email.com', rate: 52 },
        { id: 'usr_003', nome: 'Carla Souza', email: 'carla@email.com', rate: 88 }
      ];

      // Update counters
      document.querySelector('#filter-abandon .stat-num').textContent = mockPatients.filter(p => p.rate < 60).length;
      document.querySelector('#filter-excellent .stat-num').textContent = mockPatients.filter(p => p.rate >= 90).length;
      document.getElementById('stat-total').querySelector('.stat-num').textContent = mockPatients.length;

      tbody.innerHTML = mockPatients.map(p => {
        const rateClass = p.rate >= 90 ? 'text-success' : (p.rate < 60 ? 'text-danger' : 'text-warning');
        return `
          <tr data-id="${p.id}">
            <td class="patient-name-cell">
              <span class="patient-name">${p.nome}</span>
              <span class="patient-email">${p.email}</span>
            </td>
            <td><strong class="${rateClass}">${p.rate}%</strong></td>
            <td>
              <button class="btn-table-action btn-release-trigger" data-id="${p.id}">Liberar Retroativo</button>
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
