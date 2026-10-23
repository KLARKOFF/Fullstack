import type { Machine } from '../types';
import { deleteBookingsForMachine } from './bookings';
import { ApiError, load, save } from './storage';

const KEY = 'mock_machines';

const SEED: Machine[] = [
  { id: '01', type: 'washer', capacity: 6, status: 'free' },
  { id: '02', type: 'washer', capacity: 6, status: 'in_use', timeLeft: '24 мин', endTime: '14:56', currentStage: 'Полоскание', progress: 60 },
  { id: '03', type: 'washer', capacity: 6, status: 'waiting', endTime: '14:24' },
  { id: '04', type: 'washer', capacity: 8, status: 'free' },
  { id: '05', type: 'dryer', capacity: 8, status: 'in_use', timeLeft: '12 мин', endTime: '14:44', currentStage: 'Сушка', progress: 80 },
  { id: '06', type: 'dryer', capacity: 8, status: 'free' },
];

export type MachineInput = Pick<Machine, 'id' | 'type' | 'capacity' | 'status'>;
export type MachineUpdate = Partial<Pick<Machine, 'type' | 'capacity' | 'status'>>;

const readAll = () => load<Machine[]>(KEY, SEED);
const byId = (a: Machine, b: Machine) => a.id.localeCompare(b.id, undefined, { numeric: true });

function validateCapacity(capacity: number) {
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 30) {
    throw new ApiError('Загрузка должна быть целым числом от 1 до 30 кг', 422);
  }
}

function clearCycleData(machine: Machine): Machine {
  const result = { ...machine };
  if (result.status !== 'in_use') {
    delete result.timeLeft;
    delete result.currentStage;
    delete result.progress;
  }
  if (result.status === 'free' || result.status === 'maintenance') {
    delete result.endTime;
  }
  return result;
}

export async function getMachines(): Promise<Machine[]> {
  return readAll().sort(byId);
}

export async function createMachine(data: MachineInput): Promise<Machine> {
  const id = data.id.trim();
  if (!/^\d{1,3}$/.test(id)) {
    throw new ApiError('Номер машины должен состоять из 1–3 цифр', 422);
  }
  validateCapacity(data.capacity);

  const number = id.padStart(2, '0');
  const machines = readAll();
  if (machines.some((m) => m.id === number)) {
    throw new ApiError(`Машина №${number} уже существует`, 409);
  }

  const created = clearCycleData({ ...data, id: number });
  save(KEY, [...machines, created].sort(byId));
  return created;
}

export async function updateMachine(id: string, patch: MachineUpdate): Promise<Machine> {
  if (patch.capacity !== undefined) validateCapacity(patch.capacity);

  const machines = readAll();
  const current = machines.find((m) => m.id === id);
  if (!current) {
    throw new ApiError(`Машина №${id} не найдена`, 404);
  }

  const updated = clearCycleData({ ...current, ...patch });
  save(KEY, machines.map((m) => (m.id === id ? updated : m)));
  return updated;
}

export async function deleteMachine(id: string): Promise<void> {
  const machines = readAll();
  if (!machines.some((m) => m.id === id)) {
    throw new ApiError(`Машина №${id} не найдена`, 404);
  }
  save(KEY, machines.filter((m) => m.id !== id));
  deleteBookingsForMachine(id);
}
