// Único módulo que fala com o AsyncStorage.
// Todo o resto do app passa pelos serviços (authService, projectService, ...),
// que usam estas funções. Assim a persistência fica isolada em uma camada só.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  /** versão dos dados gravados, usada na carga inicial e nas atualizações */
  version: '@trilhar:version',
  users: '@trilhar:users',
  session: '@trilhar:session',
  projects: '@trilhar:projects',
  enrollments: '@trilhar:enrollments',
  posts: '@trilhar:posts',
  hubs: '@trilhar:hubs',
  readings: '@trilhar:iot:readings',
  alerts: '@trilhar:iot:alerts',
  reservations: '@trilhar:iot:reservations',
  settings: '@trilhar:settings',
} as const;

/** Lê um valor salvo. Se não existir (ou estiver corrompido), devolve `fallback`. */
export async function load<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    // um valor ilegível não pode derrubar o app: volta ao padrão
    return fallback;
  }
}

/** Grava um valor. Deixa o erro subir para a tela avisar que não salvou. */
export async function save(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

/**
 * Lê uma lista salva. Se o que está gravado não for uma lista (dado de uma
 * versão antiga ou corrompido), devolve uma lista vazia em vez de quebrar.
 */
export async function loadArray<T>(key: string): Promise<T[]> {
  const saved = await load<unknown>(key, []);
  return Array.isArray(saved) ? (saved as T[]) : [];
}
