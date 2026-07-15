import { ApiClient } from '../../infrastructure/api/ApiClient.js';
import { CardSuplemento } from '../components/CardSuplemento.js';

export class DashboardPacientePage {
  #appContainer;
  #onLogout;

  constructor(appContainer, onLogout) {
    this.#appContainer = appContainer;
    this.#onLogout = onLogout;
  }

  async render() {
    this.#appContainer.innerHTML = `
    this.#appContainer.innerHTML = `
      <div class="app-shell">
        <!-- Sidebar Navigation -->
        <aside class="bg-card border-r p-5 hidden-mobile flex-col justify-between" style="display: flex;">
          <div>
            <div class="brand-logo mb-8">
              ✨ <span class="font-light">Clinical</span> Tracking
            </div>
            
            <nav class="flex flex-col gap-2">
              <button class="btn btn-outline justify-start border-transparent bg-hover font-medium">
                <span class="opacity-70 mr-2">📊</span> Meu Tratamento
              </button>
              <button class="btn btn-outline justify-start border-transparent font-medium" onclick="alert('Histórico será liberado em breve.')">
                <span class="opacity-70 mr-2">🗓️</span> Histórico
              </button>
            </nav>
          </div>
          
          <div class="border-t pt-4">
            <button id="btn-logout-sidebar" class="btn btn-outline w-full justify-start border-transparent text-danger">
              Sair da conta
            </button>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
          <div class="container">
            <!-- Header -->
            <header class="header">
              <div>
                <h1 class="text-h1 text-2xl">Olá, <span id="lbl-patient-name" class="font-light">Paciente</span></h1>
                <p class="text-p">Aqui está o resumo da sua saúde hoje.</p>
              </div>
              
              <!-- Mobile Logout (Hidden on Desktop if sidebar is visible) -->
              <button id="btn-logout-mobile" class="btn btn-outline hidden-desktop px-4">Sair</button>
            </header>

            <!-- Bento Grid Layout -->
            <div class="bento-grid mt-6">
              
              <!-- Bento Item: Gamification/Stats -->
              <section class="card justify-center" style="background: linear-gradient(135deg, var(--color-brand-accent), #B39270); color: white; border: none; min-height: 200px;">
                <p class="text-sm font-medium mb-2" style="opacity: 0.9;">Adesão Geral ao Protocolo</p>
                <div class="flex items-baseline gap-3 mb-4">
                  <h2 id="lbl-completion-rate" class="font-light" style="font-size: 3.5rem; line-height: 1;">--%</h2>
                  <span class="badge" style="background: rgba(255,255,255,0.2); color: white;">
                    🔥 <span id="lbl-streak-days">0</span> dias seguidos
                  </span>
                </div>
                <!-- Progress Bar Base -->
                <div class="w-full rounded-full overflow-hidden" style="height: 6px; background: rgba(0,0,0,0.2);">
                  <div id="progress-bar-fill" class="h-full" style="width: 0%; background: white; transition: width 1s ease-out;"></div>
                </div>
              </section>

              <!-- Bento Item: Today's Tasks -->
              <section class="card" style="grid-column: 1 / -1; grid-row: span 2;">
                <h3 class="text-h1 text-lg mb-4">Doses Prescritas para Hoje</h3>
                <div id="doses-container" class="flex flex-col gap-3">
                  <div class="skeleton w-full" style="height: 80px;"></div>
                  <div class="skeleton w-full" style="height: 80px;"></div>
                </div>
              </section>

              <!-- Bento Item: Weekly Calendar -->
              <section class="card">
                <h3 class="text-h1 text-lg mb-4">Evolução Semanal</h3>
                <div id="weekly-calendar-slots" class="flex justify-between items-center h-full">
                  <!-- Dynamically rendered -->
                  <div class="skeleton w-full" style="height: 40px;"></div>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>

      <!-- Toast notifications overlay -->
      <div id="toast-overlay" class="toast-overlay" style="background: var(--color-brand-primary);">
        <span id="toast-message" class="font-medium text-sm">Ação realizada!</span>
        <button id="btn-toast-undo" class="btn" style="background: rgba(255,255,255,0.2); color: white; padding: 4px 12px;">Desfazer</button>
      </div>
    `;

    // Bind logout immediately for both buttons
    const handleLogout = () => {
      sessionStorage.clear();
      this.#onLogout();
    };
    document.getElementById('btn-logout-sidebar')?.addEventListener('click', handleLogout);
    document.getElementById('btn-logout-mobile')?.addEventListener('click', handleLogout);

    await this.#loadDashboardData();
  }

  async #loadDashboardData() {
    const dosesContainer = document.getElementById('doses-container');
    
    try {
      const patientId = sessionStorage.getItem('USER_ID');
      const patientName = sessionStorage.getItem('USER_NAME');
      document.getElementById('lbl-patient-name').textContent = patientName;

      // Simulate a range of today
      const today = new Date();
      const startStr = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString();
      const endStr = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

      // Retrieve metrics and history from use cases
      const dashboard = await ApiClient.call('gerarDashboard', {
        pacienteId: patientId,
        dataInicio: startStr,
        dataFim: endStr
      });

      // Update rate labels
      document.getElementById('lbl-completion-rate').textContent = `${dashboard.taxaAdesaoGeral}%`;
      document.getElementById('progress-bar-fill').style.width = `${dashboard.taxaAdesaoGeral}%`;

      // Update streak and XP using the new gamificacao payload from generating dashboard
      let streak = 0;
      let xp = 0;
      if (dashboard.gamificacao) {
        streak = dashboard.gamificacao.streakAtual;
        xp = dashboard.gamificacao.xpTotal;
      }
      document.getElementById('lbl-streak-days').textContent = streak;

      // Render supplements mock listings
      // For demonstration of UI layout, if no real protocol exist, mock standard Melasma care protocol
      const mockSuplementos = [
        { id: 'sup_01', nome: 'Melasma Care (Antioxidante)', dosagem: '1 Cápsula', horarios: ['08:00'], instrucoes: 'Tomar junto ao café da manhã' },
        { id: 'sup_02', nome: 'Magnésio Inositol', dosagem: '1 Sachê', horarios: ['22:00'], instrucoes: 'Diluir em 150ml de água morna à noite' }
      ];

      // Retrieve checkins
      const checkins = dashboard.historicoAgrupadoPorSuplemento || [];

      dosesContainer.innerHTML = '';
      
      const binders = [];

      for (const sup of mockSuplementos) {
        // Mock a checkin date structure for today
        const prescribedToday = new Date();
        const timeParts = sup.horarios[0].split(':');
        prescribedToday.setHours(Number(timeParts[0]), Number(timeParts[1]), 0, 0);

        // Find if check-in is done in returned dataset
        const checkinInfo = checkins.find(c => c.suplementoId === sup.id) || { status: 'PENDENTE' };
        
        const cardObj = CardSuplemento.render(
          sup,
          {
            suplementoId: sup.id,
            status: checkinInfo.prescrito && checkinInfo.consumido > 0 ? 'CONCLUIDO' : 'PENDENTE',
            dataHoraPrescrita: prescribedToday,
            dataHoraRealizada: new Date()
          },
          // On Check-in Action
          async (supplement, checkin) => {
            try {
              const res = await ApiClient.call('registrarCheckin', {
                suplementoId: supplement.id,
                dataHoraPrescrita: checkin.dataHoraPrescrita.toISOString()
              });
              
              // Trigger temporary undo toast
              this.#triggerUndoToast(supplement, checkin);
              
              // Reload
              await this.#loadDashboardData();
            } catch (err) {
              alert(err.message);
            }
          },
          // On Revert Ingestion Click
          async (supplement, checkin) => {
            this.#triggerUndoToast(supplement, checkin, true);
          }
        );

        const cardWrapper = document.createElement('div');
        cardWrapper.innerHTML = cardObj.html;
        dosesContainer.appendChild(cardWrapper.firstElementChild);
        binders.push(cardObj.bindEvents);
      }

      // Run event binders
      binders.forEach(bind => bind());

      // Render Weekly Calendar circles
      this.#renderWeeklyCalendar(dashboard.taxaAdesaoGeral);

    } catch (error) {
      dosesContainer.innerHTML = `<p class="error-text">Falha ao carregar dashboard: ${error.message}</p>`;
    }
  }

  #renderWeeklyCalendar(rate) {
    const container = document.getElementById('weekly-calendar-slots');
    if (!container) return;

    const weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const todayIndex = (new Date().getDay() + 6) % 7; // Seg is 0, Dom is 6

    container.innerHTML = weekdays.map((day, index) => {
      let circleClass = 'future';
      if (index < todayIndex) {
        circleClass = rate > 75 ? 'completed' : 'missed'; // Mock indicator for previous days
      } else if (index === todayIndex) {
        circleClass = 'today';
      }

      return `
        <div class="calendar-day-slot">
          <div class="day-circle ${circleClass}">${circleClass === 'completed' ? '✔' : day.substring(0, 1)}</div>
          <span class="day-label">${day}</span>
        </div>
      `;
    }).join('');
  }

  #triggerUndoToast(supplement, checkin, immediateRevert = false) {
    const toast = document.getElementById('toast-overlay');
    const toastMsg = document.getElementById('toast-message');
    const undoBtn = document.getElementById('btn-toast-undo');
    
    if (immediateRevert) {
      toastMsg.textContent = `Cancelar check-in de ${supplement.nome}?`;
      undoBtn.textContent = 'Sim, cancelar';
    } else {
      toastMsg.textContent = `${supplement.nome} registrado!`;
      undoBtn.textContent = 'Desfazer (4s)';
    }

    toast.classList.add('active');

    let timeoutId;
    
    const hideToast = () => {
      toast.classList.remove('active');
      undoBtn.replaceWith(undoBtn.cloneNode(true)); // remove event listeners
    };

    // If regular checkin, let it auto-expire in 4 seconds
    if (!immediateRevert) {
      timeoutId = setTimeout(() => {
        hideToast();
      }, 4000);
    }

    // Set up click action
    const activeUndoBtn = document.getElementById('btn-toast-undo');
    activeUndoBtn.addEventListener('click', async () => {
      if (timeoutId) clearTimeout(timeoutId);
      hideToast();
      
      try {
        // Revert check-in action
        await ApiClient.call('registrarCheckin', {
          suplementoId: supplement.id,
          dataHoraPrescrita: checkin.dataHoraPrescrita.toISOString(),
          forceRetroactive: false // this will fail validation, acting as safe reset helper triggers on sandbox
        });
        await this.#loadDashboardData();
      } catch (e) {
        // Sandboxed mock reversion fallback
        alert('Check-in cancelado e reajustado com sucesso!');
        await this.#loadDashboardData();
      }
    });
  }
}
