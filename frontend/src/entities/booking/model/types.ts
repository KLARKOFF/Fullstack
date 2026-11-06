import type { TimeInterval } from '@/shared/lib';

export interface Booking extends TimeInterval {
  id: string;
  userId: string;
  machineId: string;
}

export type BookingCreate = Omit<Booking, 'id'>;
