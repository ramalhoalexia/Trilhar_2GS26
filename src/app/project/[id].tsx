import { errorMessage } from '@/utils/errors';
import React, { useState } from 'react';
import { Linking, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Screen from '@/components/Screen';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import ProgressBar from '@/components/ProgressBar';
import EmptyState from '@/components/EmptyState';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useTheme } from '@/context/SettingsContext';
import { useCurrentUser } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { projectsStyles } from '@/styles/projects.styles';
import type { Gradient } from '@/styles/theme';
import { categoryOf } from '@/constants';
import { formatDateBR } from '@/utils/format';
import { confirm, notify } from '@/utils/dialog';
import type { IconName, PostType } from '@/types';

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = useThemedStyles(projectsStyles);
  const t = useTheme();
  const user = useCurrentUser();
  const { projects, myEnrollments, enroll, unenroll, setProgress } = useData();
  const [busy, setBusy] = useState(false);
  const project = projects.find((p) => p.id === id);
  const isAgent = user.perfil === 'agente';

  if (!project) {
    return (
      <Screen edges={['bottom']}>
        <EmptyState icon="alert-circle-outline" title="Projeto não encontrado" />
      </Screen>
    );
  }

  const cat = categoryOf(project.categoria);
  const enrollment = myEnrollments.find((e) => e.projectId === project.id);
  const livres = project.vagas - project.inscritos;
  const done = enrollment?.progresso === 100;
  const heroColors: Gradient = t.highContrast
    ? t.colors.hero
    : [cat.color, `${cat.color}CC`, '#13132B'];
  const facts: { icon: IconName; label: string; value: string }[] = [
    { icon: 'laptop-outline', label: 'Modalidade', value: project.modalidade },
    { icon: 'time-outline', label: 'Carga horária', value: `${project.cargaHoraria} horas` },
    { icon: 'calendar-outline', label: 'Início', value: formatDateBR(project.inicio) },
    { icon: 'location-outline', label: 'Local', value: project.cidade },
  ];

  // endereço só faz sentido para aulas presenciais ou híbridas
  const address = project.modalidade !== 'Online' ? project.endereco : null;
  const openMap = () => {
    const query = encodeURIComponent(`${address}, ${project.cidade}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() =>
      notify('Não foi possível abrir o mapa', 'Copie o endereço e procure no seu app de mapas.')
    );
  };

  const share = (texto: string, tipo: PostType) =>
    router.push({ pathname: '/post/new', params: { texto, tipo, projetoId: project.id } });

  const onEnroll = async () => {
    setBusy(true);
    try {
      await enroll(project.id);
      notify('Inscrição confirmada! 🎉', `Você entrou em "${project.titulo}". Bons estudos!`);
    } catch (e) {
      notify('Não foi possível se inscrever', errorMessage(e));
    }
    setBusy(false);
  };

  const onLeave = () =>
    confirm(
      'Cancelar inscrição?',
      'Seu progresso neste projeto será removido.',
      () => unenroll(project.id),
      'Cancelar inscrição'
    );

  const advance = async () => {
    if (!enrollment) return;
    const next = Math.min(100, enrollment.progresso + 10);
    await setProgress(project.id, next);
    if (next === 100) {
      confirm(
        'Você concluiu o projeto! 🏆',
        'Quer compartilhar sua conquista com a comunidade?',
        () =>
          share(`Concluí o projeto "${project.titulo}"! Foi uma jornada incrível de aprendizado. 🎓`, 'conquista'),
        'Compartilhar'
      );
    }
  };

  return (
    <Screen scroll edges={['bottom']}>
      <LinearGradient colors={heroColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
        <View style={s.heroIcon}>
          <Ionicons name={cat.icon} size={30} color="#FFFFFF" />
        </View>
        <Text style={s.heroTitle} accessibilityRole="header">
          {project.titulo}
        </Text>
        <Text style={s.heroOrg}>{project.organizacao}</Text>
      </LinearGradient>

      <View style={s.facts}>
        {facts.map(({ icon, label, value }) => (
          <View key={label} style={s.fact} accessible accessibilityLabel={`${label}: ${value}`}>
            <Ionicons name={icon} size={20} color={t.tones.primary.fg} />
            <Text style={s.factLabel}>{label}</Text>
            <Text style={s.factValue}>{value}</Text>
          </View>
        ))}
      </View>

      {address ? (
        <View style={s.progressBox}>
          <View
            style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}
            accessible
            accessibilityLabel={`Endereço das aulas: ${address}, ${project.cidade}`}
          >
            <Ionicons name="navigate-circle-outline" size={28} color={t.tones.primary.fg} />
            <View style={{ flex: 1 }}>
              <Text style={s.progressTitle}>Onde acontece</Text>
              <Text style={[s.factValue, { marginTop: 4 }]}>{address}</Text>
              <Text style={s.factLabel}>{project.cidade}</Text>
            </View>
          </View>
          <View style={s.progressBtns}>
            <Button
              title="Ver no mapa"
              icon="map-outline"
              variant="secondary"
              small
              style={{ flex: 1 }}
              onPress={openMap}
              accessibilityHint="Abre o endereço no aplicativo de mapas"
            />
          </View>
        </View>
      ) : null}

      <Text style={s.h2} accessibilityRole="header">
        Sobre o projeto
      </Text>
      <Text style={s.body}>{project.descricao}</Text>

      <View style={s.tags}>
        <Badge text={project.categoria} tone="primary" />
        <Badge text={project.nivel} tone="accent" />
        {project.certificado ? <Badge text="Com certificado" tone="success" icon="ribbon-outline" /> : null}
        {project.tags.map((tag) => (
          <Badge key={tag} text={tag} />
        ))}
      </View>

      <View style={s.progressBox}>
        <View style={s.progressTop}>
          <Text style={s.progressTitle}>Vagas</Text>
          <Text style={s.progressPct}>
            {livres > 0 ? `${livres} disponíveis` : 'Esgotadas'}
          </Text>
        </View>
        <ProgressBar
          value={(project.inscritos / project.vagas) * 100}
          color={livres > 0 ? cat.color : t.tones.danger.fg}
          label="Ocupação das vagas"
        />
        <Text style={[s.factLabel, { marginTop: 8 }]}>
          {project.inscritos} de {project.vagas} vagas preenchidas
        </Text>
      </View>

      {!isAgent && enrollment ? (
        <View style={s.progressBox}>
          <View style={s.progressTop}>
            <Text style={s.progressTitle}>{done ? 'Projeto concluído 🏆' : 'Seu progresso'}</Text>
            <Text style={s.progressPct}>{enrollment.progresso}%</Text>
          </View>
          <ProgressBar value={enrollment.progresso} label="Seu progresso" />
          <View style={s.progressBtns}>
            {done ? (
              <Button
                title="Compartilhar conquista"
                icon="share-social-outline"
                small
                style={{ flex: 1 }}
                onPress={() =>
                  share(`Concluí o projeto "${project.titulo}"! 🎓`, 'conquista')
                }
              />
            ) : (
              <Button
                title="Registrar +10% de progresso"
                icon="trending-up"
                variant="secondary"
                small
                style={{ flex: 1 }}
                onPress={advance}
              />
            )}
          </View>
        </View>
      ) : null}

      {isAgent ? (
        <View style={s.agentBox}>
          <Text style={s.agentText}>
            Contato do organizador: {project.contato}
            {'\n'}
            {project.inscritos} cidadãos inscritos até agora.
          </Text>
        </View>
      ) : null}

      <View style={s.actions}>
        {!isAgent ? (
          enrollment ? (
            <Button title="Cancelar inscrição" variant="danger" icon="close-circle-outline" onPress={onLeave} />
          ) : (
            <Button
              title={livres > 0 ? 'Quero me inscrever' : 'Vagas esgotadas'}
              icon="checkmark-circle-outline"
              onPress={onEnroll}
              loading={busy}
              disabled={livres <= 0}
            />
          )
        ) : null}
        <Button
          title={isAgent ? 'Divulgar na comunidade' : 'Compartilhar com a comunidade'}
          icon="megaphone-outline"
          variant="ghost"
          onPress={() =>
            share(
              isAgent
                ? `Novas vagas em "${project.titulo}"! Inscreva-se pelo Trilhar. 👇`
                : `Estou olhando o projeto "${project.titulo}". Alguém quer fazer junto?`,
              isAgent ? 'vaga' : 'duvida'
            )
          }
        />
      </View>
    </Screen>
  );
}
