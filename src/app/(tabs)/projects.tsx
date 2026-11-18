import React, { useEffect, useMemo, useState } from 'react';
import { Animated, FlatList, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Screen from '@/components/Screen';
import ScreenHeader from '@/components/ScreenHeader';
import ProjectCard from '@/components/ProjectCard';
import Chip from '@/components/Chip';
import FAB from '@/components/FAB';
import EmptyState from '@/components/EmptyState';
import SegmentedControl from '@/components/SegmentedControl';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useTheme } from '@/context/SettingsContext';
import { useCurrentUser } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { projectsStyles } from '@/styles/projects.styles';
import { CATEGORIES } from '@/constants';

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export default function ProjectsScreen() {
  const router = useRouter();
  const s = useThemedStyles(projectsStyles);
  const t = useTheme();
  const user = useCurrentUser();
  const { projects, myEnrollments, syncProjects } = useData();
  const isAgent = user.perfil === 'agente';
  const [tab, setTab] = useState<'explorar' | 'meus'>('explorar');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  // ao trocar de aba, a lista reaparece com um leve deslize
  const [fade] = useState(() => new Animated.Value(1));
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [tab, fade]);
  const aparicao = {
    opacity: fade,
    transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
  };

  // puxar a lista para baixo consulta a API e salva no aparelho os projetos novos
  const onRefresh = async () => {
    setSyncing(true);
    try {
      await syncProjects();
    } finally {
      setSyncing(false);
    }
  };

  const enrolledIds = useMemo(() => myEnrollments.map((e) => e.projectId), [myEnrollments]);

  const data = useMemo(() => {
    let list = projects;
    if (tab === 'meus') {
      list = isAgent
        ? projects.filter((p) => p.autorId === user.id)
        : projects.filter((p) => enrolledIds.includes(p.id));
    }
    if (category) list = list.filter((p) => p.categoria === category);
    const q = normalize(query.trim());
    if (q) {
      list = list.filter((p) =>
        normalize(`${p.titulo} ${p.organizacao} ${p.cidade} ${p.tags.join(' ')}`).includes(q)
      );
    }
    return list;
  }, [projects, tab, category, query, isAgent, user.id, enrolledIds]);

  const header = (
    <View>
      <View style={s.search}>
        <Ionicons name="search" size={20} color={t.colors.textMuted} />
        <TextInput
          style={s.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar curso, cidade ou tema"
          placeholderTextColor={t.colors.textMuted}
          accessibilityLabel="Buscar projetos por curso, cidade ou tema"
          returnKeyType="search"
        />
      </View>
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { key: 'explorar', label: 'Explorar' },
          { key: 'meus', label: isAgent ? 'Criados por mim' : 'Minhas inscrições' },
        ]}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.chips}
        keyboardShouldPersistTaps="handled"
      >
        <Chip label="Todos" selected={!category} onPress={() => setCategory(null)} />
        {CATEGORIES.map((c) => (
          <Chip
            key={c.key}
            label={c.key}
            icon={c.icon}
            selected={category === c.key}
            onPress={() => setCategory(category === c.key ? null : c.key)}
          />
        ))}
      </ScrollView>
      <Text style={s.count} accessibilityLiveRegion="polite">
        {data.length} {data.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
      </Text>
    </View>
  );

  return (
    <Screen>
      <ScreenHeader
        title="Projetos"
        subtitle={isAgent ? 'Gerencie e publique oportunidades' : 'Encontre sua próxima qualificação'}
      />
      <FlatList
        data={data}
        keyExtractor={(p) => p.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshing={syncing}
        onRefresh={onRefresh}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon={tab === 'meus' ? 'bookmark-outline' : 'search-outline'}
            title={tab === 'meus' ? 'Nada por aqui ainda' : 'Nenhum projeto encontrado'}
            text={
              tab === 'meus'
                ? isAgent
                  ? 'Publique seu primeiro projeto para começar a receber inscrições.'
                  : 'Inscreva-se em um projeto e acompanhe seu progresso aqui.'
                : 'Tente outra palavra ou remova os filtros.'
            }
            actionLabel={tab === 'meus' ? (isAgent ? 'Novo projeto' : 'Explorar projetos') : undefined}
            onAction={() => (isAgent ? router.push('/project/new') : setTab('explorar'))}
          />
        }
        renderItem={({ item }) => (
          <Animated.View style={aparicao}>
            <ProjectCard
              project={item}
              enrolled={enrolledIds.includes(item.id)}
              onPress={() => router.push({ pathname: '/project/[id]', params: { id: item.id } })}
            />
          </Animated.View>
        )}
      />
      {isAgent ? (
        <FAB label="Novo projeto" icon="add" onPress={() => router.push('/project/new')} />
      ) : null}
    </Screen>
  );
}
