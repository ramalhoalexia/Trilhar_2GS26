import { errorMessage } from '@/utils/errors';
import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import Screen from '@/components/Screen';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Sparkline from '@/components/Sparkline';
import ProgressBar from '@/components/ProgressBar';
import LiveDot from '@/components/LiveDot';
import EmptyState from '@/components/EmptyState';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useTheme } from '@/context/SettingsContext';
import { useCurrentUser } from '@/context/AuthContext';
import { useIoT } from '@/context/IoTContext';
import { iotStyles } from '@/styles/iot.styles';
import type { Gradient } from '@/styles/theme';
import { THRESHOLDS } from '@/services/iotService';
import { fmtDec } from '@/utils/format';
import { notify } from '@/utils/dialog';

export default function HubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = useThemedStyles(iotStyles);
  const t = useTheme();
  const user = useCurrentUser();
  const { hubs, history, openAlerts, myReservations, paused, reserve, cancelReservation, forceIncident } =
    useIoT();
  const hub = hubs.find((h) => h.id === id);
  const isAgent = user.perfil === 'agente';

  if (!hub) {
    return (
      <Screen edges={['bottom']}>
        <EmptyState icon="alert-circle-outline" title="Ponto não encontrado" />
      </Screen>
    );
  }

  const r = hub.reading;
  const hist = history[hub.id] || [];
  const mine = myReservations.find((x) => x.hubId === hub.id);
  const hubAlerts = openAlerts.filter((a) => a.hubId === hub.id);
  const ratio = r.ocupacao / hub.capacidade;
  const tone = t.tones[hub.status.tone];
  const free = Math.max(0, hub.capacidade - r.ocupacao - hub.reservas);
  const heroColors: Gradient = t.highContrast ? t.colors.hero : ['#13132B', '#2B2570', '#5B4DF0'];

  const onReserve = async () => {
    try {
      await reserve(hub.id);
      notify('Lugar reservado! ✅', `Seu lugar em "${hub.nome}" está garantido por hoje.`);
    } catch (e) {
      notify('Não foi possível reservar', errorMessage(e));
    }
  };

  return (
    <Screen scroll edges={['bottom']}>
      <LinearGradient colors={heroColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
        <Text style={s.heroName} accessibilityRole="header">
          {hub.nome}
        </Text>
        <Text style={s.heroPlace}>{hub.bairro}</Text>
        <View style={s.heroBadgeRow}>
          <Badge text={hub.status.label} tone={hub.status.tone} />
          <LiveDot active={!paused} />
        </View>
      </LinearGradient>

      {hubAlerts.map((a) => (
        <View key={a.id} style={s.alertBar} accessibilityRole="alert">
          <Ionicons name="warning" size={22} color={t.tones.danger.fg} />
          <Text style={s.alertBarText}>
            {a.titulo}: {a.detalhe}
          </Text>
        </View>
      ))}

      <View style={s.sensor}>
        <View style={s.sensorTop}>
          <View style={s.sensorTitle}>
            <Ionicons name="people-outline" size={20} color={tone.fg} />
            <Text style={s.sensorName}>Lotação</Text>
          </View>
          <Badge text={`${free} livres`} tone={free > 0 ? 'success' : 'danger'} />
        </View>
        <Text style={s.sensorValue}>
          {r.ocupacao}
          <Text style={s.sensorUnit}> / {hub.capacidade} pessoas</Text>
        </Text>
        <Text style={s.sensorHint}>
          Alerta acima de {Math.round(THRESHOLDS.lotacao * 100)}% da capacidade
          {hub.reservas ? ` · ${hub.reservas} reserva(s)` : ''}
        </Text>
        <ProgressBar value={ratio * 100} color={tone.fg} label="Lotação" />
      </View>

      <View style={s.sensor}>
        <View style={s.sensorTop}>
          <View style={s.sensorTitle}>
            <Ionicons name="wifi-outline" size={20} color={t.tones.primary.fg} />
            <Text style={s.sensorName}>Velocidade do Wi-Fi</Text>
          </View>
          {r.wifi < THRESHOLDS.wifiMin ? <Badge text="Instável" tone="danger" /> : <Badge text="Estável" tone="success" />}
        </View>
        <Text style={s.sensorValue}>
          {fmtDec(r.wifi)}
          <Text style={s.sensorUnit}> Mbps</Text>
        </Text>
        <Text style={s.sensorHint}>Alerta abaixo de {THRESHOLDS.wifiMin} Mbps · últimas {hist.length} leituras</Text>
        <Sparkline
          data={hist.map((x) => x.wifi)}
          max={Math.max(hub.baseWifi + 10, 20)}
          color={t.tones.primary.fg}
          alertColor={t.tones.danger.fg}
          alertBelow={THRESHOLDS.wifiMin}
        />
      </View>

      <View style={s.sensor}>
        <View style={s.sensorTop}>
          <View style={s.sensorTitle}>
            <Ionicons name="thermometer-outline" size={20} color={t.tones.warn.fg} />
            <Text style={s.sensorName}>Temperatura</Text>
          </View>
          {r.temp >= THRESHOLDS.tempMax ? <Badge text="Quente" tone="warn" /> : <Badge text="Agradável" tone="success" />}
        </View>
        <Text style={s.sensorValue}>
          {fmtDec(r.temp)}
          <Text style={s.sensorUnit}> °C</Text>
        </Text>
        <Text style={s.sensorHint}>Alerta a partir de {THRESHOLDS.tempMax} °C</Text>
        <Sparkline
          data={hist.map((x) => x.temp - 18)}
          max={20}
          color={t.tones.warn.fg}
          alertColor={t.tones.danger.fg}
          alertAbove={THRESHOLDS.tempMax - 18}
        />
      </View>

      <View style={s.actions}>
        {!isAgent ? (
          mine ? (
            <Button
              title="Cancelar minha reserva"
              variant="danger"
              icon="close-circle-outline"
              onPress={() => cancelReservation(mine.id)}
            />
          ) : (
            <Button
              title="Reservar um lugar"
              icon="bookmark-outline"
              onPress={onReserve}
              disabled={hub.status.key === 'lotado'}
            />
          )
        ) : null}
        <Button
          title="Simular incidente (demo)"
          icon="flash-outline"
          variant="ghost"
          onPress={() => forceIncident(hub.id)}
          accessibilityHint="Força uma leitura crítica nos sensores para demonstrar o alerta"
        />
        <Text style={s.demoNote}>
          Use o botão acima para ver os sensores gerarem um alerta na hora.
        </Text>
      </View>
    </Screen>
  );
}
