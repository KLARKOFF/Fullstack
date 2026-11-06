import { MINUTE, ms } from '@/shared/lib';
import type { TimeInterval } from '@/shared/lib';
import type { Machine, MachineState } from './types';

/** Порядок машин в списке: по номеру, "2" раньше "10". */
export const compareMachines = (a: Machine, b: Machine) =>
  a.id.localeCompare(b.id, undefined, { numeric: true });

/** Сколько минут после окончания брони машина считается «ожидает выгрузки». */
export const UNLOAD_MINUTES = 15;

/** Состояние машины по её броням (передаются брони только этой машины). */
export function getMachineState(machine: Machine, bookings: TimeInterval[], now: Date): MachineState {
  if (machine.isUnderMaintenance) return { status: 'maintenance' };

  const t = now.getTime();
  const sorted = [...bookings].sort((a, b) => ms(a.startAt) - ms(b.startAt));

  const current = sorted.find((b) => ms(b.startAt) <= t && t < ms(b.endAt));
  if (current) return { status: 'in_use', booking: current };

  const justFinished = sorted.findLast(
    (b) => ms(b.endAt) <= t && t < ms(b.endAt) + UNLOAD_MINUTES * MINUTE,
  );
  if (justFinished) return { status: 'waiting', booking: justFinished };

  return { status: 'free', nextBooking: sorted.find((b) => ms(b.startAt) > t) };
}

/** Доля брони, которая уже прошла, в процентах. */
export function getProgress(booking: TimeInterval, now: Date): number {
  const start = ms(booking.startAt);
  const percent = ((now.getTime() - start) / (ms(booking.endAt) - start)) * 100;
  return Math.min(100, Math.max(0, Math.round(percent)));
}

export const minutesLeft = (booking: TimeInterval, now: Date) =>
  Math.max(0, Math.ceil((ms(booking.endAt) - now.getTime()) / MINUTE));
