import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import * as hubService from '../services/hubService';
import { HISTORY_SIZE, type History } from '../services/hubService';
import { initialReading, nextReading, processAlerts, statusOf } from '../services/iotService';
import type { Hub, LiveHub, Reading, Reservation, SensorAlert } from '../types';
import { uid } from '../utils/format';

/** intervalo entre leituras dos sensores simulados */
const TICK_MS = 3000;
/** a cada quantas leituras o histórico é gravado (evita escrever a cada 1,5 s) */
const SAVE_EVERY = 4;

type Readings = Record<string, Reading>;

interface LastAlert {
  alert: SensorAlert;
  token: number;
}

interface IoTValue {
  hubs: LiveHub[];
  history: History;
  alerts: SensorAlert[];
  openAlerts: SensorAlert[];
  reservations: Reservation[];
  myReservations: Reservation[];
  paused: boolean;
  lastAlert: LastAlert | null;
  setPaused: (paused: boolean) => void;
  forceIncident: (hubId: string) => Promise<void>;
  dispatchAlert: (alertId: string, agentName: string) => Promise<void>;
  reserve: (hubId: string) => Promise<void>;
  cancelReservation: (reservationId: string) => Promise<void>;
}

const IoTContext = createContext<IoTValue | null>(null);

export function IoTProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [hubDefs, setHubDefs] = useState<Hub[]>([]);
  const [readings, setReadings] = useState<Readings>({});
  const [history, setHistory] = useState<History>({});
  const [alerts, setAlerts] = useState<SensorAlert[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [paused, setPaused] = useState(false);
  const [lastAlert, setLastAlert] = useState<LastAlert | null>(null);

  // espelhos do estado para o laço da simulação não depender de closures antigas
  const hubsRef = useRef<Hub[]>([]);
  const readingsRef = useRef<Readings>({});
  const historyRef = useRef<History>({});
  const alertsRef = useRef<SensorAlert[]>([]);
  const busy = useRef(false);
  const ticks = useRef(0);

  // Carrega do aparelho: pontos, histórico dos sensores, alertas e reservas
  useEffect(() => {
    let active = true;
    (async () => {
      const [defs, savedHistory, savedAlerts, savedReservations] = await Promise.all([
        hubService.listHubs(),
        hubService.loadHistory(),
        hubService.listAlerts(),
        hubService.listReservations(),
      ]);
      if (!active) return;

      const initial: Readings = {};
      const startHistory: History = {};
      defs.forEach((hub) => {
        const past = savedHistory[hub.id] ?? [];
        startHistory[hub.id] = past.slice(-HISTORY_SIZE);
        initial[hub.id] = past.length ? past[past.length - 1] : initialReading(hub);
      });

      hubsRef.current = defs;
      readingsRef.current = initial;
      historyRef.current = startHistory;
      alertsRef.current = savedAlerts;
      setHubDefs(defs);
      setReadings(initial);
      setHistory(startHistory);
      setAlerts(savedAlerts);
      setReservations(savedReservations);
    })();
    return () => {
      active = false;
    };
  }, []);

  /** Publica uma nova leitura: atualiza a tela, avalia alertas e grava no aparelho. */
  const applyReadings = useCallback(async (next: Readings, forceSave = false) => {
    const update = processAlerts(alertsRef.current, hubsRef.current, next);
    const nextHistory: History = {};
    Object.keys(next).forEach((hubId) => {
      nextHistory[hubId] = [...(historyRef.current[hubId] ?? []), next[hubId]].slice(-HISTORY_SIZE);
    });

    readingsRef.current = next;
    historyRef.current = nextHistory;
    alertsRef.current = update.alerts;

    setReadings(next);
    setHistory(nextHistory);
    setAlerts(update.alerts);
    if (update.created.length) setLastAlert({ alert: update.created[0], token: Date.now() });

    // alertas são gravados assim que mudam; o histórico, de tempos em tempos
    const alertsChanged = update.created.length > 0 || update.normalized.length > 0;
    if (alertsChanged) await hubService.saveAlerts(update.alerts);

    ticks.current += 1;
    if (forceSave || alertsChanged || ticks.current % SAVE_EVERY === 0) {
      await hubService.saveHistory(nextHistory);
    }
  }, []);

  const tick = useCallback(async () => {
    if (busy.current || hubsRef.current.length === 0) return;
    busy.current = true;
    try {
      const next: Readings = {};
      hubsRef.current.forEach((hub) => {
        next[hub.id] = nextReading(hub, readingsRef.current[hub.id] ?? initialReading(hub));
      });
      await applyReadings(next);
    } finally {
      busy.current = false;
    }
  }, [applyReadings]);

  // Simulação dos sensores: uma nova leitura a cada TICK_MS enquanto há usuário logado
  useEffect(() => {
    if (!user || paused) return undefined;
    const id = setInterval(() => void tick(), TICK_MS);
    return () => clearInterval(id);
  }, [user, paused, tick]);

  /** Força uma leitura crítica (usado na demonstração). */
  const forceIncident = useCallback(
    async (hubId: string) => {
      const hub = hubsRef.current.find((h) => h.id === hubId);
      if (!hub) return;
      await applyReadings(
        {
          ...readingsRef.current,
          [hubId]: { ocupacao: hub.capacidade, wifi: 2.3, temp: 32.4, dip: 4, ts: Date.now() },
        },
        true
      );
    },
    [applyReadings]
  );

  const hubs = useMemo<LiveHub[]>(
    () =>
      hubDefs
        .filter((hub) => readings[hub.id])
        .map((hub) => ({
          ...hub,
          reading: readings[hub.id],
          status: statusOf(hub, readings[hub.id]),
          reservas: reservations.filter((r) => r.hubId === hub.id).length,
        })),
    [hubDefs, readings, reservations]
  );

  const dispatchAlert = useCallback(async (alertId: string, agentName: string) => {
    const next = alertsRef.current.map((a) =>
      a.id === alertId ? { ...a, status: 'em_atendimento' as const, acionadoPor: agentName } : a
    );
    alertsRef.current = next;
    setAlerts(next);
    await hubService.saveAlerts(next);
  }, []);

  const reserve = useCallback(
    async (hubId: string) => {
      if (!user) return;
      const hub = hubs.find((h) => h.id === hubId);
      if (!hub) throw new Error('Ponto não encontrado.');
      if (reservations.some((r) => r.hubId === hubId && r.userId === user.id)) {
        throw new Error('Você já reservou um lugar neste ponto.');
      }
      if (hub.status.key === 'lotado') {
        throw new Error('Este ponto está lotado agora. Tente outro ou volte mais tarde.');
      }
      const reservation: Reservation = { id: uid(), hubId, userId: user.id, criadoEm: Date.now() };
      const next = [reservation, ...reservations];
      setReservations(next);
      await hubService.saveReservations(next);
    },
    [hubs, reservations, user]
  );

  const cancelReservation = useCallback(
    async (reservationId: string) => {
      const next = reservations.filter((r) => r.id !== reservationId);
      setReservations(next);
      await hubService.saveReservations(next);
    },
    [reservations]
  );

  const openAlerts = useMemo(() => alerts.filter((a) => a.status !== 'normalizado'), [alerts]);
  const myReservations = useMemo(
    () => (user ? reservations.filter((r) => r.userId === user.id) : []),
    [reservations, user]
  );

  const value = useMemo(
    () => ({
      hubs,
      history,
      alerts,
      openAlerts,
      reservations,
      myReservations,
      paused,
      lastAlert,
      setPaused,
      forceIncident,
      dispatchAlert,
      reserve,
      cancelReservation,
    }),
    [
      hubs,
      history,
      alerts,
      openAlerts,
      reservations,
      myReservations,
      paused,
      lastAlert,
      forceIncident,
      dispatchAlert,
      reserve,
      cancelReservation,
    ]
  );

  return <IoTContext.Provider value={value}>{children}</IoTContext.Provider>;
}

export function useIoT(): IoTValue {
  const ctx = useContext(IoTContext);
  if (!ctx) throw new Error('useIoT precisa estar dentro de <IoTProvider>.');
  return ctx;
}
