import { createContext } from 'react';
import { useRequiredContext } from '@/shared/lib';
import type { AuthMode } from './validation';

export interface AuthModalContextValue {
  /** Открыть окно входа (или сразу регистрации). */
  open: (mode?: AuthMode) => void;
}

export const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export const useAuthModal = () => useRequiredContext(AuthModalContext, 'useAuthModal');
