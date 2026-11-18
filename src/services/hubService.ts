// Pontos de aprendizagem: cadastro dos pontos, histórico dos sensores,
// alertas e reservas — tudo salvo no AsyncStorage.
import type { Hub, Reading, Reservation, SensorAlert } from '../types';
import { KEYS, load, loadArray, save } from './storage';

/** quantas leituras por ponto ficam guardadas (alimenta o gráfico) */
export const HISTORY_SIZE = 24;

export type History = Record<string, Reading[]>;

// ---------- Pontos ----------

export const listHubs = (): Promise<Hub[]> => loadArray<Hub>(KEYS.hubs);

export const saveHubs = (hubs: Hub[]): Promise<void> => save(KEYS.hubs, hubs);

// ---------- Leituras dos sensores ----------

const isReading = (value: unknown): value is Reading =>
  !!value && typeof value === 'object' && typeof (value as Reading).ocupacao === 'number';

/**
 * Lê o histórico dos sensores. Uma versão antiga do app guardava outro formato
 * nesta chave (uma leitura por ponto, em vez de uma lista), então aqui o que
 * não for uma lista de leituras é descartado.
 */
export async function loadHistory(): Promise<History> {
  const saved = await load<unknown>(KEYS.readings, {});
  const history: History = {};
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return history;
  Object.entries(saved as Record<string, unknown>).forEach(([hubId, leituras]) => {
    if (Array.isArray(leituras)) history[hubId] = leituras.filter(isReading).slice(-HISTORY_SIZE);
  });
  return history;
}

/** Guarda o histórico já limitado a HISTORY_SIZE leituras por ponto. */
export function saveHistory(history: History): Promise<void> {
  const limitado: History = {};
  Object.entries(history).forEach(([hubId, readings]) => {
    limitado[hubId] = readings.slice(-HISTORY_SIZE);
  });
  return save(KEYS.readings, limitado);
}

// ---------- Alertas ----------

export const listAlerts = (): Promise<SensorAlert[]> => loadArray<SensorAlert>(KEYS.alerts);

export const saveAlerts = (alerts: SensorAlert[]): Promise<void> => save(KEYS.alerts, alerts);

// ---------- Reservas ----------

export const listReservations = (): Promise<Reservation[]> =>
  loadArray<Reservation>(KEYS.reservations);

export const saveReservations = (reservations: Reservation[]): Promise<void> =>
  save(KEYS.reservations, reservations);
