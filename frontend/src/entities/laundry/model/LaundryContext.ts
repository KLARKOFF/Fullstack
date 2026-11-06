import { createContext } from 'react';
import { useRequiredContext } from '@/shared/lib';
import type { LoadStatus } from '@/shared/lib';
import type { Laundry } from './types';

export interface LaundryContextValue {
  laundry: Laundry | null;
  status: LoadStatus;
  error: string;
  reload: () => void;
  rename: (name: string) => Promise<Laundry>;
}

export const LaundryContext = createContext<LaundryContextValue | null>(null);

/** Текущая прачечная (общежитие). */
export const useLaundry = () => useRequiredContext(LaundryContext, 'useLaundry');
