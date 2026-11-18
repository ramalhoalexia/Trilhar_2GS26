import React from 'react';
import { Image, type ImageStyle, type StyleProp } from 'react-native';
import { useTheme } from '../context/SettingsContext';

// A imagem é de uma cor só com fundo transparente, então dá para pintá-la
// conforme o tema (roxo no modo claro, lilás no noturno, amarelo no alto contraste).
const SOURCE = require('../../assets/logo.png');
/** proporção da imagem: 410 × 288 */
const ASPECT = 410 / 288;

type Props = {
  /** altura da logo; a largura acompanha a proporção */
  size?: number;
  /** cor da logo (o padrão acompanha o tema) */
  color?: string;
  /** descrição para leitor de tela; sem ela a logo é tratada como decoração */
  label?: string;
  style?: StyleProp<ImageStyle>;
};

export default function Logo({ size = 28, color, label, style }: Props) {
  const t = useTheme();
  return (
    <Image
      source={SOURCE}
      resizeMode="contain"
      style={[{ width: size * ASPECT, height: size, tintColor: color ?? t.colors.primary }, style]}
      accessible={!!label}
      accessibilityLabel={label}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
    />
  );
}
