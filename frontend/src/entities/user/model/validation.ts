// Правила совпадают со схемами backend (app/schemas/users.py)
import { check, isEmail, maxLength, required } from '@/shared/lib';

export const USER_NAME_MAX = 50;
export const ROOM_MAX = 10;

export const validateUserName = (value: string) =>
  check(
    value,
    required('Введите имя'),
    maxLength(USER_NAME_MAX, `Имя не должно быть длиннее ${USER_NAME_MAX} символов`),
  );

export const validateRoom = (value: string) =>
  check(value, maxLength(ROOM_MAX, `Номер комнаты не должен быть длиннее ${ROOM_MAX} символов`));

export const validateEmail = (value: string) =>
  check(value, required('Введите email'), isEmail('Введите email в формате name@example.com'));
