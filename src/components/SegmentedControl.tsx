import React, { useEffect, useState } from 'react';
import { Animated, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { segmentedStyles } from '../styles/components.styles';

/** espaço entre a borda do seletor e os botões (igual ao padding de `wrap`) */
const PADDING = 4;

type Props<K extends string> = {
  options: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
  /**
   * Espaço entre a borda da tela e o seletor. A largura de cada botão sai daí,
   * o que evita precisar medir o componente para posicionar o destaque.
   */
  margemDaTela?: number;
};

export default function SegmentedControl<K extends string>({
  options,
  value,
  onChange,
  margemDaTela = 16,
}: Props<K>) {
  const s = useThemedStyles(segmentedStyles);
  const t = useTheme();
  const { width: larguraTela } = useWindowDimensions();
  const index = Math.max(
    0,
    options.findIndex((o) => o.key === value)
  );
  const larguraBotao = Math.max(
    0,
    (larguraTela - margemDaTela * 2 - PADDING * 2) / options.length
  );

  // posição do destaque, em pixels
  const [deslocamento] = useState(() => new Animated.Value(index * larguraBotao));

  // se a tela mudar de tamanho (girar o aparelho), reposiciona sem animar
  const [larguraAnterior, setLarguraAnterior] = useState(larguraBotao);
  if (larguraAnterior !== larguraBotao) {
    setLarguraAnterior(larguraBotao);
    deslocamento.setValue(index * larguraBotao);
  }

  // o destaque desliza até o botão escolhido
  useEffect(() => {
    Animated.timing(deslocamento, {
      toValue: index * larguraBotao,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [index, larguraBotao, deslocamento]);

  return (
    <View style={s.wrap} accessibilityRole="tablist">
      <Animated.View
        pointerEvents="none"
        style={[
          s.destaque,
          t.highContrast ? s.destaqueHC : s.destaqueNormal,
          { width: larguraBotao, transform: [{ translateX: deslocamento }] },
        ]}
      />

      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: active }}
            style={s.item}
          >
            <Text style={[s.text, active && s.textActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
