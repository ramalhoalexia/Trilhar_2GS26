export const uid = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** "AAAA-MM-DD" -> "DD/MM/AAAA" */
export function formatDateBR(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function timeAgo(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'ontem' : `há ${d} dias`;
}

export const firstName = (full = ''): string => full.trim().split(' ')[0] || '';

export const initials = (full = ''): string =>
  full
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export const fmtDec = (n: number): string => n.toFixed(1).replace('.', ',');
