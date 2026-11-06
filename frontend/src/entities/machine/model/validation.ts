// Правила совпадают со схемами backend (app/schemas/machines.py)
import { check, integerInRange, matches, required } from '@/shared/lib';

export const MACHINE_NUMBER_MAX = 999;
export const CAPACITY_MIN = 1;
export const CAPACITY_MAX = 30;

export const validateMachineNumber = (value: string) =>
  check(
    value,
    required('Введите номер машины'),
    matches(/^\d{1,3}$/, 'Номер должен состоять из 1–3 цифр'),
    integerInRange(1, MACHINE_NUMBER_MAX, `Номер должен быть от 1 до ${MACHINE_NUMBER_MAX}`),
  );

export const validateCapacity = (value: string) =>
  check(
    value,
    required('Укажите загрузку'),
    integerInRange(CAPACITY_MIN, CAPACITY_MAX, `Загрузка — целое число от ${CAPACITY_MIN} до ${CAPACITY_MAX} кг`),
  );

/** "7" и "007" → "07": номера храним в едином виде. */
export const normalizeMachineNumber = (value: string) =>
  String(Number(value.trim())).padStart(2, '0');
