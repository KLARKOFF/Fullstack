import { BOOKING_DAYS_AHEAD } from '@/shared/config';
import { addDays, toDateInputValue } from '@/shared/lib';

/** Диапазон дат для брони: от сегодня до сегодня + BOOKING_DAYS_AHEAD. */
export function getBookingDayRange(now: Date) {
  return {
    min: toDateInputValue(now),
    max: toDateInputValue(addDays(now, BOOKING_DAYS_AHEAD)),
  };
}

export function validateBookingDay(day: string, now: Date): string | undefined {
  const { min, max } = getBookingDayRange(now);
  if (!day) return 'Выберите дату';
  // Строки "YYYY-MM-DD" можно сравнивать как текст
  if (day < min) return 'Нельзя бронировать на прошедшие дни';
  if (day > max) return `Бронировать можно не дальше чем на ${BOOKING_DAYS_AHEAD} дней вперёд`;
  return undefined;
}
