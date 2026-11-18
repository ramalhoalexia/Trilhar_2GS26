import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { progressStyles } from '../styles/components.styles';

type Props = {
  /** de 0 a 100 */
  value: number;
  color?: string;
  label?: string;
};

export default function ProgressBar({ value, color, label = 'Progresso' }: Props) {
  const s = useThemedStyles(progressStyles);
  const t = useTheme();
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <View
      style={s.track}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: pct, text: `${pct}%` }}
    >
      <View style={[s.fill, { width: `${pct}%`, backgroundColor: color ?? t.colors.primary }]} />
    </View>
  );
}
