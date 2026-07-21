import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import Sheet from '../components/Sheet.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const { setThemeClass } = useTheme();
  const { showToast, showError } = useToast();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [gasUrl, setGasUrl] = useState('');

  useEffect(() => {
    setThemeClass('');
  }, [setThemeClass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await ApiClient.call('login', { email, senha });
      login(result);
    } catch (err) {
      setError(err.message || 'Falha de conexão. Tente novamente.');
      if (navigator.vibrate) navigator.vibrate([90, 40, 90]);
    } finally {
      setLoading(false);
    }
  };

  const openConfig = () => {
    setGasUrl(localStorage.getItem('API_BASE_URL') || '');
    setConfigOpen(true);
  };

  const saveConfig = () => {
    if (ApiClient.setApiBaseUrl(gasUrl.trim())) {
      setConfigOpen(false);
      showToast({ message: 'Endpoint configurado.' });
    } else {
      showError('URL inválida — deve começar com https://script.google.com/');
    }
  };

  return (
    <div className="flex flex-col items-center" style={{ minHeight: '100dvh', justifyContent: 'center', padding: 'var(--space-5)' }}>
      <motion.div
        style={{ width: '100%', maxWidth: 400 }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center" style={{ marginBottom: 'var(--space-7)' }}>
          <div className="eyebrow" style={{ marginBottom: 'var(--space-3)' }}>Acompanhamento clínico integrativo</div>
          <h1 className="display-md">Bem-vinda de volta</h1>
        </div>

        <form onSubmit={handleSubmit} className="surface surface-pad">
          <div className="field">
            <label className="field-label" htmlFor="email">E-mail</label>
            <input
              id="email" type="email" className="field-input" required
              placeholder="nome@email.com" autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">Senha</label>
            <div className="flex" style={{ position: 'relative' }}>
              <input
                id="password" type={showPassword ? 'text' : 'password'} className="field-input" required
                placeholder="••••••••" autoComplete="current-password" style={{ paddingRight: 48 }}
                value={senha} onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Mostrar ou ocultar senha"
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <p className="field-error" role="alert">{error}</p>}

          <button type="submit" className="btn btn-fill w-full" disabled={loading} style={{ marginTop: 'var(--space-3)' }}>
            {loading ? <span className="spinner" /> : 'Entrar'}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: 'var(--space-6)' }}>
          <button className="btn-text" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={openConfig}>
            Configurações de conexão
          </button>
        </div>
      </motion.div>

      <Sheet open={configOpen} onClose={() => setConfigOpen(false)} title="Endpoint da API" description="URL de execução do Google Apps Script:">
        <input
          type="url" className="field-input" style={{ marginBottom: 'var(--space-5)' }}
          placeholder="https://script.google.com/macros/s/.../exec"
          value={gasUrl} onChange={(e) => setGasUrl(e.target.value)}
        />
        <div className="flex gap-3 justify-end">
          <button className="btn btn-ghost" onClick={() => setConfigOpen(false)}>Cancelar</button>
          <button className="btn btn-fill" onClick={saveConfig}>Salvar</button>
        </div>
      </Sheet>
    </div>
  );
}
