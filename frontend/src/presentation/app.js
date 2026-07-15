/**
 * app.js
 * SPA Coordinator for Clinical Integrative Tracking.
 * Orchestrates views (Login, Patient Dashboard, Admin Panel) and manages session state.
 * 
 * Performance: Uses dynamic import() for lazy-loading authenticated pages,
 * reducing initial bundle by ~15KB (ADR-027).
 */
class App {
  #appContainer;
  #currentPage = null;

  constructor() {
    this.#appContainer = document.getElementById('app');
  }

  initialize() {
    // Register Service Worker for PWA (Offline shell caching)
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      });
    }

    // Listen for auth expiration events from ApiClient
    window.addEventListener('app:authExpired', () => {
      sessionStorage.clear();
      this.route();
    });

    this.route();
  }

  async route() {
    const token = sessionStorage.getItem('JWT_TOKEN');
    const role = sessionStorage.getItem('USER_ROLE');

    // Lifecycle: destroy previous page to prevent memory leaks (listeners, timers)
    if (this.#currentPage && typeof this.#currentPage.destroy === 'function') {
      this.#currentPage.destroy();
    }
    this.#currentPage = null;

    // Remove the skeleton loader before rendering the dynamic view
    this.#appContainer.innerHTML = '';

    if (!token || !role) {
      // Login page is small (~5KB), import eagerly is acceptable
      const { LoginPage } = await import('./pages/LoginPage.js');
      const loginPage = new LoginPage(this.#appContainer, (resolvedRole) => {
        this.route();
      });
      this.#currentPage = loginPage;
      loginPage.render();
      return;
    }

    if (role === 'ADMIN') {
      // Lazy-load Admin Dashboard only when needed (~10KB saved on patient path)
      const { DashboardAdminPage } = await import('./pages/DashboardAdminPage.js');
      const adminDash = new DashboardAdminPage(this.#appContainer, () => {
        this.route();
      });
      this.#currentPage = adminDash;
      adminDash.render();
    } else if (role === 'PACIENTE') {
      // Lazy-load Patient Dashboard only when needed (~9KB saved on login path)
      const { DashboardPacientePage } = await import('./pages/DashboardPacientePage.js');
      const patientDash = new DashboardPacientePage(this.#appContainer, () => {
        this.route();
      });
      this.#currentPage = patientDash;
      patientDash.render();
    } else {
      // Unrecognized role fallback reset
      sessionStorage.clear();
      this.route();
    }
  }
}

// Instantiate and start the app on DOM Load
window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.initialize();
});
