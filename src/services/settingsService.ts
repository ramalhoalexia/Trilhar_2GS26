// Preferências de aparência e acessibilidade, salvas no AsyncStorage.
import { KEYS, load, save } from './storage';

export interface Preferences {
  /** modo noturno: fundo escuro, mais confortável à noite */
  darkMode: boolean;
  highContrast: boolean;
  fontScale: number;
}

export const DEFAULT_PREFERENCES: Preferences = {
  darkMode: false,
  highContrast: false,
  fontScale: 1,
};

export async function loadPreferences(): Promise<Preferences> {
  const saved = await load<Partial<Preferences> | null>(KEYS.settings, null);
  return { ...DEFAULT_PREFERENCES, ...saved };
}

export function savePreferences(preferences: Preferences): Promise<void> {
  return save(KEYS.settings, preferences);
}
