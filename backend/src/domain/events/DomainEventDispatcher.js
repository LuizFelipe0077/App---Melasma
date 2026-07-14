/**
 * DomainEventDispatcher.js
 * In-memory publisher/subscriber for decoupling domain actions from collateral effects (such as emails or logging).
 */
export class DomainEventDispatcher {
  #handlers = new Map();

  register(eventName, handler) {
    if (!this.#handlers.has(eventName)) {
      this.#handlers.set(eventName, []);
    }
    this.#handlers.get(eventName).push(handler);
  }

  dispatch(event) {
    const eventName = event.constructor.name;
    if (this.#handlers.has(eventName)) {
      const handlers = this.#handlers.get(eventName);
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (error) {
          // Prevent side-effect exceptions from breaking the main transaction flow
          if (typeof console !== 'undefined') {
            console.error(`Erro ao processar evento de domínio [${eventName}]:`, error);
          }
        }
      }
    }
  }

  clear() {
    this.#handlers.clear();
  }
}

// Global default singleton instance
export const eventDispatcher = new DomainEventDispatcher();
