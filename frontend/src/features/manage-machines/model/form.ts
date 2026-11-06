import {
  MACHINE_STATUS_LABELS,
  normalizeMachineNumber,
  validateCapacity,
  validateMachineNumber,
} from '@/entities/machine';
import type { Machine, MachineType } from '@/entities/machine';
import type { FormErrors } from '@/shared/lib';

export type NewMachineFormValues = {
  number: string;
  type: string;
  capacity: string;
};

export type EditMachineFormValues = {
  type: string;
  capacity: string;
  availability: string;
};

export type Availability = 'available' | 'maintenance';

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  available: 'Доступна',
  maintenance: MACHINE_STATUS_LABELS.maintenance,
};

export function validateNewMachine(
  values: NewMachineFormValues,
  existingIds: string[],
): FormErrors<NewMachineFormValues> {
  const numberError = validateMachineNumber(values.number);
  const number = normalizeMachineNumber(values.number);
  return {
    // Занятый номер проверяем сразу, не дожидаясь ответа «сервера»
    number:
      numberError ?? (existingIds.includes(number) ? `Машина №${number} уже существует` : undefined),
    capacity: validateCapacity(values.capacity),
  };
}

export const validateMachineEdit = (values: EditMachineFormValues): FormErrors<EditMachineFormValues> => ({
  capacity: validateCapacity(values.capacity),
});

export const toEditValues = (machine: Machine): EditMachineFormValues => ({
  type: machine.type,
  capacity: String(machine.capacity),
  availability: machine.isUnderMaintenance ? 'maintenance' : 'available',
});

export const fromEditValues = (values: EditMachineFormValues) => ({
  // <select> предлагает только допустимые типы, поэтому приведение безопасно
  type: values.type as MachineType,
  capacity: Number(values.capacity),
  isUnderMaintenance: values.availability === 'maintenance',
});
