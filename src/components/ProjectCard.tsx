import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import Badge from './Badge';
import ProgressBar from './ProgressBar';
import useThemedStyles from '../hooks/useThemedStyles';
import { useTheme } from '../context/SettingsContext';
import { projectCardStyles } from '../styles/components.styles';
import { categoryOf } from '../constants';
import { formatDateBR } from '../utils/format';
import type { Project } from '../types';

type Props = {
  project: Project;
  onPress: () => void;
  enrolled?: boolean;
};

export default function ProjectCard({ project, onPress, enrolled = false }: Props) {
  const s = useThemedStyles(projectCardStyles);
  const t = useTheme();
  const cat = categoryOf(project.categoria);
  const livres = project.vagas - project.inscritos;
  const lotado = livres <= 0;
  const iconColor = t.highContrast ? t.colors.primary : cat.color;

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${project.titulo}, ${project.organizacao}. ${project.modalidade}, ${project.cargaHoraria} horas. ${
        lotado ? 'Sem vagas' : `${livres} vagas`
      }${enrolled ? '. Você está inscrito' : ''}`}
      accessibilityHint="Abre os detalhes do projeto"
    >
      <View style={s.top}>
        <View style={[s.icon, { backgroundColor: t.highContrast ? t.colors.surfaceAlt : `${cat.color}1F` }]}>
          <Ionicons name={cat.icon} size={26} color={iconColor} />
        </View>
        <View style={s.info}>
          <Text style={s.title} numberOfLines={2}>
            {project.titulo}
          </Text>
          <Text style={s.org} numberOfLines={1}>
            {project.organizacao}
          </Text>
        </View>
        {enrolled ? <Badge text="Inscrito" tone="success" icon="checkmark-circle" /> : null}
      </View>

      <View style={s.metaRow}>
        <Badge text={project.modalidade} tone="primary" />
        <View style={s.meta}>
          <Ionicons name="time-outline" size={14} color={t.colors.textMuted} />
          <Text style={s.metaText}>{project.cargaHoraria}h</Text>
        </View>
        <View style={s.meta}>
          <Ionicons name="calendar-outline" size={14} color={t.colors.textMuted} />
          <Text style={s.metaText}>{formatDateBR(project.inicio)}</Text>
        </View>
        <View style={s.meta}>
          <Ionicons name="location-outline" size={14} color={t.colors.textMuted} />
          <Text style={s.metaText}>{project.cidade}</Text>
        </View>
      </View>

      <View style={s.footer}>
        <Text style={s.vagasText}>
          {lotado ? 'Vagas esgotadas' : `${livres} vagas restantes de ${project.vagas}`}
        </Text>
        <ProgressBar
          value={(project.inscritos / project.vagas) * 100}
          color={lotado ? t.tones.danger.fg : cat.color}
          label="Ocupação das vagas"
        />
      </View>
    </Card>
  );
}
