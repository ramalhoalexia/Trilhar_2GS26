import { useMemo } from 'react';
import { useTheme } from '../context/SettingsContext';
import type { Theme } from '../styles/theme';

/** Cria o StyleSheet a partir de uma fábrica (theme) => StyleSheet, recalculando só se o tema mudar. */
export default function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
