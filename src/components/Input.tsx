import React, { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { inputStyles } from '../styles/components.styles';
import type { IconName } from '../types';

type Props = Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'secureTextEntry'> & {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  /** formata o texto enquanto a pessoa digita (CPF, telefone, data...) */
  mask?: (text: string) => string;
  icon?: IconName;
  /** campo de senha com botão de mostrar/ocultar */
  secure?: boolean;
};

export default function Input({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  hint,
  mask,
  icon,
  secure = false,
  multiline = false,
  ...rest
}: Props) {
  const s = useThemedStyles(inputStyles);
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={s.wrap}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.field, focused && s.focused, !!error && s.errored, multiline && s.multiline]}>
        {icon ? (
          <Ionicons name={icon} size={20} color={t.colors.textMuted} style={s.icon} />
        ) : null}
        <TextInput
          style={[s.input, multiline && s.inputMulti]}
          value={value}
          onChangeText={(text) => onChangeText(mask ? mask(text) : text)}
          secureTextEntry={hidden}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          placeholderTextColor={t.colors.textMuted}
          keyboardAppearance={t.dark ? 'dark' : 'light'}
          accessibilityLabel={error ? `${label}. Erro: ${error}` : label}
          accessibilityHint={hint}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          {...rest}
        />
        {secure ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
            hitSlop={12}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={t.colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text style={s.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text style={s.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}
