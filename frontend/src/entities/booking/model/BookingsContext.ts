import { createContext } from 'react';
import { useRequiredContext } from '@/shared/lib';
import type { LoadStatus } from '@/shared/lib';
import type { Booking, BookingCreate } from './types';

export interface BookingsContextValue {
  /** Все брони (расписание всех машин). */
  bookings: Booking[];
  status: LoadStatus;
  error: string;
  reload: () => void;
  create: (data: BookingCreate) => Promise<Booking>;
  cancel: (id: string) => Promise<void>;
  /** Убрать брони удалённой машины. */
  forgetMachine: (machineId: string) => void;
}

export const BookingsContext = createContext<BookingsContextValue | null>(null);

/** Расписание броней и действия с ним. */
export const useBookings = () => useRequiredContext(BookingsContext, 'useBookings');
