import { MACHINE_TYPE_LABELS } from '@/entities/machine';
import type { MachineType } from '@/entities/machine';

const TYPES = Object.keys(MACHINE_TYPE_LABELS) as MachineType[];

/** Варианты типа машины для <select>. Общие для формы добавления и редактирования. */
export function MachineTypeOptions() {
  return TYPES.map((type) => (
    <option key={type} value={type}>
      {MACHINE_TYPE_LABELS[type]}
    </option>
  ));
}
