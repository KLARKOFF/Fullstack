import type { MachineStatus, MachineType } from './types';

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

export const CYCLE_LABELS: Record<MachineType, string> = {
  washer: 'Стирка',
  dryer: 'Сушка',
};
