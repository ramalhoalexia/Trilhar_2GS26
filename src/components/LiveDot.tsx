import React, { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { useTheme } from '../context/SettingsContext';

type Props = {
  active?: boolean;
  label?: string;
};

export default function LiveDot({ active = true, label = 'AO VIVO' }: Props) {
  const t = useTheme();
  const [pulse] = useState(() => new Animated.Value(1));
  const color = active ? t.tones.success.fg : t.colors.textMuted;

  useEffect(() => {
    if (!active) {
      pulse.setValue(1);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.25, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, pulse]);

  return (
    <View
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
      accessible
      accessibilityLabel={active ? 'Sensores atualizando ao vivo' : 'Sensores pausados'}
    >
      <Animated.View
        style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, opacity: pulse }}
      />
      <Text style={{ fontSize: t.fs(12), fontWeight: '800', color, letterSpacing: 0.5 }}>
        {active ? label : 'PAUSADO'}
      </Text>
    </View>
  );
}
