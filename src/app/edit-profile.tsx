import { errorMessage } from '@/utils/errors';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import useGoBack from '@/hooks/useGoBack';
import Screen from '@/components/Screen';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Chip from '@/components/Chip';
import useForm, { type FormErrors } from '@/hooks/useForm';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useAuth, useCurrentUser } from '@/context/AuthContext';
import { useTheme } from '@/context/SettingsContext';
import { authStyles } from '@/styles/auth.styles';
import AvatarPicker from '@/components/AvatarPicker';
import { CATEGORIES, DEFAULT_AVATAR } from '@/constants';
import { maskPhone } from '@/utils/masks';
import { isPhone } from '@/utils/validators';
import { notify } from '@/utils/dialog';

type ProfileForm = {
  nome: string;
  telefone: string;
  cidade: string;
  endereco: string;
  organizacao: string;
  avatar: string;
  interesses: string[];
};

const validate = (v: ProfileForm): FormErrors<ProfileForm> => {
  const e: FormErrors<ProfileForm> = {};
  if (v.nome.trim().split(/\s+/).length < 2) e.nome = 'Informe nome e sobrenome.';
  if (!isPhone(v.telefone)) e.telefone = 'Informe o DDD e o número. Ex.: (11) 91234-5678';
  if (v.cidade.trim().length < 3) e.cidade = 'Informe sua cidade.';
  if (v.interesses.length === 0) e.interesses = 'Escolha pelo menos um interesse.';
  return e;
};

export default function EditProfileScreen() {
  const goBack = useGoBack('/profile');
  const s = useThemedStyles(authStyles);
  const t = useTheme();
  const user = useCurrentUser();
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm<ProfileForm>(
    {
      nome: user.nome,
      telefone: user.telefone,
      cidade: user.cidade,
      endereco: user.endereco ?? '',
      avatar: user.avatar ?? DEFAULT_AVATAR,
      organizacao: user.organizacao || '',
      interesses: user.interesses,
    },
    validate
  );
  const v = form.values;

  const toggle = (key: string) =>
    form.setField('interesses')(
      v.interesses.includes(key) ? v.interesses.filter((k) => k !== key) : [...v.interesses, key]
    );

  const onSubmit = form.submit(async (values) => {
    setLoading(true);
    try {
      await updateProfile({
        ...values,
        organizacao: user.perfil === 'agente' ? values.organizacao.trim() : null,
      });
      notify('Perfil atualizado', 'Suas informações foram salvas neste dispositivo.');
      goBack();
    } catch (e) {
      notify('Não foi possível salvar', errorMessage(e));
      setLoading(false);
    }
  });

  return (
    <Screen scroll edges={['bottom']}>
      <AvatarPicker label="Seu avatar" value={v.avatar} onChange={form.setField('avatar')} />
      <Input
        label="Nome completo"
        value={v.nome}
        onChangeText={form.setField('nome')}
        onBlur={form.blurField('nome')}
        error={form.errors.nome}
        autoCapitalize="words"
      />
      <Input
        label="Telefone"
        value={v.telefone}
        onChangeText={form.setField('telefone')}
        onBlur={form.blurField('telefone')}
        error={form.errors.telefone}
        mask={maskPhone}
        keyboardType="phone-pad"
      />
      <Input
        label="Cidade"
        value={v.cidade}
        onChangeText={form.setField('cidade')}
        onBlur={form.blurField('cidade')}
        error={form.errors.cidade}
      />
      <Input
        label="Endereço (opcional)"
        value={v.endereco}
        onChangeText={form.setField('endereco')}
        placeholder="Rua, número e bairro"
        autoCapitalize="words"
      />
      {user.perfil === 'agente' ? (
        <Input
          label="Organização ou projeto"
          value={v.organizacao}
          onChangeText={form.setField('organizacao')}
        />
      ) : null}

      <Text style={s.sectionLabel}>Áreas de interesse</Text>
      <View style={s.chips}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c.key}
            label={c.key}
            icon={c.icon}
            selected={v.interesses.includes(c.key)}
            onPress={() => toggle(c.key)}
          />
        ))}
      </View>
      {form.errors.interesses ? (
        <Text
          style={{ color: t.colors.danger, fontWeight: '600', marginBottom: 12, fontSize: t.fs(13) }}
          accessibilityLiveRegion="polite"
        >
          {form.errors.interesses}
        </Text>
      ) : (
        <View style={{ height: 12 }} />
      )}

      <Button title="Salvar alterações" icon="checkmark" onPress={onSubmit} loading={loading} />
    </Screen>
  );
}
