import React, { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
  type PanResponderGestureState,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useIoT } from '../context/IoTContext';
import { useTheme } from '../context/SettingsContext';
import useThemedStyles from '../hooks/useThemedStyles';
import { bannerStyles } from '../styles/components.styles';

const HIDDEN_Y = -160;
const VISIBLE_MS = 6000;

/**
 * Animação e gesto do aviso: desce do topo, e arrastar para cima
 * (ou para os lados) tira o aviso da tela.
 */
function createBannerMotion() {
  const slide = new Animated.Value(HIDDEN_Y);
  const dragX = new Animated.Value(0);
  let dragging = false;

  // ao soltar: dispensa o aviso se arrastou o bastante, senão volta ao lugar
  const settle = (_: GestureResponderEvent, g: PanResponderGestureState) => {
    const sideways = Math.abs(g.dx) > 80;
    if (g.dy < -30 || sideways) {
      Animated.parallel([
        Animated.timing(slide, { toValue: HIDDEN_Y, duration: 180, useNativeDriver: true }),
        Animated.timing(dragX, {
          toValue: sideways ? Math.sign(g.dx) * 500 : 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slide, { toValue: 0, useNativeDriver: true }),
        Animated.spring(dragX, { toValue: 0, useNativeDriver: true }),
      ]).start();
    }
    // no navegador o "click" chega logo depois de soltar: só então libera o toque
    setTimeout(() => {
      dragging = false;
    }, 150);
  };

  const responder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6 || Math.abs(g.dx) > 6,
    onPanResponderGrant: () => {
      dragging = true;
    },
    onPanResponderMove: (_, g) => {
      slide.setValue(Math.min(0, g.dy));
      dragX.setValue(g.dx);
    },
    onPanResponderRelease: settle,
    onPanResponderTerminate: settle,
  });

  return {
    slide,
    dragX,
    panHandlers: responder.panHandlers,
    /** true enquanto o dedo está arrastando (um arrasto não conta como toque) */
    isDragging: () => dragging,
    show: () => {
      dragX.setValue(0);
      Animated.spring(slide, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
    },
    hide: () => {
      Animated.timing(slide, { toValue: HIDDEN_Y, duration: 200, useNativeDriver: true }).start();
    },
  };
}

/**
 * Aviso que aparece no topo quando um sensor gera um alerta.
 * Agentes veem todos; cidadãos só os de pontos onde têm reserva.
 */
export default function LiveAlertBanner() {
  const { lastAlert, myReservations } = useIoT();
  const { user } = useAuth();
  const router = useRouter();
  const t = useTheme();
  const s = useThemedStyles(bannerStyles);
  const insets = useSafeAreaInsets();
  const [motion] = useState(createBannerMotion);

  // último alerta que interessa a este usuário (um alerta de outro ponto não o substitui)
  const [shown, setShown] = useState<typeof lastAlert>(null);
  const isAgent = user?.perfil === 'agente';

  if (
    user &&
    lastAlert &&
    lastAlert.token !== shown?.token &&
    (isAgent || myReservations.some((r) => r.hubId === lastAlert.alert.hubId))
  ) {
    setShown(lastAlert);
  }

  const alert = shown?.alert ?? null;
  const token = shown?.token;

  // cada novo alerta relevante faz o aviso descer; ele some sozinho depois de alguns segundos
  useEffect(() => {
    if (!token) return undefined;
    motion.show();
    const timer = setTimeout(motion.hide, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [token, motion]);

  const open = useCallback(() => {
    if (!alert || motion.isDragging()) return; // foi um arrasto, não um toque
    motion.hide();
    if (isAgent) router.navigate('/alerts');
    else router.navigate({ pathname: '/hub/[id]', params: { id: alert.hubId } });
  }, [alert, isAgent, motion, router]);

  if (!alert || !user) return null;
  const tone = t.tones[alert.severidade];

  return (
    <Animated.View
      {...motion.panHandlers}
      style={[
        s.wrap,
        {
          top: insets.top + 8,
          transform: [{ translateY: motion.slide }, { translateX: motion.dragX }],
        },
      ]}
    >
      <Pressable
        onPress={open}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
        accessibilityLabel={`Alerta: ${alert.titulo} em ${alert.hubNome}. ${alert.detalhe}`}
        accessibilityHint="Toque para ver detalhes ou arraste para cima para dispensar"
        style={[s.banner, { borderColor: tone.fg }]}
      >
        <View style={[s.icon, { backgroundColor: tone.bg }]}>
          <Ionicons name="warning" size={22} color={tone.fg} />
        </View>
        <View style={s.texts}>
          <Text style={s.title}>
            {alert.titulo} · {alert.hubNome}
          </Text>
          <Text style={s.sub}>
            {isAgent ? alert.detalhe : `${alert.detalhe} Considere outro ponto.`}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={t.colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}
