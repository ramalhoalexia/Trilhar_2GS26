import React, { useMemo, useState } from 'react';
import { FlatList, View, Text, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Screen from '@/components/Screen';
import ScreenHeader from '@/components/ScreenHeader';
import PostCard from '@/components/PostCard';
import StatTile from '@/components/StatTile';
import Chip from '@/components/Chip';
import FAB from '@/components/FAB';
import EmptyState from '@/components/EmptyState';
import ProgressBar from '@/components/ProgressBar';
import Avatar from '@/components/Avatar';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useTheme } from '@/context/SettingsContext';
import { useCurrentUser } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useIoT } from '@/context/IoTContext';
import { feedStyles } from '@/styles/feed.styles';
import { POST_TYPES } from '@/constants';
import { firstName } from '@/utils/format';
import type { PostType } from '@/types';

export default function FeedScreen() {
  const router = useRouter();
  const s = useThemedStyles(feedStyles);
  const t = useTheme();
  const user = useCurrentUser();
  const { posts, projects, myEnrollments, toggleLike, addComment } = useData();
  const { hubs, openAlerts, myReservations } = useIoT();
  const [filter, setFilter] = useState<PostType | 'todos'>('todos');
  const isAgent = user.perfil === 'agente';

  const filtered = useMemo(
    () => (filter === 'todos' ? posts : posts.filter((p) => p.tipo === filter)),
    [posts, filter]
  );

  const active = myEnrollments.find((e) => e.progresso < 100);
  const activeProject = active && projects.find((p) => p.id === active.projectId);
  const progress = active?.progresso ?? 0;
  const hubsFree = hubs.filter((h) => h.status.key === 'livre').length;
  const reservedAlerts = openAlerts.filter((a) =>
    myReservations.some((r) => r.hubId === a.hubId)
  );

  const goProject = (id: string) => router.push({ pathname: '/project/[id]', params: { id } });

  const header = (
    <View>
      <LinearGradient
        colors={t.colors.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.hero}
      >
        <Text style={s.heroHi}>Olá, {firstName(user.nome)} 👋</Text>
        {isAgent ? (
          <>
            <Text style={s.heroTitle}>
              {openAlerts.length > 0
                ? `${openAlerts.length} alerta(s) aberto(s) nos pontos de aprendizagem`
                : 'Tudo certo nos pontos de aprendizagem'}
            </Text>
            <Pressable
              onPress={() => router.push(openAlerts.length ? '/alerts' : '/project/new')}
              accessibilityRole="button"
              accessibilityLabel={openAlerts.length ? 'Ver alertas' : 'Publicar novo projeto'}
              style={s.heroBtn}
            >
              <Ionicons
                name={openAlerts.length ? 'notifications-outline' : 'add-circle-outline'}
                size={20}
                color="#3E31C9"
              />
              <Text style={s.heroBtnText}>
                {openAlerts.length ? 'Ver alertas' : 'Publicar projeto'}
              </Text>
            </Pressable>
          </>
        ) : activeProject ? (
          <>
            <Text style={s.heroTitle}>Continue sua trilha em {activeProject.titulo}</Text>
            <View style={s.heroProgress}>
              <Text style={s.heroProgressText}>{progress}% concluído</Text>
              <ProgressBar value={progress} color="#FFFFFF" label="Seu progresso" />
            </View>
            <Pressable
              onPress={() => goProject(activeProject.id)}
              accessibilityRole="button"
              accessibilityLabel="Continuar curso"
              style={s.heroBtn}
            >
              <Ionicons name="play" size={18} color="#3E31C9" />
              <Text style={s.heroBtnText}>Continuar</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={s.heroTitle}>Qual é o seu próximo passo? Encontre um projeto para você.</Text>
            <Pressable
              onPress={() => router.navigate('/projects')}
              accessibilityRole="button"
              accessibilityLabel="Explorar projetos"
              style={s.heroBtn}
            >
              <Ionicons name="search" size={18} color="#3E31C9" />
              <Text style={s.heroBtnText}>Explorar projetos</Text>
            </Pressable>
          </>
        )}
      </LinearGradient>

      <View style={s.tiles}>
        <StatTile icon="school-outline" value={projects.length} label="Projetos abertos" />
        <StatTile
          icon="wifi-outline"
          value={`${hubsFree}/${hubs.length}`}
          label="Pontos tranquilos"
          tone="success"
        />
        {isAgent ? (
          <StatTile
            icon="notifications-outline"
            value={openAlerts.length}
            label="Alertas abertos"
            tone={openAlerts.length ? 'danger' : 'accent'}
          />
        ) : (
          <StatTile
            icon="ribbon-outline"
            value={myEnrollments.length}
            label="Minhas inscrições"
            tone="accent"
          />
        )}
      </View>

      {!isAgent && reservedAlerts.length > 0 ? (
        <Pressable
          style={s.warnCard}
          onPress={() =>
            router.push({ pathname: '/hub/[id]', params: { id: reservedAlerts[0].hubId } })
          }
          accessibilityRole="button"
          accessibilityLabel={`Aviso: ${reservedAlerts[0].titulo} em ${reservedAlerts[0].hubNome}`}
        >
          <Ionicons name="warning" size={24} color={t.tones.warn.fg} />
          <Text style={s.warnText}>
            {reservedAlerts[0].titulo} em {reservedAlerts[0].hubNome}, onde você reservou. Toque para
            ver.
          </Text>
        </Pressable>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.chips}
        keyboardShouldPersistTaps="handled"
      >
        <Chip label="Tudo" selected={filter === 'todos'} onPress={() => setFilter('todos')} />
        {POST_TYPES.map((p) => (
          <Chip
            key={p.key}
            label={p.label}
            icon={p.icon}
            selected={filter === p.key}
            onPress={() => setFilter(p.key)}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Screen>
      <ScreenHeader
        title="Comunidade"
        subtitle="Conquistas, vagas e dicas de quem aprende junto"
        right={
          <Pressable
            onPress={() => router.navigate('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Abrir meu perfil"
            hitSlop={8}
          >
            <Avatar name={user.nome} avatar={user.avatar} size={44} />
          </Pressable>
        }
      />
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="Nada por aqui ainda"
            text="Seja o primeiro a compartilhar algo com a comunidade."
            actionLabel="Criar publicação"
            onAction={() => router.push('/post/new')}
          />
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            project={projects.find((p) => p.id === item.projetoId)}
            userId={user.id}
            onLike={toggleLike}
            onComment={addComment}
            onOpenProject={goProject}
          />
        )}
      />
      <FAB label="Publicar" icon="add" onPress={() => router.push('/post/new')} />
    </Screen>
  );
}
