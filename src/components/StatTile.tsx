import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { statTileStyles } from '../styles/components.styles';
import type { IconName, Tone } from '../types';

type Props = {
  icon: IconName;
  value: string | number;
  label: string;
  tone?: Tone;
};

export default function StatTile({ icon, value, label, tone = 'primary' }: Props) {
  const s = useThemedStyles(statTileStyles);
  const t = useTheme();
  const c = t.tones[tone];
  return (
    <View style={s.tile} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={[s.icon, { backgroundColor: c.bg }]}>
        <Ionicons name={icon} size={18} color={c.fg} />
      </View>
      <Text style={s.value}>{value}</Text>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}
