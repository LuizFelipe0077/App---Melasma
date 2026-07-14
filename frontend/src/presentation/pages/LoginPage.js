import { ApiClient } from '../../infrastructure/api/ApiClient.js';

export class LoginPage {
  #appContainer;
  #onLoginSuccess;

  constructor(appContainer, onLoginSuccess) {
    this.#appContainer = appContainer;
    this.#onLoginSuccess = onLoginSuccess;
  }

  render() {
    this.#appContainer.innerHTML = `
      <div class="login-wrapper">
        <header class="login-header">
          <div class="login-logo">✨</div>
          <h1>Acolhimento Clínico</h1>
          <p>Seu espaço de evolução e cuidado integrativo</p>
        </header>

        <main class="login-card">
          <form id="login-form">
            <div class="form-group">
              <label for="email">Seu E-mail</label>
              <input type="email" id="email" required placeholder="exemplo@email.com" autocomplete="email">
            </div>

            <div class="form-group">
              <label for="password">Sua Senha</label>
              <input type="password" id="password" required placeholder="Digite sua senha de acesso" autocomplete="current-password">
            </div>

            <div id="login-error-msg" class="error-alert hidden"></div>

            <button type="submit" class="btn-primary" id="btn-login-submit">
              <span class="btn-text">Entrar no Tratamento</span>
              <span class="btn-spinner hidden"></span>
            </button>
          </form>
        </main>

        <footer class="login-footer">
          <button id="btn-config-url" class="btn-link">Configurar Endpoint da Planilha (GAS)</button>
        </footer>

        <!-- URL Configuration Modal -->
        <div id="config-modal" class="modal hidden">
          <div class="modal-content">
            <h3>Configurar WebApp Endpoint</h3>
            <p>Insira a URL de execução do seu Google Apps Script:</p>
            <input type="url" id="input-gas-url" placeholder="https://script.google.com/macros/s/.../exec">
            <div class="modal-buttons">
              <button id="btn-close-modal" class="btn-secondary">Cancelar</button>
              <button id="btn-save-url" class="btn-success">Salvar Configuração</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.#setupListeners();
  }

  #setupListeners() {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('login-error-msg');
    const btnSubmit = document.getElementById('btn-login-submit');
    const btnText = btnSubmit.querySelector('.btn-text');
    const btnSpinner = btnSubmit.querySelector('.btn-spinner');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Loading state
      errorMsg.classList.add('hidden');
      btnSubmit.disabled = true;
      btnText.textContent = 'Autenticando...';
      btnSpinner.classList.remove('hidden');

      try {
        const result = await ApiClient.call('login', {
          email: emailInput.value,
          senha: passwordInput.value
        });

        // Store session variables
        sessionStorage.setItem('JWT_TOKEN', result.token);
        sessionStorage.setItem('USER_ROLE', result.role);
        sessionStorage.setItem('USER_ID', result.userId);
        sessionStorage.setItem('USER_NAME', result.nome);

        // Redirect/Navigate
        this.#onLoginSuccess(result.role);
      } catch (err) {
        errorMsg.textContent = err.message || 'Falha de conexão. Tente novamente.';
        errorMsg.classList.remove('hidden');
        
        // Haptic feedback simulation on login fail
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } finally {
        btnSubmit.disabled = false;
        btnText.textContent = 'Entrar no Tratamento';
        btnSpinner.classList.add('hidden');
      }
    });

    // Configuration Modal Event Listeners
    const configBtn = document.getElementById('btn-config-url');
    const modal = document.getElementById('config-modal');
    const closeModalBtn = document.getElementById('btn-close-modal');
    const saveUrlBtn = document.getElementById('btn-save-url');
    const urlInput = document.getElementById('input-gas-url');

    configBtn.addEventListener('click', () => {
      urlInput.value = localStorage.getItem('API_BASE_URL') || '';
      modal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    saveUrlBtn.addEventListener('click', () => {
      const url = urlInput.value.trim();
      if (url.startsWith('https://script.google.com/')) {
        ApiClient.setApiBaseUrl(url);
        modal.classList.add('hidden');
        alert('Endpoint configurado com sucesso!');
      } else {
        alert('URL inválida. Deve iniciar com https://script.google.com/');
      }
    });
  }
}
