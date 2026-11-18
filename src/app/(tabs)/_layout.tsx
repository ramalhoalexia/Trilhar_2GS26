import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useIoT } from '@/context/IoTContext';
import { useTheme } from '@/context/SettingsContext';
import type { IconName } from '@/types';

type TabIconProps = { color: ColorValue; focused: boolean };

const tabIcon = (active: IconName, inactive: IconName) =>
  function TabIcon({ color, focused }: TabIconProps) {
    // o navegador sempre envia a cor como texto (tabBarActiveTintColor / tabBarInactiveTintColor)
    const tint = typeof color === 'string' ? color : undefined;
    return <Ionicons name={focused ? active : inactive} size={24} color={tint} />;
  };

export default function TabsLayout() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { openAlerts } = useIoT();
  // o agente vê no ícone quantos alertas dos sensores estão abertos
  const alertBadge =
    user?.perfil === 'agente' && openAlerts.length > 0 ? openAlerts.length : undefined;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.primary,
        tabBarInactiveTintColor: t.colors.textMuted,
        tabBarLabelStyle: { fontSize: t.fs(12), fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: t.colors.surface,
          borderTopColor: t.colors.border,
          borderTopWidth: t.highContrast ? 1.5 : 0.5,
          // a altura acompanha o tamanho do texto para o rótulo nunca ficar cortado
          height: 60 + t.fs(12) + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
        },
        tabBarBadgeStyle: { backgroundColor: t.tones.danger.fg, color: '#FFFFFF' },
        sceneStyle: { backgroundColor: t.colors.bg },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', tabBarIcon: tabIcon('home', 'home-outline') }}
      />
      <Tabs.Screen
        name="projects"
        options={{ title: 'Projetos', tabBarIcon: tabIcon('school', 'school-outline') }}
      />
      <Tabs.Screen
        name="hubs"
        options={{
          title: 'Pontos',
          tabBarIcon: tabIcon('wifi', 'wifi-outline'),
          tabBarBadge: alertBadge,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}
