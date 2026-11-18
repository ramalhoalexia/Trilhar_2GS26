import React from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { chipStyles } from '../styles/components.styles';
import type { IconName } from '../types';

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: IconName;
};

export default function Chip({ label, selected = false, onPress, icon }: Props) {
  const s = useThemedStyles(chipStyles);
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[s.chip, selected && s.selected]}
    >
      {icon ? (
        <Ionicons name={icon} size={16} color={selected ? t.colors.onPrimary : t.colors.textMuted} />
      ) : null}
      <Text style={[s.text, selected && s.textSelected]}>{label}</Text>
    </Pressable>
  );
}
