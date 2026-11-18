// Simulação IoT dos "Pontos de Aprendizagem" (bibliotecas, telecentros, escolas abertas).
// Cada ponto tem 3 sensores: contagem de pessoas, velocidade do Wi-Fi e temperatura.
// Este arquivo só tem regras puras; quem grava no aparelho é o hubService.
import type { AlertType, Hub, HubStatus, Reading, SensorAlert } from '../types';
import { fmtDec, uid } from '../utils/format';

/**
 * Limites dos sensores. Cada alerta tem dois valores: um para abrir e outro,
 * mais folgado, para fechar (histerese). Sem isso um valor oscilando em volta
 * do limite abriria e fecharia o alerta a cada leitura.
 */
export const THRESHOLDS = {
  /** abre o alerta de conexão abaixo de 5 Mbps */
  wifiMin: 5,
  /** só fecha quando a conexão voltar acima de 8 Mbps */
  wifiClear: 8,
  /** abre o alerta de lotação a partir de 90% da capacidade */
  lotacao: 0.9,
  /** só fecha quando a lotação cair abaixo de 80% */
  lotacaoClear: 0.8,
  /** a partir daqui o ponto aparece como "Movimentado" */
  moderado: 0.6,
  /** abre o alerta de calor a partir de 31 °C */
  tempMax: 31,
  /** só fecha quando a temperatura cair abaixo de 29,5 °C */
  tempClear: 29.5,
};

/** chance de uma queda de Wi-Fi começar, por leitura de cada ponto */
const CHANCE_QUEDA_WIFI = 0.012;

/** um alerta fica aberto pelo menos este tempo antes de poder normalizar */
const MIN_OPEN_MS = 40000;

const ALERT_TYPES: AlertType[] = ['conexao', 'lotacao', 'temperatura'];
const MAX_ALERTS = 60;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const round1 = (n: number) => Math.round(n * 10) / 10;

export function initialReading(hub: Hub): Reading {
  return {
    ocupacao: hub.ocupacaoInicial,
    wifi: hub.baseWifi,
    temp: hub.baseTemp,
    dip: 0,
    ts: Date.now(),
  };
}

/**
 * Gera a próxima leitura dos sensores. Os valores andam devagar e puxam de
 * volta para o normal do ponto, então os alertas aparecem de vez em quando —
 * não a cada leitura. Quedas de Wi-Fi acontecem por sorteio, raramente.
 */
export function nextReading(hub: Hub, prev: Reading): Reading {
  // ocupação: muda pouco a cada leitura e tende a voltar ao movimento comum do ponto
  const ocupacao = clamp(
    Math.round(prev.ocupacao + rand(-1.4, 1.4) + (hub.ocupacaoInicial - prev.ocupacao) * 0.05),
    0,
    hub.capacidade
  );

  let dip = prev.dip || 0;
  let wifi: number;
  if (dip > 0) {
    wifi = rand(1.2, 4.6);
    dip -= 1;
  } else if (Math.random() < CHANCE_QUEDA_WIFI) {
    wifi = rand(1.2, 4.6);
    dip = Math.floor(rand(2, 5));
  } else {
    wifi = clamp(prev.wifi + rand(-2.5, 2.5) + (hub.baseWifi - prev.wifi) * 0.12, 8, 120);
  }

  const temp = clamp(prev.temp + rand(-0.25, 0.25) + (hub.baseTemp - prev.temp) * 0.04, 20, 36);
  return { ocupacao, wifi: round1(wifi), temp: round1(temp), dip, ts: Date.now() };
}

export function statusOf(hub: Hub, r: Reading): HubStatus {
  const ratio = r.ocupacao / hub.capacidade;
  if (r.wifi < THRESHOLDS.wifiMin) {
    return { key: 'instavel', label: 'Conexão instável', tone: 'danger' };
  }
  if (ratio >= THRESHOLDS.lotacao) return { key: 'lotado', label: 'Lotado', tone: 'danger' };
  if (ratio >= THRESHOLDS.moderado) return { key: 'moderado', label: 'Movimentado', tone: 'warn' };
  return { key: 'livre', label: 'Tranquilo', tone: 'success' };
}

