import React from 'react';
import { ActivityIndicator, Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { buttonStyles } from '../styles/components.styles';
import type { IconName } from '../types';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  small = false,
  style,
  accessibilityHint,
}: Props) {
  const s = useThemedStyles(buttonStyles);
  const t = useTheme();
  const textStyle = {
    primary: s.textPrimary,
    secondary: s.textSecondary,
    ghost: s.textGhost,
    danger: s.textDanger,
  }[variant];
  const iconColor = {
    primary: t.colors.onPrimary,
    secondary: t.tones.primary.fg,
    ghost: t.colors.text,
    danger: t.tones.danger.fg,
  }[variant];
  const off = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: off, busy: loading }}
      style={({ pressed }) => [
        s.base,
        s[variant],
        small && s.small,
        off && s.disabled,
        pressed && s.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={20} color={iconColor} /> : null}
          <Text style={[s.text, textStyle]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}
