import { createContext, useCallback, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export function protocolToThemeClass(protocoloNome) {
  const normalized = (protocoloNome || '').toLowerCase();
  if (normalized.includes('desinflamacao') || normalized.includes('desinflamação')) {
    return 'theme-desinflamacao';
  }
  if (normalized.includes('melasma')) {
    return 'theme-melasma';
  }
  return '';
}

export function ThemeProvider({ children }) {
  const [themeClass, setThemeClassState] = useState('');

  const setThemeClass = useCallback((className) => {
    document.body.className = className;
    setThemeClassState(className);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeClass, setThemeClass }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
