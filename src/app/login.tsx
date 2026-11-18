import { errorMessage } from '@/utils/errors';
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Screen from '@/components/Screen';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import useForm, { type FormErrors } from '@/hooks/useForm';
import useThemedStyles from '@/hooks/useThemedStyles';
import { useTheme } from '@/context/SettingsContext';
import { useAuth } from '@/context/AuthContext';
import { authStyles } from '@/styles/auth.styles';
import { isEmail } from '@/utils/validators';
import type { IconName } from '@/types';

type LoginForm = { email: string; senha: string };

const HIGHLIGHTS: { icon: IconName; label: string }[] = [
  { icon: 'school-outline', label: 'Projetos' },
  { icon: 'people-outline', label: 'Comunidade' },
  { icon: 'wifi-outline', label: 'Pontos ao vivo' },
];

const validate = (v: LoginForm): FormErrors<LoginForm> => {
  const e: FormErrors<LoginForm> = {};
  if (!v.email.trim()) e.email = 'Informe seu e-mail.';
  else if (!isEmail(v.email)) e.email = 'E-mail inválido. Exemplo: nome@email.com';
  if (!v.senha) e.senha = 'Informe sua senha.';
  return e;
};

export default function LoginScreen() {
  const router = useRouter();
  const s = useThemedStyles(authStyles);
  const t = useTheme();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const form = useForm<LoginForm>({ email: '', senha: '' }, validate);

  const onSubmit = form.submit(async (v) => {
    setLoading(true);
    setError('');
    try {
      await signIn(v.email, v.senha);
    } catch (e) {
      setError(errorMessage(e));
      setLoading(false);
    }
  });

  const fillDemo = (email: string) => {
    form.reset({ email, senha: '123456' });
    setError('');
  };

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <LinearGradient
        colors={t.colors.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.hero}
      >
        <View style={s.logoRow}>
          <View style={s.logo}>
            <Logo size={26} color="#FFFFFF" label="Trilhar" />
          </View>
          <Text style={s.brand}>Trilhar</Text>
        </View>
        <Text style={s.tagline}>Aprender é melhor junto. Encontre seu próximo passo.</Text>
        <Text style={s.taglineSub}>
          A rede que conecta cidadãos a projetos de educação e qualificação perto de você.
        </Text>
        <View style={s.pills}>
          {HIGHLIGHTS.map(({ icon, label }) => (
            <View key={label} style={s.pill}>
              <Ionicons name={icon} size={14} color="#FFFFFF" />
              <Text style={s.pillText}>{label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <Text style={s.title} accessibilityRole="header">
        Entrar na sua conta
      </Text>

      {error ? (
        <View style={s.errorBox} accessibilityRole="alert" accessibilityLiveRegion="assertive">
          <Ionicons name="alert-circle" size={20} color={t.tones.danger.fg} />
          <Text style={s.errorText}>{error}</Text>
        </View>
      ) : null}

      <Input
        label="E-mail"
        icon="mail-outline"
        value={form.values.email}
        onChangeText={form.setField('email')}
        onBlur={form.blurField('email')}
        error={form.errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        placeholder="nome@email.com"
      />
      <Input
        label="Senha"
        icon="lock-closed-outline"
        value={form.values.senha}
        onChangeText={form.setField('senha')}
        onBlur={form.blurField('senha')}
        error={form.errors.senha}
        secure
        autoCapitalize="none"
        placeholder="Sua senha"
      />
      <Button title="Entrar" onPress={onSubmit} loading={loading} />

      <View style={s.divider}>
        <View style={s.line} />
        <Text style={s.dividerText}>ou teste com uma conta demo</Text>
        <View style={s.line} />
      </View>
      <View style={s.demoRow}>
        <Button
          title="Cidadão"
          icon="person-outline"
          variant="secondary"
          small
          style={{ flex: 1 }}
          onPress={() => fillDemo('maria@trilhar.com')}
          accessibilityHint="Preenche e-mail e senha da conta demo de cidadão"
        />
        <Button
          title="Agente"
          icon="shield-checkmark-outline"
          variant="secondary"
          small
          style={{ flex: 1 }}
          onPress={() => fillDemo('agente@trilhar.com')}
          accessibilityHint="Preenche e-mail e senha da conta demo de agente"
        />
      </View>

      <View style={s.footer}>
        <Pressable onPress={() => router.push('/register')} accessibilityRole="button">
          <Text style={s.linkText}>
            Ainda não tem conta? <Text style={s.link}>Cadastre-se</Text>
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push('/accessibility')} accessibilityRole="button">
          <Text style={s.link}>Aparência e acessibilidade</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
