import { ApiError, assertValid, load, mockRequest, remove, save } from '@/shared/api';
import type { ProfileUpdate, User } from '../model/types';
import { validateEmail, validateRoom, validateUserName } from '../model/validation';

// Мок-API на localStorage. Настоящий вход с паролем и токенами появится в ЛР №4.
const USERS_KEY = 'mock_users';
const SESSION_KEY = 'mock_session';

export const ADMIN_EMAIL = 'admin@laundry.ru';

const SEED: User[] = [{ id: 'admin', name: 'Администратор', email: ADMIN_EMAIL, role: 'admin' }];

const readAll = () => load<User[]>(USERS_KEY, SEED);

/** Пользователь сохранённой сессии. Синхронно, чтобы при перезагрузке страницы не «выкидывало». */
export function getSessionUser(): User | null {
  const id = load<string | null>(SESSION_KEY, null);
  if (!id) return null;
  return readAll().find((u) => u.id === id) ?? null;
}

/** Вход по email. Если такого пользователя нет — он создаётся (демо-режим без паролей). */
export function login(name: string, email: string): Promise<User> {
  return mockRequest(() => {
    assertValid(validateEmail(email));
    if (name.trim()) assertValid(validateUserName(name));

    const normalized = email.trim().toLowerCase();
    const users = readAll();
    let user = users.find((u) => u.email === normalized);

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        name: name.trim() || normalized.split('@')[0],
        email: normalized,
        role: 'user',
      };
      save(USERS_KEY, [...users, user]);
    }

    save(SESSION_KEY, user.id);
    return user;
  });
}

export function logout(): void {
  remove(SESSION_KEY);
}

export function updateProfile(id: string, patch: ProfileUpdate): Promise<User> {
  return mockRequest(() => {
    const users = readAll();
    const current = users.find((u) => u.id === id);
    if (!current) {
      throw new ApiError('Пользователь не найден', 404);
    }

    const updated: User = { ...current };
    if (patch.name !== undefined) {
      assertValid(validateUserName(patch.name));
      updated.name = patch.name.trim();
    }
    if (patch.room !== undefined) {
      assertValid(validateRoom(patch.room));
      updated.room = patch.room.trim() || undefined;
    }

    save(USERS_KEY, users.map((u) => (u.id === id ? updated : u)));
    return updated;
  });
}
