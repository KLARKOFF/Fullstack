import type { Booking } from '../types';

export const MINUTE = 60_000;

export const SLOT_MINUTES = 60;
export const FIRST_SLOT_HOUR = 8;
export const LAST_SLOT_HOUR = 22;
export const BOOKING_DAYS_AHEAD = 6;

export interface Slot {
  start: Date;
  end: Date;
}

export const ms = (iso: string) => new Date(iso).getTime();

/** Слоты на день, в который попадает date (по местному времени браузера). */
export function getDaySlots(date: Date): Slot[] {
  const slots: Slot[] = [];
  for (let hour = FIRST_SLOT_HOUR; hour <= LAST_SLOT_HOUR; hour++) {
    const start = new Date(date);
    start.setHours(hour, 0, 0, 0);
    slots.push({ start, end: new Date(start.getTime() + SLOT_MINUTES * MINUTE) });
  }
  return slots;
}

export function overlaps(slot: Slot, booking: Booking): boolean {
  return slot.start.getTime() < ms(booking.endAt) && ms(booking.startAt) < slot.end.getTime();
}

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

export const formatInterval = (startAt: string, endAt: string) =>
  `${formatDay(startAt)}, ${formatTime(startAt)}–${formatTime(endAt)}`;