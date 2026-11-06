import { ApiError, assertValid, load, mockRequest, save } from '@/shared/api';
import { compareMachines } from '../model/state';
import type { Machine, MachineInput, MachineUpdate } from '../model/types';
import { normalizeMachineNumber, validateCapacity, validateMachineNumber } from '../model/validation';

// Мок-API на localStorage. После интеграции с backend здесь будут запросы к /api/machines.
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

const readAll = () => load<Machine[]>(KEY, SEED);

export function getMachines(): Promise<Machine[]> {
  return mockRequest(() => readAll().sort(compareMachines));
}

export function createMachine(data: MachineInput): Promise<Machine> {
  return mockRequest(() => {
    // Мок проверяет данные так же, как будет проверять backend
    assertValid(validateMachineNumber(data.id));
    assertValid(validateCapacity(String(data.capacity)));

    const id = normalizeMachineNumber(data.id);
    const machines = readAll();
    if (machines.some((m) => m.id === id)) {
      throw new ApiError(`Машина №${id} уже существует`, 409);
    }

    const created: Machine = { ...data, id };
    save(KEY, [...machines, created].sort(compareMachines));
    return created;
  });
}

export function updateMachine(id: string, patch: MachineUpdate): Promise<Machine> {
  return mockRequest(() => {
    if (patch.capacity !== undefined) assertValid(validateCapacity(String(patch.capacity)));

    const machines = readAll();
    const current = machines.find((m) => m.id === id);
    if (!current) {
      throw new ApiError(`Машина №${id} не найдена`, 404);
    }

    const updated: Machine = { ...current, ...patch };
    save(KEY, machines.map((m) => (m.id === id ? updated : m)));
    return updated;
  });
}

export function deleteMachine(id: string): Promise<void> {
  return mockRequest(() => {
    const machines = readAll();
    if (!machines.some((m) => m.id === id)) {
      throw new ApiError(`Машина №${id} не найдена`, 404);
    }
    save(KEY, machines.filter((m) => m.id !== id));
  });
}
