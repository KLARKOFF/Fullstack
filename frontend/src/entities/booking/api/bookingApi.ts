import { SLOT_MINUTES } from '@/shared/config';
import { ApiError, load, mockRequest, save } from '@/shared/api';
import { MINUTE, ms } from '@/shared/lib';
import type { Booking, BookingCreate } from '../model/types';

// Мок-API на localStorage. После интеграции с backend здесь будут запросы к /api/bookings.
const KEY = 'mock_bookings_v2';

function demoBooking(id: string, machineId: string, offset: number): Booking {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setTime(start.getTime() + offset * SLOT_MINUTES * MINUTE);
  const end = new Date(start.getTime() + SLOT_MINUTES * MINUTE);
  return { id, userId: 'demo', machineId, startAt: start.toISOString(), endAt: end.toISOString() };
}

const SEED: Booking[] = [
  demoBooking('demo-1', '02', 0),
  demoBooking('demo-2', '05', 0),
  demoBooking('demo-3', '03', -1),
  demoBooking('demo-4', '04', 2),
];

const readAll = () => load<Booking[]>(KEY, SEED);

export function getSchedule(): Promise<Booking[]> {
  return mockRequest(readAll);
}

export function createBooking(data: BookingCreate): Promise<Booking> {
  return mockRequest(() => {
    if (ms(data.endAt) <= Date.now()) {
      throw new ApiError('Нельзя забронировать время, которое уже прошло', 422);
    }

    const bookings = readAll();
    const isTaken = bookings.some(
      (b) => b.machineId === data.machineId && ms(b.startAt) < ms(data.endAt) && ms(data.startAt) < ms(b.endAt),
    );
    if (isTaken) {
      throw new ApiError('Это время уже занято, выберите другое', 409);
    }

    const created: Booking = { ...data, id: crypto.randomUUID() };
    save(KEY, [...bookings, created]);
    return created;
  });
}

export function cancelBooking(id: string): Promise<void> {
  return mockRequest(() => {
    const bookings = readAll();
    if (!bookings.some((b) => b.id === id)) {
      throw new ApiError('Бронирование не найдено', 404);
    }
    save(KEY, bookings.filter((b) => b.id !== id));
  });
}

/** В моке повторяем каскадное удаление (ON DELETE CASCADE на backend). */
export function deleteBookingsForMachine(machineId: string): void {
  save(KEY, readAll().filter((b) => b.machineId !== machineId));
}
