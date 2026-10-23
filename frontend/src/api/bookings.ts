import type { Booking } from '../types';
import { ApiError, load, save } from './storage';

const KEY = 'mock_bookings';

const readAll = () => load<Booking[]>(KEY, []);

export async function getBookings(userId: string): Promise<Booking[]> {
  return readAll().filter((b) => b.userId === userId);
}

export async function createBooking(data: Omit<Booking, 'id'>): Promise<Booking> {
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
