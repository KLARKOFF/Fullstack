import { createContext } from 'react';
import { useRequiredContext } from '@/shared/lib';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastContextValue {
  /** Показать короткое уведомление в углу экрана. Само исчезнет через несколько секунд. */
  show: (message: string, variant?: ToastVariant) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => useRequiredContext(ToastContext, 'useToast');
