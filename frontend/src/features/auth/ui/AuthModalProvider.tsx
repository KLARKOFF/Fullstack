import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthModalContext } from '../model/AuthModalContext';
import type { AuthMode } from '../model/validation';
import { AuthModal } from './AuthModal';

/** Даёт любому компоненту открыть окно входа через useAuthModal().open(). */
export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');

  const open = useCallback((nextMode: AuthMode = 'login') => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <AuthModalContext value={value}>
      {children}
      <AuthModal isOpen={isOpen} mode={mode} onModeChange={setMode} onClose={() => setIsOpen(false)} />
    </AuthModalContext>
  );
}
