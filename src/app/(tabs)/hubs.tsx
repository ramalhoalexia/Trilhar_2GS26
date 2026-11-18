import React from 'react';
import { FlatList, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Screen from '@/components/Screen';
import ScreenHeader from '@/components/ScreenHeader';
import HubCard from '@/components/HubCard';
import LiveDot from '@/components/LiveDot';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useTheme } from '@/context/SettingsContext';
import { useCurrentUser } from '@/context/AuthContext';
import { useIoT } from '@/context/IoTContext';
import { iotStyles } from '@/styles/iot.styles';

export default function HubsScreen() {
  const router = useRouter();
  const s = useThemedStyles(iotStyles);
  const t = useTheme();
  const user = useCurrentUser();
  const { hubs, openAlerts, paused, setPaused } = useIoT();
  const isAgent = user.perfil === 'agente';

  const header = (
    <View>
      <View style={s.topRow}>
        <LiveDot active={!paused} />
        <Pressable
          onPress={() => setPaused(!paused)}
          accessibilityRole="button"
          accessibilityLabel={paused ? 'Retomar atualização dos sensores' : 'Pausar atualização dos sensores'}
          style={s.pauseBtn}
        >
          <Ionicons name={paused ? 'play' : 'pause'} size={16} color={t.colors.text} />
          <Text style={s.pauseText}>{paused ? 'Retomar' : 'Pausar'}</Text>
        </Pressable>
      </View>

      {isAgent && openAlerts.length > 0 ? (
        <Pressable
          onPress={() => router.push('/alerts')}
          accessibilityRole="button"
          accessibilityLabel={`${openAlerts.length} alertas abertos. Toque para ver`}
          style={s.alertBar}
        >
          <Ionicons name="notifications" size={22} color={t.tones.danger.fg} />
          <Text style={s.alertBarText}>{openAlerts.length} alerta(s) aberto(s) · toque para tratar</Text>
          <Ionicons name="chevron-forward" size={20} color={t.tones.danger.fg} />
        </Pressable>
      ) : null}

      <Text style={s.intro}>
        Sensores simulados medem lotação, velocidade do Wi-Fi e temperatura. Quando algo sai do
        normal, o app gera um alerta.
      </Text>
    </View>
  );

  return (
    <Screen>
      <ScreenHeader
        title="Pontos de estudo"
        subtitle={isAgent ? 'Monitoramento em tempo real' : 'Veja onde estudar agora'}
      />
      <FlatList
        data={hubs}
        keyExtractor={(h) => h.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <HubCard
            hub={item}
            onPress={() => router.push({ pathname: '/hub/[id]', params: { id: item.id } })}
          />
        )}
      />
    </Screen>
  );
}
