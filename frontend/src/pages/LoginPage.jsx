import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import Modal from '../components/Modal.jsx';
import Spinner from '../components/Spinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

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
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
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
      showToast({ message: 'Endpoint configurado com sucesso!' });
    } else {
      showError('URL inválida. Deve iniciar com https://script.google.com/');
    }
  };

  return (
    <div className="split-screen bg-base">
      <div className="split-screen-visual hidden-mobile">
        <div className="visual-shape" />
        <div className="relative text-center flex flex-col items-center justify-center px-6" style={{ zIndex: 10, width: '100%' }}>
          <h2 className="text-4xl font-light mb-4 text-primary" style={{ letterSpacing: '-0.02em', fontSize: '2.25rem' }}>
            Clinical Tracking
          </h2>
          <p className="font-light text-lg text-secondary" style={{ maxWidth: 320, lineHeight: 1.6 }}>
            O luxo de uma saúde integrativa, conectada e baseada em precisão científica.
          </p>
        </div>
      </div>

      <div className="split-screen-content">
        <motion.div
          className="w-full"
          style={{ maxWidth: 400 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <header className="mb-8 text-left">
            <h1 className="text-h1">Acolhimento Clínico</h1>
            <p className="text-p text-secondary">Seu espaço de evolução e cuidado integrativo.</p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-6">
              <label htmlFor="email" className="form-label">E-mail corporativo ou paciente</label>
              <input
                type="email"
                id="email"
                className="form-input"
                required
                placeholder="nome@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group mb-8">
              <label htmlFor="password" className="form-label">Sua senha de acesso</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingRight: 48 }}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <button
                  type="button"
                  className="flex items-center justify-center"
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none', fontSize: 18,
                    color: 'var(--color-text-secondary)', width: 32, height: 32, padding: 0, cursor: 'pointer'
                  }}
                  aria-label="Mostrar ou ocultar senha"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && <div className="alert alert-error mb-6" role="alert">{error}</div>}

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <Spinner /> : <span>Entrar no Tratamento</span>}
            </button>
          </form>

          <footer className="mt-8 text-center">
            <button className="btn btn-outline btn-sm" onClick={openConfig}>
              ⚙️ Configurações de Conexão (GAS)
            </button>
          </footer>
        </motion.div>
      </div>

      <Modal open={configOpen} onClose={() => setConfigOpen(false)} title="Endpoint da API" description="Insira a URL de execução do seu Google Apps Script:">
        <input
          type="url"
          className="form-input mb-6"
          placeholder="https://script.google.com/macros/s/.../exec"
          value={gasUrl}
          onChange={(e) => setGasUrl(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button className="btn btn-outline" onClick={() => setConfigOpen(false)}>Cancelar</button>
          <button className="btn btn-success" onClick={saveConfig}>Salvar Conexão</button>
        </div>
      </Modal>
    </div>
  );
}
