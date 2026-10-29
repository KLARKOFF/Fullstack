import type { Booking, MachineType } from '../types';
import { MINUTE, SLOT_MINUTES } from '../utils/time';
import { ApiError, load, save } from './storage';

const KEY = 'mock_bookings_v2';

function demoBooking(id: string, machineId: string, machineType: MachineType, offset: number): Booking {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setTime(start.getTime() + offset * SLOT_MINUTES * MINUTE);
  const end = new Date(start.getTime() + SLOT_MINUTES * MINUTE);
  return { id, userId: 'demo', machineId, machineType, startAt: start.toISOString(), endAt: end.toISOString() };
}

const SEED: Booking[] = [
  demoBooking('demo-1', '02', 'washer', 0),
  demoBooking('demo-2', '05', 'dryer', 0),
  demoBooking('demo-3', '03', 'washer', -1),
  demoBooking('demo-4', '04', 'washer', 2),
];

const readAll = () => load<Booking[]>(KEY, SEED);

export async function getSchedule(): Promise<Booking[]> {
  return readAll();
}

export async function createBooking(data: Omit<Booking, 'id'>): Promise<Booking> {
  if (new Date(data.endAt).getTime() <= Date.now()) {
    throw new ApiError('Нельзя забронировать время, которое уже прошло', 422);
  }
  const created: Booking = { ...data, id: crypto.randomUUID() };
  save(KEY, [...readAll(), created]);
  return created;
}

export async function cancelBooking(id: string): Promise<void> {
  const bookings = readAll();
  if (!bookings.some((b) => b.id === id)) {
    throw new ApiError('Бронирование не найдено', 404);
  }
  save(KEY, bookings.filter((b) => b.id !== id));
}

export function deleteBookingsForMachine(machineId: string): void {
  save(KEY, readAll().filter((b) => b.machineId !== machineId));
}