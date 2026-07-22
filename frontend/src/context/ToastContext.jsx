import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext(null);
let idSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(({ message, actionLabel, onAction, duration = 4000, tone = 'default' }) => {
    const id = ++idSeq;
    setToasts((prev) => [...prev, { id, message, actionLabel, onAction, tone }]);
    if (duration > 0) {
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    }
    return id;
  }, [dismiss]);

  const showError = useCallback((message) => {
    showToast({ message, duration: 5000, tone: 'error' });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showError, dismiss }}>
      {children}
      {createPortal(
        <div className="toast-stack">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                className="toast"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.25, ease: [0.34, 1.4, 0.64, 1] }}
                style={t.tone === 'error' ? { backgroundColor: 'var(--danger)' } : undefined}
              >
                <span>{t.message}</span>
                {t.actionLabel && (
                  <button
                    className="toast-action"
                    onClick={() => {
                      t.onAction?.();
                      dismiss(t.id);
                    }}
                  >
                    {t.actionLabel}
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
