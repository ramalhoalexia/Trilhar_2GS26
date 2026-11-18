import React from 'react';
import { Text, View } from 'react-native';
import { avatarOf } from '../constants';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { avatarStyles } from '../styles/components.styles';
import { initials } from '../utils/format';

const PALETTE = ['#5B4DF0', '#0E8F8E', '#D6317F', '#EA6A0A', '#2F6FE0', '#8B4FE0'];

type Props = {
  name?: string;
  /** id do avatar desenhado; sem ele, mostra as iniciais do nome */
  avatar?: string | null;
  size?: number;
};

export default function Avatar({ name = '', avatar, size = 44 }: Props) {
  const s = useThemedStyles(avatarStyles);
  const t = useTheme();
  const option = avatarOf(avatar);
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (option) {
    return (
      <View
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        style={[s.base, shape, { backgroundColor: option.color }, t.highContrast && s.outlined]}
      >
        <Text style={[s.emoji, { fontSize: size * 0.56, lineHeight: size * 0.72 }]}>
          {option.emoji}
        </Text>
      </View>
    );
  }

  const hash = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const bg = t.highContrast ? '#3A3A3A' : PALETTE[hash % PALETTE.length];
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[s.base, shape, { backgroundColor: bg }]}
    >
      <Text style={[s.text, { fontSize: size * 0.38 }]}>{initials(name)}</Text>
    </View>
  );
}
