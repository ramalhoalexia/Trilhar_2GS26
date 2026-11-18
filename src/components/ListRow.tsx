import React, { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { listRowStyles } from '../styles/components.styles';
import type { IconName, Tone } from '../types';

type Props = {
  icon: IconName;
  tone?: Tone;
  label: string;
  value?: string;
  onPress?: () => void;
  right?: ReactNode;
};

export default function ListRow({ icon, tone = 'primary', label, value, onPress, right }: Props) {
  const s = useThemedStyles(listRowStyles);
  const t = useTheme();
  const c = t.tones[tone];
  const content = (
    <View style={s.row}>
      <View style={[s.icon, { backgroundColor: c.bg }]}>
        <Ionicons name={icon} size={20} color={c.fg} />
      </View>
      <View style={s.texts}>
        <Text style={s.label}>{label}</Text>
        {value ? <Text style={s.value}>{value}</Text> : null}
      </View>
      {right ??
        (onPress ? (
          <Ionicons name="chevron-forward" size={20} color={t.colors.textMuted} />
        ) : null)}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}. ${value}` : label}
    >
      {content}
    </Pressable>
  );
}
