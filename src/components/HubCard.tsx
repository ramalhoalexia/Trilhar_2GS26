import React from 'react';
import { View, Text } from 'react-native';
import Card from './Card';
import Badge from './Badge';
import ProgressBar from './ProgressBar';
import useThemedStyles from '../hooks/useThemedStyles';
import { useTheme } from '../context/SettingsContext';
import { hubCardStyles } from '../styles/components.styles';
import { fmtDec } from '../utils/format';
import { THRESHOLDS } from '../services/iotService';
import type { LiveHub } from '../types';

type Props = {
  hub: LiveHub;
  onPress: () => void;
};

export default function HubCard({ hub, onPress }: Props) {
  const s = useThemedStyles(hubCardStyles);
  const t = useTheme();
  const r = hub.reading;
  const ratio = r.ocupacao / hub.capacidade;
  const tone = t.tones[hub.status.tone];
  const wifiBad = r.wifi < THRESHOLDS.wifiMin;
  const tempBad = r.temp >= THRESHOLDS.tempMax;

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${hub.nome}, ${hub.bairro}. ${hub.status.label}. ${r.ocupacao} de ${hub.capacidade} lugares ocupados. Wi-Fi ${fmtDec(
        r.wifi
      )} megabits. Temperatura ${fmtDec(r.temp)} graus.`}
      accessibilityHint="Abre os detalhes do ponto"
    >
      <View style={s.head}>
        <View style={s.titles}>
          <Text style={s.name}>{hub.nome}</Text>
          <Text style={s.place}>{hub.bairro}</Text>
        </View>
        <Badge text={hub.status.label} tone={hub.status.tone} />
      </View>

      <View style={s.occ}>
        <Text style={s.occText}>
          {r.ocupacao} de {hub.capacidade} lugares ocupados
          {hub.reservas ? ` · ${hub.reservas} reservado(s)` : ''}
        </Text>
        <ProgressBar value={ratio * 100} color={tone.fg} label="Lotação" />
      </View>

      <View style={s.metrics}>
        <View style={s.metric}>
          <Text style={[s.metricValue, wifiBad && { color: t.tones.danger.fg }]}>
            {fmtDec(r.wifi)}
          </Text>
          <Text style={s.metricLabel}>Mbps Wi-Fi</Text>
        </View>
        <View style={s.metric}>
          <Text style={[s.metricValue, tempBad && { color: t.tones.warn.fg }]}>
            {fmtDec(r.temp)}°
          </Text>
          <Text style={s.metricLabel}>Temperatura</Text>
        </View>
        <View style={s.metric}>
          <Text style={s.metricValue}>{Math.max(0, hub.capacidade - r.ocupacao - hub.reservas)}</Text>
          <Text style={s.metricLabel}>Lugares livres</Text>
        </View>
      </View>
    </Card>
  );
}
