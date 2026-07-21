import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

function readSession() {
  const token = sessionStorage.getItem('JWT_TOKEN');
  const role = sessionStorage.getItem('USER_ROLE');
  if (!token || !role) return null;
  return {
    token,
    role,
    userId: sessionStorage.getItem('USER_ID'),
    nome: sessionStorage.getItem('USER_NAME'),
    protocolo: sessionStorage.getItem('USER_PROTOCOL') || 'Melasma'
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const login = useCallback((result) => {
    sessionStorage.setItem('JWT_TOKEN', result.token);
    sessionStorage.setItem('USER_ROLE', result.role);
    sessionStorage.setItem('USER_ID', result.userId);
    sessionStorage.setItem('USER_NAME', result.nome);
    sessionStorage.setItem('USER_PROTOCOL', result.protocoloNome || 'Melasma');
    setSession(readSession());
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setSession(null);
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      sessionStorage.clear();
      setSession(null);
    };
    window.addEventListener('app:authExpired', handleExpired);
    return () => window.removeEventListener('app:authExpired', handleExpired);
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
