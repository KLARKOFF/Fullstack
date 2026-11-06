import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ApiError } from '@/shared/api';
import { getSessionUser, login, logout, updateProfile } from '../api/userApi';
import { SessionContext } from './SessionContext';
import type { SessionContextValue } from './SessionContext';
import type { User } from './types';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getSessionUser);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      isAdmin: user?.role === 'admin',
      login: async (name, email) => {
        const loggedIn = await login(name, email);
        setUser(loggedIn);
        return loggedIn;
      },
      logout: () => {
        logout();
        setUser(null);
      },
      updateProfile: async (patch) => {
        if (!user) throw new ApiError('Сначала войдите в аккаунт', 401);
        const updated = await updateProfile(user.id, patch);
        setUser(updated);
        return updated;
      },
    }),
    [user],
  );

  return <SessionContext value={value}>{children}</SessionContext>;
}
