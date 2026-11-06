import { useBookings } from '@/entities/booking';
import { useMachines } from '@/entities/machine';

/** Удаление машины вместе с её бронями: действие затрагивает две сущности. */
export function useDeleteMachine() {
  const { remove } = useMachines();
  const { forgetMachine } = useBookings();

  return async (machineId: string) => {
    await remove(machineId);
    forgetMachine(machineId);
  };
}
