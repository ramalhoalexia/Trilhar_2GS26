import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { emptyStyles } from '../styles/components.styles';
import type { IconName } from '../types';

type Props = {
  icon?: IconName;
  title: string;
  text?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ icon = 'sparkles', title, text, actionLabel, onAction }: Props) {
  const s = useThemedStyles(emptyStyles);
  const t = useTheme();
  return (
    <View style={s.wrap}>
      <View style={s.iconWrap}>
        <Ionicons name={icon} size={32} color={t.tones.primary.fg} />
      </View>
      <Text style={s.title}>{title}</Text>
      {text ? <Text style={s.text}>{text}</Text> : null}
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} small /> : null}
    </View>
  );
}
