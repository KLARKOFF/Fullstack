import type { Machine } from '../types';
import { deleteBookingsForMachine } from './bookings';
import { ApiError, load, save } from './storage';

// v2: статус больше не хранится, только признак обслуживания
const KEY = 'mock_machines_v2';

const SEED: Machine[] = [
  { id: '01', type: 'washer', capacity: 6, isUnderMaintenance: false },
  { id: '02', type: 'washer', capacity: 6, isUnderMaintenance: false },
  { id: '03', type: 'washer', capacity: 6, isUnderMaintenance: false },
  { id: '04', type: 'washer', capacity: 8, isUnderMaintenance: false },
  { id: '05', type: 'dryer', capacity: 8, isUnderMaintenance: false },
  { id: '06', type: 'dryer', capacity: 8, isUnderMaintenance: false },
];

export type MachineInput = Pick<Machine, 'id' | 'type' | 'capacity' | 'isUnderMaintenance'>;
export type MachineUpdate = Partial<Omit<MachineInput, 'id'>>;

const readAll = () => load<Machine[]>(KEY, SEED);
const byId = (a: Machine, b: Machine) => a.id.localeCompare(b.id, undefined, { numeric: true });

function validateCapacity(capacity: number) {
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 30) {
    throw new ApiError('Загрузка должна быть целым числом от 1 до 30 кг', 422);
  }
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

  const created: Machine = { ...data, id: number };
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

  const updated: Machine = { ...current, ...patch };
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