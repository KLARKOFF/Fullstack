import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@/entities/user';

/** Пускает только вошедших пользователей, остальных возвращает на главную. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useSession();
  return user ? children : <Navigate to="/" replace />;
}

/** Пускает только администратора. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin } = useSession();
  return isAdmin ? children : <Navigate to="/" replace />;
}
