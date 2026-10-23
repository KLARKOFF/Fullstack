import type { User } from '../types';
import { ApiError, load, remove, save } from './storage';

const USERS_KEY = 'mock_users';
const SESSION_KEY = 'mock_session';

export const ADMIN_EMAIL = 'admin@laundry.ru';

const SEED: User[] = [
  { id: 'admin', name: 'Администратор', email: ADMIN_EMAIL, role: 'admin' },
];

export type ProfileUpdate = Partial<Pick<User, 'name' | 'room'>>;

const readAll = () => load<User[]>(USERS_KEY, SEED);

export function getSessionUser(): User | null {
  const id = load<string | null>(SESSION_KEY, null);
  if (!id) return null;
  return readAll().find((u) => u.id === id) ?? null;
}

export async function login(name: string, email: string): Promise<User> {
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
}

export function logout(): void {
  remove(SESSION_KEY);
}

export async function updateProfile(id: string, patch: ProfileUpdate): Promise<User> {
  const users = readAll();
  const current = users.find((u) => u.id === id);
  if (!current) {
    throw new ApiError('Пользователь не найден', 404);
  }

  const updated: User = { ...current };
  if (patch.name !== undefined) {
    const name = patch.name.trim();
    if (!name) throw new ApiError('Введите имя', 422);
    if (name.length > 50) throw new ApiError('Имя не должно быть длиннее 50 символов', 422);
    updated.name = name;
  }
  if (patch.room !== undefined) {
    const room = patch.room.trim();
    if (room.length > 10) throw new ApiError('Номер комнаты не должен быть длиннее 10 символов', 422);
    updated.room = room || undefined;
  }

  save(USERS_KEY, users.map((u) => (u.id === id ? updated : u)));
  return updated;
}
