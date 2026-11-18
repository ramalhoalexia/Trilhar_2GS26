import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import Logo from './Logo';
import useThemedStyles from '../hooks/useThemedStyles';
import { headerStyles } from '../styles/components.styles';

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  /** mostra a logo do Trilhar ao lado do título (ligada por padrão) */
  logo?: boolean;
};

export default function ScreenHeader({ title, subtitle, right, logo = true }: Props) {
  const s = useThemedStyles(headerStyles);
  return (
    <View style={s.wrap}>
      {logo ? <Logo size={28} style={s.logo} /> : null}
      <View style={s.texts}>
        <Text style={s.title} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}
