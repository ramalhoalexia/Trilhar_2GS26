import { errorMessage } from '@/utils/errors';
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import useGoBack from '@/hooks/useGoBack';
import Screen from '@/components/Screen';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Chip from '@/components/Chip';
import useForm, { type FormErrors } from '@/hooks/useForm';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useData } from '@/context/DataContext';
import { useCurrentUser } from '@/context/AuthContext';
import { authStyles } from '@/styles/auth.styles';
import { POST_TYPES } from '@/constants';
import { notify } from '@/utils/dialog';
import type { PostType } from '@/types';

type PostForm = { tipo: PostType; texto: string; projetoId: string | null };

const validate = (v: PostForm): FormErrors<PostForm> => {
  const e: FormErrors<PostForm> = {};
  if (v.texto.trim().length < 10) e.texto = 'Escreva pelo menos 10 caracteres.';
  return e;
};

export default function CreatePostScreen() {
  const goBack = useGoBack('/');
  // parâmetros opcionais para abrir a tela já preenchida (ex.: compartilhar um projeto)
  const preset = useLocalSearchParams<{ texto?: string; tipo?: string; projetoId?: string }>();
  const s = useThemedStyles(authStyles);
  const user = useCurrentUser();
  const { createPost, projects } = useData();
  const [loading, setLoading] = useState(false);
  const presetType = POST_TYPES.find((p) => p.key === preset.tipo)?.key;
  const form = useForm<PostForm>(
    {
      tipo: presetType ?? (user.perfil === 'agente' ? 'vaga' : 'dica'),
      texto: preset.texto ?? '',
      projetoId: preset.projetoId ?? null,
    },
    validate
  );
  const v = form.values;

  const onSubmit = form.submit(async (values) => {
    setLoading(true);
    try {
      await createPost(values);
      goBack();
    } catch (e) {
      notify('Não foi possível publicar', errorMessage(e));
      setLoading(false);
    }
  });

  return (
    <Screen scroll edges={['bottom']}>
      <Text style={s.sectionLabel}>Tipo de publicação</Text>
      <View style={s.chips}>
        {POST_TYPES.map((p) => (
          <Chip
            key={p.key}
            label={p.label}
            icon={p.icon}
            selected={v.tipo === p.key}
            onPress={() => form.setField('tipo')(p.key)}
          />
        ))}
      </View>

      <View style={{ height: 8 }} />
      <Input
        label="O que você quer compartilhar?"
        value={v.texto}
        onChangeText={form.setField('texto')}
        onBlur={form.blurField('texto')}
        error={form.errors.texto}
        multiline
        maxLength={280}
        placeholder="Conte uma conquista, tire uma dúvida ou divulgue uma vaga..."
        hint={`${v.texto.length}/280 caracteres`}
      />

      <Text style={s.sectionLabel}>Marcar um projeto (opcional)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
        <Chip
          label="Nenhum"
          selected={!v.projetoId}
          onPress={() => form.setField('projetoId')(null)}
        />
        {projects.map((p) => (
          <Chip
            key={p.id}
            label={p.titulo}
            selected={v.projetoId === p.id}
            onPress={() => form.setField('projetoId')(p.id)}
          />
        ))}
      </ScrollView>

      <Button title="Publicar" icon="send" onPress={onSubmit} loading={loading} />
    </Screen>
  );
}
