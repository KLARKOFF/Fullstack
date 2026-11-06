import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useResource } from '@/shared/lib';
import { cancelBooking, createBooking, deleteBookingsForMachine, getSchedule } from '../api/bookingApi';
import { BookingsContext } from './BookingsContext';
import type { BookingsContextValue } from './BookingsContext';
import type { Booking } from './types';

const NO_BOOKINGS: Booking[] = [];

export function BookingsProvider({ children }: { children: ReactNode }) {
  const { data: bookings, setData, status, error, reload } = useResource(
    getSchedule,
    NO_BOOKINGS,
    'Не удалось загрузить расписание',
  );

  const value = useMemo<BookingsContextValue>(
    () => ({
      bookings,
      status,
      error,
      reload,
      create: async (data) => {
        const created = await createBooking(data);
        setData((prev) => [...prev, created]);
        return created;
      },
      cancel: async (id) => {
        await cancelBooking(id);
        setData((prev) => prev.filter((b) => b.id !== id));
      },
      forgetMachine: (machineId) => {
        deleteBookingsForMachine(machineId); // только для мока: backend удалит брони сам
        setData((prev) => prev.filter((b) => b.machineId !== machineId));
      },
    }),
    [bookings, status, error, reload, setData],
  );

  return <BookingsContext value={value}>{children}</BookingsContext>;
}
