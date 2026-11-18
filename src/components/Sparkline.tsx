import React from 'react';
import { View } from 'react-native';
import useThemedStyles from '../hooks/useThemedStyles';
import { sparkStyles } from '../styles/components.styles';

type Props = {
  data: number[];
  /** valor que ocupa a altura total do gráfico */
  max?: number;
  height?: number;
  color: string;
  alertColor: string;
  /** barras abaixo deste valor ficam na cor de alerta */
  alertBelow?: number;
  /** barras a partir deste valor ficam na cor de alerta */
  alertAbove?: number;
};

/** Mini gráfico de barras para o histórico dos sensores. */
export default function Sparkline({
  data,
  max,
  height = 56,
  color,
  alertColor,
  alertBelow,
  alertAbove,
}: Props) {
  const s = useThemedStyles(sparkStyles);
  const top = max ?? Math.max(...data, 1);
  return (
    <View
      style={[s.wrap, { height }]}
      accessible
      accessibilityLabel={`Histórico das últimas ${data.length} leituras`}
    >
      {data.map((value, index) => {
        const bad =
          (alertBelow !== undefined && value < alertBelow) ||
          (alertAbove !== undefined && value >= alertAbove);
        return (
          <View
            key={index}
            style={[
              s.bar,
              {
                height: Math.max(3, Math.min(1, value / top) * height),
                backgroundColor: bad ? alertColor : color,
                opacity: 0.35 + (0.65 * (index + 1)) / data.length,
              },
            ]}
          />
        );
      })}
    </View>
  );
}
