import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LiveAlertBanner from '@/components/LiveAlertBanner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { IoTProvider } from '@/context/IoTContext';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';

// mantém a splash até os dados serem lidos e a sessão restaurada
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, loading } = useAuth();
  const { theme: t } = useSettings();
  const logged = !!user;

  useEffect(() => {
    if (!loading) SplashScreen.hide();
  }, [loading]);

  if (loading) return null;

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: t.colors.bg },
          headerTintColor: t.colors.text,
          headerTitleStyle: { fontWeight: '800', fontSize: t.fs(17) },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: t.colors.bg },
        }}
      >
        {/* Rotas que exigem login */}
        <Stack.Protected guard={logged}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="project/[id]" options={{ title: 'Projeto' }} />
          <Stack.Screen name="project/new" options={{ title: 'Novo projeto' }} />
          <Stack.Screen
            name="post/new"
            options={{ title: 'Nova publicação', presentation: 'modal' }}
          />
          <Stack.Screen name="hub/[id]" options={{ title: 'Ponto de estudo' }} />
          <Stack.Screen name="alerts" options={{ title: 'Alertas dos sensores' }} />
          <Stack.Screen name="edit-profile" options={{ title: 'Editar perfil' }} />
        </Stack.Protected>

        {/* Rotas só para quem ainda não entrou */}
        <Stack.Protected guard={!logged}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ title: 'Criar conta' }} />
        </Stack.Protected>

        <Stack.Screen name="accessibility" options={{ title: 'Aparência e acessibilidade' }} />
      </Stack>
      <LiveAlertBanner />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <DataProvider>
          <IoTProvider>
            <RootNavigator />
          </IoTProvider>
        </DataProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
