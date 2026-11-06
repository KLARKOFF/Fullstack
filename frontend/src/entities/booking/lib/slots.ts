import { FIRST_SLOT_HOUR, LAST_SLOT_HOUR, SLOT_MINUTES } from '@/shared/config';
import { MINUTE, ms } from '@/shared/lib';
import type { TimeInterval } from '@/shared/lib';

/** Часовой слот расписания. */
export interface Slot {
  start: Date;
  end: Date;
}

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

export function overlaps(slot: Slot, interval: TimeInterval): boolean {
  return slot.start.getTime() < ms(interval.endAt) && ms(interval.startAt) < slot.end.getTime();
}

export const slotToInterval = (slot: Slot): TimeInterval => ({
  startAt: slot.start.toISOString(),
  endAt: slot.end.toISOString(),
});
