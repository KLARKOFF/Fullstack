import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useResource } from '@/shared/lib';
import { createMachine, deleteMachine, getMachines, updateMachine } from '../api/machineApi';
import { MachinesContext } from './MachinesContext';
import type { MachinesContextValue } from './MachinesContext';
import { compareMachines } from './state';
import type { Machine } from './types';

const NO_MACHINES: Machine[] = [];

export function MachinesProvider({ children }: { children: ReactNode }) {
  const { data: machines, setData, status, error, reload } = useResource(
    getMachines,
    NO_MACHINES,
    'Не удалось загрузить список машин',
  );

  const value = useMemo<MachinesContextValue>(
    () => ({
      machines,
      status,
      error,
      reload,
      create: async (data) => {
        const created = await createMachine(data);
        setData((prev) => [...prev, created].sort(compareMachines));
        return created;
      },
      update: async (id, patch) => {
        const updated = await updateMachine(id, patch);
        setData((prev) => prev.map((m) => (m.id === id ? updated : m)));
        return updated;
      },
      remove: async (id) => {
        await deleteMachine(id);
        setData((prev) => prev.filter((m) => m.id !== id));
      },
    }),
    [machines, status, error, reload, setData],
  );

  return <MachinesContext value={value}>{children}</MachinesContext>;
}
