// Правила совпадают со схемами backend (app/schemas/laundries.py)
import { check, maxLength, required } from '@/shared/lib';

export const LAUNDRY_NAME_MAX = 100;

export const validateLaundryName = (value: string) =>
  check(
    value,
    required('Введите название прачечной'),
    maxLength(LAUNDRY_NAME_MAX, `Название не должно быть длиннее ${LAUNDRY_NAME_MAX} символов`),
  );
