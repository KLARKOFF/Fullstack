import { createContext } from 'react';
import type { ReactNode } from 'react';
import { useRequiredContext } from '@/shared/lib';

export interface ConfirmOptions {
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** Опасное действие (удаление, отмена) — кнопка подтверждения красная. */
  danger?: boolean;
}

export interface ConfirmContextValue {
  /** Показывает окно подтверждения. Возвращает true, если пользователь согласился. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export const useConfirm = () => useRequiredContext(ConfirmContext, 'useConfirm').confirm;
