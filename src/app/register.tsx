import { errorMessage } from '@/utils/errors';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '@/components/Screen';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Chip from '@/components/Chip';
import SegmentedControl from '@/components/SegmentedControl';
import useForm, { type FormErrors } from '@/hooks/useForm';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useTheme } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { authStyles } from '@/styles/auth.styles';
import AvatarPicker from '@/components/AvatarPicker';
import { CATEGORIES, DEFAULT_AVATAR, PERFIS } from '@/constants';
import { maskCPF, maskPhone } from '@/utils/masks';
import { isCPF, isEmail, isPhone } from '@/utils/validators';
import type { Perfil } from '@/types';

type RegisterForm = {
  perfil: Perfil;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  cidade: string;
  endereco: string;
  organizacao: string;
  avatar: string;
  senha: string;
  confirmar: string;
  interesses: string[];
};

const validate = (v: RegisterForm): FormErrors<RegisterForm> => {
  const e: FormErrors<RegisterForm> = {};
  if (v.nome.trim().split(/\s+/).length < 2) e.nome = 'Informe nome e sobrenome.';
  if (!isEmail(v.email)) e.email = 'E-mail inválido. Exemplo: nome@email.com';
  if (!isCPF(v.cpf)) e.cpf = 'CPF inválido. Confira os 11 números.';
  if (!isPhone(v.telefone)) e.telefone = 'Informe o DDD e o número. Ex.: (11) 91234-5678';
  if (v.cidade.trim().length < 3) e.cidade = 'Informe sua cidade. Ex.: São Paulo - SP';
  if (v.perfil === 'agente' && v.organizacao.trim().length < 3) {
    e.organizacao = 'Informe a organização ou projeto que você representa.';
  }
  if (v.senha.length < 6) e.senha = 'A senha precisa ter pelo menos 6 caracteres.';
  if (v.confirmar !== v.senha) e.confirmar = 'As senhas não conferem.';
  if (v.interesses.length === 0) e.interesses = 'Escolha pelo menos um interesse.';
  return e;
};

export default function RegisterScreen() {
  const s = useThemedStyles(authStyles);
  const t = useTheme();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const form = useForm<RegisterForm>(
    {
      perfil: 'cidadao',
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      cidade: '',
      endereco: '',
      organizacao: '',
      avatar: DEFAULT_AVATAR,
      senha: '',
      confirmar: '',
      interesses: [],
    },
    validate
  );
  const v = form.values;

  const toggleInterest = (key: string) => {
    const next = v.interesses.includes(key)
      ? v.interesses.filter((k) => k !== key)
      : [...v.interesses, key];
    form.setField('interesses')(next);
  };

  const onSubmit = form.submit(async (values) => {
    setLoading(true);
    setError('');
    try {
      await signUp({
        perfil: values.perfil,
        nome: values.nome.trim(),
        email: values.email,
        cpf: values.cpf,
        telefone: values.telefone,
        cidade: values.cidade.trim(),
        endereco: values.endereco.trim() || null,
        avatar: values.avatar,
        organizacao: values.perfil === 'agente' ? values.organizacao.trim() : null,
        senha: values.senha,
        interesses: values.interesses,
      });
    } catch (e) {
      setError(errorMessage(e));
      setLoading(false);
    }
  });

  return (
    <Screen scroll edges={['bottom']}>
      <Text style={s.sectionLabel}>Eu sou</Text>
      <SegmentedControl
        value={v.perfil}
        onChange={form.setField('perfil')}
        options={Object.values(PERFIS).map((p) => ({ key: p.key, label: p.label }))}
      />
      <Text style={s.perfilHint}>{PERFIS[v.perfil].desc}</Text>

      <AvatarPicker value={v.avatar} onChange={form.setField('avatar')} />

      {error ? (
        <View style={s.errorBox} accessibilityRole="alert" accessibilityLiveRegion="assertive">
          <Ionicons name="alert-circle" size={20} color={t.tones.danger.fg} />
          <Text style={s.errorText}>{error}</Text>
        </View>
      ) : null}

      <Input
        label="Nome completo"
        icon="person-outline"
        value={v.nome}
        onChangeText={form.setField('nome')}
        onBlur={form.blurField('nome')}
        error={form.errors.nome}
        autoCapitalize="words"
        placeholder="Maria da Silva"
      />
      <Input
        label="E-mail"
        icon="mail-outline"
        value={v.email}
        onChangeText={form.setField('email')}
        onBlur={form.blurField('email')}
        error={form.errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="nome@email.com"
      />
      <Input
        label="CPF"
        icon="card-outline"
        value={v.cpf}
        onChangeText={form.setField('cpf')}
        onBlur={form.blurField('cpf')}
        error={form.errors.cpf}
        mask={maskCPF}
        keyboardType="number-pad"
        placeholder="000.000.000-00"
      />
      <Input
        label="Telefone"
        icon="call-outline"
        value={v.telefone}
        onChangeText={form.setField('telefone')}
        onBlur={form.blurField('telefone')}
        error={form.errors.telefone}
        mask={maskPhone}
        keyboardType="phone-pad"
        placeholder="(00) 00000-0000"
      />
      <Input
        label="Cidade"
        icon="location-outline"
        value={v.cidade}
        onChangeText={form.setField('cidade')}
        onBlur={form.blurField('cidade')}
        error={form.errors.cidade}
        placeholder="São Paulo - SP"
      />
      <Input
        label="Endereço (opcional)"
        icon="home-outline"
        value={v.endereco}
        onChangeText={form.setField('endereco')}
        placeholder="Rua, número e bairro"
        hint="Ajuda a encontrar cursos presenciais perto de você."
        autoCapitalize="words"
      />
      {v.perfil === 'agente' ? (
        <Input
          label="Organização ou projeto"
          icon="business-outline"
          value={v.organizacao}
          onChangeText={form.setField('organizacao')}
          onBlur={form.blurField('organizacao')}
          error={form.errors.organizacao}
          placeholder="Ex.: Instituto Código Aberto"
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
            onPress={() => toggleInterest(c.key)}
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

      <Input
        label="Senha"
        icon="lock-closed-outline"
        value={v.senha}
        onChangeText={form.setField('senha')}
        onBlur={form.blurField('senha')}
        error={form.errors.senha}
        secure
        autoCapitalize="none"
        hint="Mínimo de 6 caracteres"
      />
      <Input
        label="Confirmar senha"
        icon="lock-closed-outline"
        value={v.confirmar}
        onChangeText={form.setField('confirmar')}
        onBlur={form.blurField('confirmar')}
        error={form.errors.confirmar}
        secure
        autoCapitalize="none"
      />

      <Button title="Criar conta" onPress={onSubmit} loading={loading} />
    </Screen>
  );
}
