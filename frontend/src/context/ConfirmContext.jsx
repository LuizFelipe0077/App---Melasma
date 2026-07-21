import { createContext, useCallback, useContext, useRef, useState } from 'react';
import Modal from '../components/Modal.jsx';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback(({ title, description, confirmLabel = 'Confirmar', danger = false }) => {
    setState({ title, description, confirmLabel, danger });
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const handleClose = (result) => {
    setState(null);
    resolver.current?.(result);
    resolver.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal open={!!state} onClose={() => handleClose(false)} title={state?.title} description={state?.description}>
        <div className="flex gap-3 justify-end">
          <button className="btn btn-outline" onClick={() => handleClose(false)}>Cancelar</button>
          <button
            className={state?.danger ? 'btn btn-danger' : 'btn btn-primary'}
            onClick={() => handleClose(true)}
          >
            {state?.confirmLabel}
          </button>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}
