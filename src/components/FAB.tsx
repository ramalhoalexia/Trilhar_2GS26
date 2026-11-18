import React from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { fabStyles } from '../styles/components.styles';
import type { IconName } from '../types';

type Props = {
  icon?: IconName;
  label: string;
  onPress: () => void;
};

export default function FAB({ icon = 'add', label, onPress }: Props) {
  const s = useThemedStyles(fabStyles);
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [s.fab, pressed && { opacity: 0.9 }]}
    >
      <Ionicons name={icon} size={22} color={t.colors.onPrimary} />
      <Text style={s.text}>{label}</Text>
    </Pressable>
  );
}
