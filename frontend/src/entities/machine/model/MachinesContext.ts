import { createContext } from 'react';
import { useRequiredContext } from '@/shared/lib';
import type { LoadStatus } from '@/shared/lib';
import type { Machine, MachineInput, MachineUpdate } from './types';

export interface MachinesContextValue {
  machines: Machine[];
  status: LoadStatus;
  error: string;
  reload: () => void;
  create: (data: MachineInput) => Promise<Machine>;
  update: (id: string, patch: MachineUpdate) => Promise<Machine>;
  remove: (id: string) => Promise<void>;
}

export const MachinesContext = createContext<MachinesContextValue | null>(null);

/** Список машин прачечной и действия с ним. */
export const useMachines = () => useRequiredContext(MachinesContext, 'useMachines');
