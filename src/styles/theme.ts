import type { ViewStyle } from 'react-native';
import type { Tone } from '../types';

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };

export type Gradient = readonly [string, string, string];

interface ThemeColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  text: string;
  textMuted: string;
  border: string;
  danger: string;
  hero: Gradient;
  onHero: string;
}

interface ToneColors {
  fg: string;
  bg: string;
}

export interface Theme {
  /** true quando o fundo é escuro (modo noturno ou alto contraste) */
  dark: boolean;
  highContrast: boolean;
  fontScale: number;
  colors: ThemeColors;
  tones: Record<Tone, ToneColors>;
  spacing: typeof spacing;
  radius: typeof radius;
  shadow: ViewStyle;
  borderWidth: number;
  /** tamanho de fonte ajustado pela preferência de acessibilidade */
  fs: (size: number) => number;
}

const lightColors: ThemeColors = {
  bg: '#F5F6FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0FA',
  primary: '#5B4DF0',
  primarySoft: '#E9E7FF',
  onPrimary: '#FFFFFF',
  text: '#13132B',
  textMuted: '#5C5F7A',
  border: '#E1E3F1',
  danger: '#D6204A',
  hero: ['#4B3FE0', '#7C5CFF', '#B07CFF'],
  onHero: '#FFFFFF',
};

const lightTones: Record<Tone, ToneColors> = {
  primary: { fg: '#4B3FE0', bg: '#E9E7FF' },
  success: { fg: '#15803D', bg: '#DCF5E5' },
  warn: { fg: '#9A5B00', bg: '#FEF0CC' },
  danger: { fg: '#C81E4A', bg: '#FDE3E9' },
  accent: { fg: '#0F766E', bg: '#D9F5F1' },
  neutral: { fg: '#5C5F7A', bg: '#EEF0FA' },
};

// ---------- Modo noturno ----------
const darkColors: ThemeColors = {
  bg: '#0F1020',
  surface: '#1A1B2E',
  surfaceAlt: '#25273D',
  primary: '#8F85FF',
  primarySoft: '#2A2850',
  onPrimary: '#0E0E20',
  text: '#F2F3FA',
  textMuted: '#A9ACC6',
  border: '#33354F',
  danger: '#FF8FA3',
  hero: ['#3B31B8', '#5A47D6', '#7C5CFF'],
  onHero: '#FFFFFF',
};

const darkTones: Record<Tone, ToneColors> = {
  primary: { fg: '#ADA5FF', bg: '#2A2850' },
  success: { fg: '#4ADE80', bg: '#11301F' },
  warn: { fg: '#FBBF24', bg: '#3A2C0A' },
  danger: { fg: '#FF8FA3', bg: '#3D1522' },
  accent: { fg: '#5EEAD4', bg: '#0F3531' },
  neutral: { fg: '#A9ACC6', bg: '#25273D' },
};

// ---------- Alto contraste ----------
const contrastColors: ThemeColors = {
  bg: '#000000',
  surface: '#0D0D0D',
  surfaceAlt: '#1C1C1C',
  primary: '#FFD60A',
  primarySoft: '#2B2500',
  onPrimary: '#000000',
  text: '#FFFFFF',
  textMuted: '#E4E4E4',
  border: '#FFFFFF',
  danger: '#FF7A93',
  hero: ['#1C1C1C', '#1C1C1C', '#1C1C1C'],
  onHero: '#FFFFFF',
};

const contrastTones: Record<Tone, ToneColors> = {
  primary: { fg: '#FFD60A', bg: '#2B2500' },
  success: { fg: '#4ADE80', bg: '#052E16' },
  warn: { fg: '#FFD60A', bg: '#2B2500' },
  danger: { fg: '#FF7A93', bg: '#3B0A17' },
  accent: { fg: '#2DD4BF', bg: '#04302B' },
  neutral: { fg: '#E4E4E4', bg: '#1C1C1C' },
};

const softShadow: ViewStyle = {
  shadowColor: '#2A2570',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

const darkShadow: ViewStyle = {
  shadowColor: '#000000',
  shadowOpacity: 0.3,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

/** O alto contraste tem prioridade sobre o modo noturno. */
export function buildTheme({ highContrast = false, darkMode = false, fontScale = 1 } = {}): Theme {
  const palette = highContrast
    ? { colors: contrastColors, tones: contrastTones, shadow: {} }
    : darkMode
      ? { colors: darkColors, tones: darkTones, shadow: darkShadow }
      : { colors: lightColors, tones: lightTones, shadow: softShadow };
  return {
    dark: highContrast || darkMode,
    highContrast,
    fontScale,
    colors: palette.colors,
    tones: palette.tones,
    spacing,
    radius,
    shadow: palette.shadow,
    borderWidth: highContrast ? 1.5 : 1,
    fs: (size) => Math.round(size * fontScale),
  };
}
