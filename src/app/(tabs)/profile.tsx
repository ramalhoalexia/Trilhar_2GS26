import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Screen from '@/components/Screen';
import ScreenHeader from '@/components/ScreenHeader';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import StatTile from '@/components/StatTile';
import ListRow from '@/components/ListRow';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useTheme } from '@/context/SettingsContext';
import { useAuth, useCurrentUser } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useIoT } from '@/context/IoTContext';
import { profileStyles } from '@/styles/profile.styles';
import { confirm } from '@/utils/dialog';

export default function ProfileScreen() {
  const router = useRouter();
  const s = useThemedStyles(profileStyles);
  const t = useTheme();
  const user = useCurrentUser();
  const { signOut } = useAuth();
  const { projects, myEnrollments } = useData();
  const { hubs, myReservations, cancelReservation, openAlerts } = useIoT();
  const isAgent = user.perfil === 'agente';
  const concluidos = myEnrollments.filter((e) => e.progresso === 100).length;
  const criados = projects.filter((p) => p.autorId === user.id).length;

  const onSignOut = () =>
    confirm('Sair da conta?', 'Você poderá entrar novamente quando quiser.', signOut, 'Sair');

  return (
    <Screen scroll>
      <ScreenHeader title="Meu perfil" />
      <LinearGradient
        colors={t.colors.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.hero}
      >
        <View style={s.avatarRing}>
          <Avatar name={user.nome} avatar={user.avatar} size={76} />
        </View>
        <Text style={s.name}>{user.nome}</Text>
        <Text style={s.email}>{user.email}</Text>
        {user.endereco ? <Text style={s.email}>{user.endereco}</Text> : null}
        <View style={s.badgeRow}>
          <Badge
            text={isAgent ? 'Agente' : 'Cidadão'}
            tone="primary"
            icon={isAgent ? 'shield-checkmark' : 'person'}
          />
          <Badge text={user.cidade} tone="neutral" icon="location-outline" />
        </View>
      </LinearGradient>

      <View style={s.tiles}>
        {isAgent ? (
          <>
            <StatTile icon="rocket-outline" value={criados} label="Projetos criados" />
            <StatTile
              icon="notifications-outline"
              value={openAlerts.length}
              label="Alertas abertos"
              tone={openAlerts.length ? 'danger' : 'success'}
            />
          </>
        ) : (
          <>
            <StatTile icon="school-outline" value={myEnrollments.length} label="Inscrições" />
            <StatTile icon="trophy-outline" value={concluidos} label="Concluídos" tone="success" />
            <StatTile
              icon="bookmark-outline"
              value={myReservations.length}
              label="Reservas"
              tone="accent"
            />
          </>
        )}
      </View>

      {!isAgent ? (
        <>
          <SectionTitle title="Minhas reservas" />
          <View style={s.card}>
            {myReservations.length === 0 ? (
              <Text style={[s.reservationSub, { paddingVertical: 14 }]}>
                Você ainda não reservou nenhum ponto de estudo. Veja a aba Pontos.
              </Text>
            ) : (
              myReservations.map((r) => {
                const hub = hubs.find((h) => h.id === r.hubId);
                return (
                  <View key={r.id} style={s.reservation}>
                    <Ionicons name="bookmark" size={22} color={t.tones.accent.fg} />
                    <View style={s.reservationText}>
                      <Text style={s.reservationName}>{hub?.nome}</Text>
                      <Text style={s.reservationSub}>{hub?.bairro}</Text>
                    </View>
                    <Pressable
                      onPress={() => cancelReservation(r.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Cancelar reserva em ${hub?.nome}`}
                      hitSlop={10}
                    >
                      <Ionicons name="close-circle" size={26} color={t.tones.danger.fg} />
                    </Pressable>
                  </View>
                );
              })
            )}
          </View>
        </>
      ) : null}

      <SectionTitle title="Interesses" />
      <View style={s.card}>
        <View style={s.interests}>
          {user.interesses.map((i) => (
            <Badge key={i} text={i} tone="primary" />
          ))}
        </View>
      </View>

      <SectionTitle title="Conta" />
      <View style={s.card}>
        <ListRow
          icon="create-outline"
          label="Editar perfil"
          value="Avatar, nome, endereço e interesses"
          onPress={() => router.push('/edit-profile')}
        />
        <View style={s.divider} />
        <ListRow
          icon="contrast-outline"
          tone="accent"
          label="Aparência e acessibilidade"
          value="Modo noturno, contraste e tamanho do texto"
          onPress={() => router.push('/accessibility')}
        />
      </View>

      <Button title="Sair da conta" variant="danger" icon="log-out-outline" onPress={onSignOut} />
      <Text style={s.footer}>Trilhar · CitizenTech · versão 1.0</Text>
    </Screen>
  );
}