type Condition = Pick<SensorAlert, 'tipo' | 'severidade' | 'titulo' | 'detalhe'>;

/**
 * Regras que transformam leituras em alertas.
 * `abertos` traz os tipos que já estão com alerta aberto neste ponto: para eles
 * vale o limite mais folgado, para o alerta não piscar a cada leitura.
 */
function evaluate(hub: Hub, r: Reading, abertos: Set<AlertType> = new Set()): Condition[] {
  const list: Condition[] = [];
  const limiteWifi = abertos.has('conexao') ? THRESHOLDS.wifiClear : THRESHOLDS.wifiMin;
  const limiteLotacao = abertos.has('lotacao') ? THRESHOLDS.lotacaoClear : THRESHOLDS.lotacao;
  const limiteTemp = abertos.has('temperatura') ? THRESHOLDS.tempClear : THRESHOLDS.tempMax;

  if (r.wifi < limiteWifi) {
    list.push({
      tipo: 'conexao',
      severidade: 'danger',
      titulo: 'Wi-Fi instável',
      detalhe: `Velocidade caiu para ${fmtDec(r.wifi)} Mbps.`,
    });
  }
  if (r.ocupacao / hub.capacidade >= limiteLotacao) {
    list.push({
      tipo: 'lotacao',
      severidade: 'warn',
      titulo: 'Ponto quase lotado',
      detalhe: `${r.ocupacao} de ${hub.capacidade} lugares ocupados.`,
    });
  }
  if (r.temp >= limiteTemp) {
    list.push({
      tipo: 'temperatura',
      severidade: 'warn',
      titulo: 'Ambiente quente',
      detalhe: `Temperatura em ${fmtDec(r.temp)} °C.`,
    });
  }
  return list;
}

interface AlertUpdate {
  /** lista completa já atualizada (mais recentes primeiro) */
  alerts: SensorAlert[];
  /** alertas abertos nesta leitura */
  created: SensorAlert[];
  /** alertas que voltaram ao normal nesta leitura */
  normalized: SensorAlert[];
}

/** Abre alertas novos e normaliza automaticamente os que deixaram de ocorrer. */
export function processAlerts(
  previous: SensorAlert[],
  hubs: Hub[],
  readings: Record<string, Reading>
): AlertUpdate {
  let alerts = [...previous];
  const created: SensorAlert[] = [];
  const normalized: SensorAlert[] = [];
  const now = Date.now();

  hubs.forEach((hub) => {
    const reading = readings[hub.id];
    if (!reading) return;

    const abertosNoPonto = new Set(
      alerts.filter((a) => a.hubId === hub.id && a.status !== 'normalizado').map((a) => a.tipo)
    );
    const conditions = evaluate(hub, reading, abertosNoPonto);

    ALERT_TYPES.forEach((tipo) => {
      const active = conditions.find((c) => c.tipo === tipo);
      const open = alerts.find(
        (a) => a.hubId === hub.id && a.tipo === tipo && a.status !== 'normalizado'
      );
      if (active && !open) {
        const alert: SensorAlert = {
          id: uid(),
          hubId: hub.id,
          hubNome: hub.nome,
          ...active,
          status: 'aberto',
          criadoEm: now,
        };
        alerts = [alert, ...alerts];
        created.push(alert);
        // só normaliza depois de um tempo aberto, para o alerta não piscar
      } else if (!active && open && now - open.criadoEm >= MIN_OPEN_MS) {
        const closed: SensorAlert = { ...open, status: 'normalizado', normalizadoEm: now };
        alerts = alerts.map((a) => (a.id === open.id ? closed : a));
        normalized.push(closed);
      }
    });
  });

  return { alerts: alerts.slice(0, MAX_ALERTS), created, normalized };
}
