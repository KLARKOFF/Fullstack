import { createContext } from 'react';
import { useRequiredContext } from '@/shared/lib';
import type { ProfileUpdate, User } from './types';

export interface SessionContextValue {
  /** Вошедший пользователь или null. */
  user: User | null;
  isAdmin: boolean;
  login: (name: string, email: string) => Promise<User>;
  logout: () => void;
  updateProfile: (patch: ProfileUpdate) => Promise<User>;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

/** Текущая сессия: кто вошёл и действия со своим аккаунтом. */
export const useSession = () => useRequiredContext(SessionContext, 'useSession');
