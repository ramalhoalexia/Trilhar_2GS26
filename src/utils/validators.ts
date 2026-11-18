import { onlyDigits } from './masks';

export const isEmail = (value = ''): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export function isCPF(value = ''): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digit = (len: number): number => {
    let sum = 0;
    for (let i = 0; i < len; i += 1) sum += Number(cpf[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

export const isPhone = (value = ''): boolean => {
  const d = onlyDigits(value);
  return d.length === 10 || d.length === 11;
};

/** "DD/MM/AAAA" -> "AAAA-MM-DD" (ou null se a data não existir) */
export function parseDateBR(value = ''): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  const valid =
    date.getFullYear() === Number(yyyy) &&
    date.getMonth() === Number(mm) - 1 &&
    date.getDate() === Number(dd);
  return valid ? `${yyyy}-${mm}-${dd}` : null;
}

export function isFutureOrToday(iso: string | null): boolean {
  if (!iso) return false;
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target >= today;
}
