export const MINUTE = 60_000;

/** Любой интервал времени в формате ISO: бронь, слот и т. п. */
export interface TimeInterval {
  startAt: string;
  endAt: string;
}

export const ms = (iso: string) => new Date(iso).getTime();

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Date → "YYYY-MM-DD" для <input type="date"> (по местному времени). */
export const toDateInputValue = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** "YYYY-MM-DD" → полночь этого дня по местному времени. */
export const fromDateInputValue = (value: string) => new Date(`${value}T00:00`);

const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
const dayFormat = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' });

export const formatTime = (d: Date | string) => timeFormat.format(new Date(d));

export function formatDay(d: Date | string, now = new Date()): string {
  const day = toDateInputValue(new Date(d));
  if (day === toDateInputValue(now)) return 'Сегодня';
  if (day === toDateInputValue(addDays(now, 1))) return 'Завтра';
  return dayFormat.format(new Date(d));
}

export const formatInterval = ({ startAt, endAt }: TimeInterval) =>
  `${formatDay(startAt)}, ${formatTime(startAt)}–${formatTime(endAt)}`;
