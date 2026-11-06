import { CAPACITY_MAX, CAPACITY_MIN, useMachines } from '@/entities/machine';
import type { MachineType } from '@/entities/machine';
import { useForm } from '@/shared/lib';
import { Button, FormError, InputField, SelectField, useToast } from '@/shared/ui';
import { validateNewMachine } from '../model/form';
import type { NewMachineFormValues } from '../model/form';
import { MachineTypeOptions } from './MachineTypeOptions';

export function AddMachineForm() {
  const { machines, create } = useMachines();
  const toast = useToast();
  const existingIds = machines.map((m) => m.id);

  const form = useForm<NewMachineFormValues>({
    initialValues: { number: '', type: 'washer', capacity: '6' },
    validate: (values) => validateNewMachine(values, existingIds),
    onSubmit: async (values, { reset }) => {
      const created = await create({
        id: values.number,
        type: values.type as MachineType,
        capacity: Number(values.capacity),
        isUnderMaintenance: false,
      });
      toast.show(`Машина №${created.id} добавлена`);
      reset({ ...values, number: '' }); // тип и загрузку оставляем для следующей машины
    },
    submitErrorFallback: 'Не удалось добавить машину',
  });

  return (
    <>
      <form onSubmit={form.handleSubmit} className="form-inline" noValidate>
        <InputField
          label="Номер"
          className="input-narrow"
          placeholder="07"
          inputMode="numeric"
          {...form.field('number')}
        />
        <SelectField label="Тип" {...form.field('type')}>
          <MachineTypeOptions />
        </SelectField>
        <InputField
          label="Загрузка, кг"
          className="input-narrow"
          type="number"
          min={CAPACITY_MIN}
          max={CAPACITY_MAX}
          {...form.field('capacity')}
        />
        <Button type="submit" variant="primary" isLoading={form.isSubmitting} loadingText="Добавляем…">
          Добавить
        </Button>
      </form>
      <FormError message={form.submitError} />
    </>
  );
}
