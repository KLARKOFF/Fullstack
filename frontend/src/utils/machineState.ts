import type { Booking, Machine, MachineState } from '../types';
import { MINUTE, ms } from './time';

/** Сколько минут после окончания брони машина считается «ожидает выгрузки». */
export const UNLOAD_MINUTES = 15;

export function getMachineState(machine: Machine, schedule: Booking[], now: Date): MachineState {
  if (machine.isUnderMaintenance) return { status: 'maintenance' };

  const t = now.getTime();
  const bookings = schedule
    .filter((b) => b.machineId === machine.id)
    .sort((a, b) => ms(a.startAt) - ms(b.startAt));

  const current = bookings.find((b) => ms(b.startAt) <= t && t < ms(b.endAt));
  if (current) return { status: 'in_use', booking: current };

  const justFinished = bookings.findLast(
    (b) => ms(b.endAt) <= t && t < ms(b.endAt) + UNLOAD_MINUTES * MINUTE,
  );
  if (justFinished) return { status: 'waiting', booking: justFinished };

  return { status: 'free', nextBooking: bookings.find((b) => ms(b.startAt) > t) };
}

/** Доля брони, которая уже прошла, в процентах. */
export function getProgress(booking: Booking, now: Date): number {
  const start = ms(booking.startAt);
  const percent = ((now.getTime() - start) / (ms(booking.endAt) - start)) * 100;
  return Math.min(100, Math.max(0, Math.round(percent)));
}

export const minutesLeft = (booking: Booking, now: Date) =>
  Math.max(0, Math.ceil((ms(booking.endAt) - now.getTime()) / MINUTE));