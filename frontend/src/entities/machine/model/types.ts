import type { TimeInterval } from '@/shared/lib';

export type MachineType = 'washer' | 'dryer';
export type MachineStatus = 'free' | 'in_use' | 'waiting' | 'maintenance';

export interface Machine {
  /** Номер машины в прачечной, например "07". */
  id: string;
  type: MachineType;
  /** Загрузка, кг. */
  capacity: number;
  isUnderMaintenance: boolean;
}

export type MachineInput = Machine;
export type MachineUpdate = Partial<Omit<Machine, 'id'>>;

/** Состояние машины в текущий момент. Вычисляется по расписанию, в хранилище не лежит. */
export type MachineState =
  | { status: 'maintenance' }
  | { status: 'free'; nextBooking?: TimeInterval }
  | { status: 'in_use'; booking: TimeInterval }
  | { status: 'waiting'; booking: TimeInterval };
