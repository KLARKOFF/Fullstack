export type MachineType = 'washer' | 'dryer';
export type MachineStatus = 'free' | 'in_use' | 'waiting' | 'maintenance';

export interface Machine {
  id: string;
  type: MachineType;
  capacity: number;
  status: MachineStatus;
  timeLeft?: string;
  endTime?: string;
  currentStage?: string;
  progress?: number;
}

export interface Booking {
  id: string;
  userId: string;
  machineId: string;
  machineType: MachineType;
  time: string; // Например, "16:00 - 17:00"
  date: string;
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  room?: string;
}

export interface Laundry {
  id: string;
  name: string;
}

export const MACHINE_TYPE_LABELS: Record<MachineType, string> = {
  washer: 'Стиральная',
  dryer: 'Сушильная',
};

export const MACHINE_STATUS_LABELS: Record<MachineStatus, string> = {
  free: 'Свободна',
  in_use: 'Работает',
  waiting: 'Ожидает выгрузки',
  maintenance: 'На обслуживании',
};
