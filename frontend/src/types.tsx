export type MachineStatus = 'free' | 'in_use' | 'waiting';

export interface Machine {
  id: string;
  type: 'washer' | 'dryer';
  capacity: number;
  status: MachineStatus;
  timeLeft?: string;
  endTime?: string;
  currentStage?: string;
  progress?: number;
}

export interface Booking {
  id: string;
  machineId: string;
  machineType: 'washer' | 'dryer';
  time: string; // Например, "16:00 - 17:00"
  date: string;
}

export interface User {
  name: string;
  email: string;
}