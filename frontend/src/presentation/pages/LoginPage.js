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
      <div class="split-screen bg-base">
        <!-- Visual Art Side (Desktop Only) -->
        <div class="split-screen-visual hidden lg:flex">
          <div class="visual-shape"></div>
          <div class="relative text-center flex flex-col items-center justify-center px-6" style="z-index: 10; width: 100%;">
            <h2 class="text-4xl font-light mb-4 text-primary" style="letter-spacing: -0.02em;">Clinical Tracking</h2>
            <p class="font-light text-lg text-secondary" style="max-width: 320px; line-height: 1.6;">
              O luxo de uma saúde integrativa, conectada e baseada em precisão científica.
            </p>
          </div>
        </div>

        <!-- Form Side -->
        <div class="split-screen-content">
          <div class="w-full" style="max-width: 400px;">
            <header class="mb-8 text-left">
              <h1 class="text-h1">Acolhimento Clínico</h1>
              <p class="text-p text-secondary">Seu espaço de evolução e cuidado integrativo.</p>
            </header>

            <main>
              <form id="login-form">
                <div class="form-group mb-6">
                  <label for="email" class="form-label">E-mail corporativo ou paciente</label>
                  <input type="email" id="email" class="form-input" required placeholder="nome@email.com" autocomplete="email">
                </div>

                <div class="form-group mb-8">
                  <label for="password" class="form-label">Sua senha de acesso</label>
                  <input type="password" id="password" class="form-input" required placeholder="••••••••" autocomplete="current-password">
                </div>

                <div id="login-error-msg" class="alert alert-error hidden mb-6"></div>

                <button type="submit" class="btn btn-primary w-full" id="btn-login-submit">
                  <span class="btn-text">Entrar no Tratamento</span>
                  <span class="btn-spinner spinner hidden"></span>
                </button>
              </form>
            </main>

            <footer class="mt-8 text-center">
              <button id="btn-config-url" class="btn btn-outline" style="padding: 8px 16px;">
                <span class="text-xs">⚙️ Configurações de Conexão (GAS)</span>
              </button>
            </footer>
          </div>
        </div>

        <!-- URL Configuration Modal (Premium Glassmorphism) -->
        <div id="config-modal" class="modal-overlay">
          <div class="card modal-content">
            <h3 class="text-h1 text-xl mb-2">Endpoint da API</h3>
            <p class="text-p mb-6">Insira a URL de execução do seu Google Apps Script:</p>
            <input type="url" id="input-gas-url" class="form-input mb-6" placeholder="https://script.google.com/macros/s/.../exec">
            <div class="flex justify-end gap-3">
              <button id="btn-close-modal" class="btn btn-outline">Cancelar</button>
              <button id="btn-save-url" class="btn btn-success">Salvar Conexão</button>
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
      modal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    saveUrlBtn.addEventListener('click', () => {
      const url = urlInput.value.trim();
      if (url.startsWith('https://script.google.com/')) {
        ApiClient.setApiBaseUrl(url);
        modal.classList.remove('active');
        alert('Endpoint configurado com sucesso!');
      } else {
        alert('URL inválida. Deve iniciar com https://script.google.com/');
      }
    });
  }
}
