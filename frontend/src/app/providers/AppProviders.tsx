import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BookingsProvider } from '@/entities/booking';
import { LaundryProvider } from '@/entities/laundry';
import { MachinesProvider } from '@/entities/machine';
import { SessionProvider } from '@/entities/user';
import { AuthModalProvider } from '@/features/auth';
import { ConfirmProvider, ToastProvider } from '@/shared/ui';

/**
 * Все глобальные провайдеры в одном месте. Порядок важен:
 * внутренние провайдеры могут пользоваться внешними (например, окно входа — уведомлениями и сессией).
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ConfirmProvider>
          <SessionProvider>
            <LaundryProvider>
              <MachinesProvider>
                <BookingsProvider>
                  <AuthModalProvider>{children}</AuthModalProvider>
                </BookingsProvider>
              </MachinesProvider>
            </LaundryProvider>
          </SessionProvider>
        </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
