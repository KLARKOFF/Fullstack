import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useResource } from '@/shared/lib';
import { getLaundry, updateLaundry } from '../api/laundryApi';
import { LaundryContext } from './LaundryContext';
import type { LaundryContextValue } from './LaundryContext';
import type { Laundry } from './types';

export function LaundryProvider({ children }: { children: ReactNode }) {
  const { data: laundry, setData, status, error, reload } = useResource<Laundry | null>(
    getLaundry,
    null,
    'Не удалось загрузить данные прачечной',
  );

  const value = useMemo<LaundryContextValue>(
    () => ({
      laundry,
      status,
      error,
      reload,
      rename: async (name) => {
        const updated = await updateLaundry(name);
        setData(updated);
        return updated;
      },
    }),
    [laundry, status, error, reload, setData],
  );

  return <LaundryContext value={value}>{children}</LaundryContext>;
}
