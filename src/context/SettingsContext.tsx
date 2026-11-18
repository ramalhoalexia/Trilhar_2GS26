import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_PREFERENCES,
  loadPreferences,
  savePreferences,
  type Preferences,
} from '../services/settingsService';
import { buildTheme, type Theme } from '../styles/theme';

interface SettingsValue extends Preferences {
  theme: Theme;
  update: (patch: Partial<Preferences>) => void;
}

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);

  // lê as preferências salvas no aparelho
  useEffect(() => {
    let active = true;
    loadPreferences().then((saved) => {
      if (active) setPrefs(saved);
    });
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback(
    (patch: Partial<Preferences>) => {
      setPrefs((current) => {
        const next = { ...current, ...patch };
        void savePreferences(next);
        return next;
      });
    },
    []
  );

  const theme = useMemo(() => buildTheme(prefs), [prefs]);
  const value = useMemo(() => ({ ...prefs, theme, update }), [prefs, theme, update]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings precisa estar dentro de <SettingsProvider>.');
  return ctx;
}

export const useTheme = (): Theme => useSettings().theme;
