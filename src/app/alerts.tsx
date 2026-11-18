import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Screen from '@/components/Screen';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import SegmentedControl from '@/components/SegmentedControl';
import EmptyState from '@/components/EmptyState';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useTheme } from '@/context/SettingsContext';
import { useCurrentUser } from '@/context/AuthContext';
import { useIoT } from '@/context/IoTContext';
import { iotStyles } from '@/styles/iot.styles';
import { timeAgo } from '@/utils/format';
import type { AlertStatus, AlertType, IconName, Tone } from '@/types';

const ICONS: Record<AlertType, IconName> = {
  conexao: 'wifi-outline',
  lotacao: 'people-outline',
  temperatura: 'thermometer-outline',
};
const STATUS: Record<AlertStatus, { label: string; tone: Tone }> = {
  aberto: { label: 'Aberto', tone: 'danger' },
  em_atendimento: { label: 'Em atendimento', tone: 'warn' },
  normalizado: { label: 'Normalizado', tone: 'success' },
};

export default function AlertsScreen() {
  const router = useRouter();
  const s = useThemedStyles(iotStyles);
  const t = useTheme();
  const user = useCurrentUser();
  const { alerts, dispatchAlert } = useIoT();
  const [tab, setTab] = useState<'abertos' | 'historico'>('abertos');

  const data = useMemo(
    () =>
      alerts.filter((a) => (tab === 'abertos' ? a.status !== 'normalizado' : a.status === 'normalizado')),
    [alerts, tab]
  );

  return (
    <Screen edges={['bottom']}>
      <FlatList
        data={data}
        keyExtractor={(a) => a.id}
        contentContainerStyle={[s.list, { paddingTop: 12 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SegmentedControl
            value={tab}
            onChange={setTab}
            options={[
              { key: 'abertos', label: 'Abertos' },
              { key: 'historico', label: 'Resolvidos' },
            ]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="checkmark-done-outline"
            title={tab === 'abertos' ? 'Nenhum alerta aberto' : 'Sem histórico ainda'}
            text="Os alertas aparecem automaticamente quando os sensores saem do normal."
          />
        }
        renderItem={({ item }) => {
          const st = STATUS[item.status];
          const tone = t.tones[item.severidade];
          return (
            <Card>
              {/* só a área de informações abre o ponto: o botão abaixo fica fora dela */}
              <Pressable
                style={s.alertCard}
                onPress={() => router.push({ pathname: '/hub/[id]', params: { id: item.hubId } })}
                accessibilityRole="button"
                accessibilityLabel={`${item.titulo} em ${item.hubNome}. ${item.detalhe}. Situação: ${st.label}`}
                accessibilityHint="Abre os sensores deste ponto"
              >
                <View style={[s.alertIcon, { backgroundColor: tone.bg }]}>
                  <Ionicons name={ICONS[item.tipo]} size={22} color={tone.fg} />
                </View>
                <View style={s.alertInfo}>
                  <Text style={s.alertTitle}>{item.titulo}</Text>
                  <Text style={s.alertHub}>{item.hubNome}</Text>
                  <Text style={s.alertDetail}>{item.detalhe}</Text>
                  <View style={s.alertMeta}>
                    <Badge text={st.label} tone={st.tone} />
                    <Text style={s.alertTime}>{timeAgo(item.criadoEm)}</Text>
                    {item.acionadoPor ? (
                      <Text style={s.alertTime}>· por {item.acionadoPor.split(' ')[0]}</Text>
                    ) : null}
                  </View>
                </View>
              </Pressable>
              {item.status === 'aberto' ? (
                <Button
                  title="Acionar equipe do local"
                  icon="construct-outline"
                  small
                  style={s.alertBtn}
                  onPress={() => dispatchAlert(item.id, user.nome)}
                />
              ) : null}
            </Card>
          );
        }}
      />
    </Screen>
  );
}
