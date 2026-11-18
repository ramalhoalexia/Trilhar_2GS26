import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { badgeStyles } from '../styles/components.styles';
import type { IconName, Tone } from '../types';

type Props = {
  text: string;
  tone?: Tone;
  icon?: IconName;
};

export default function Badge({ text, tone = 'neutral', icon }: Props) {
  const s = useThemedStyles(badgeStyles);
  const t = useTheme();
  const c = t.tones[tone];
  return (
    <View style={[s.base, { backgroundColor: c.bg }]}>
      {icon ? <Ionicons name={icon} size={13} color={c.fg} /> : null}
      <Text style={[s.text, { color: c.fg }]}>{text}</Text>
    </View>
  );
}
