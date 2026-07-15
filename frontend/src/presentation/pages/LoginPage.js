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
      <div class="split-screen">
        <!-- Visual Art Side (Desktop Only) -->
        <div class="split-screen-visual">
          <div class="visual-shape"></div>
          <div style="position: relative; z-index: 10; text-align: center; color: white;">
            <h2 style="font-size: 2.5rem; font-weight: 300; margin-bottom: 16px;">Clinical Tracking</h2>
            <p style="font-weight: 300; opacity: 0.9; font-size: 1.1rem; max-width: 300px; margin: 0 auto;">
              O luxo de uma saúde integrativa, conectada e baseada em precisão científica.
            </p>
          </div>
        </div>

        <!-- Form Side -->
        <div class="split-screen-content">
          <div style="width: 100%; max-width: 400px;">
            <header style="margin-bottom: var(--space-6); text-align: left;">
              <h1 class="text-h1">Acolhimento Clínico</h1>
              <p class="text-p">Seu espaço de evolução e cuidado integrativo.</p>
            </header>

            <main>
              <form id="login-form">
                <div class="form-group">
                  <label for="email" class="form-label">E-mail corporativo ou paciente</label>
                  <input type="email" id="email" class="form-input" required placeholder="nome@email.com" autocomplete="email">
                </div>

                <div class="form-group" style="margin-bottom: var(--space-6);">
                  <label for="password" class="form-label">Sua senha de acesso</label>
                  <input type="password" id="password" class="form-input" required placeholder="••••••••" autocomplete="current-password">
                </div>

                <div id="login-error-msg" class="alert alert-error hidden"></div>

                <button type="submit" class="btn btn-primary" id="btn-login-submit" style="width: 100%;">
                  <span class="btn-text">Acessar meu tratamento</span>
                  <span class="btn-spinner spinner hidden"></span>
                </button>
              </form>
            </main>

            <footer style="margin-top: var(--space-8); text-align: center;">
              <button id="btn-config-url" class="btn btn-outline" style="font-size: var(--text-xs); padding: 8px 16px;">
                Configurações de Conexão (GAS)
              </button>
            </footer>
          </div>
        </div>

        <!-- URL Configuration Modal (Card Style) -->
        <div id="config-modal" class="hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999;">
          <div class="card" style="max-width: 400px; width: 90%;">
            <h3 class="text-h1" style="font-size: var(--text-xl);">Endpoint da API</h3>
            <p class="text-p">Insira a URL de execução do seu Google Apps Script:</p>
            <input type="url" id="input-gas-url" class="form-input" style="margin-bottom: var(--space-4);" placeholder="https://script.google.com/macros/s/.../exec">
            <div style="display: flex; gap: var(--space-3); justify-content: flex-end;">
              <button id="btn-close-modal" class="btn btn-outline">Cancelar</button>
              <button id="btn-save-url" class="btn btn-success">Salvar</button>
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
