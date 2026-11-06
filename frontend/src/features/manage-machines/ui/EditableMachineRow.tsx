import { useState } from 'react';
import { CAPACITY_MAX, CAPACITY_MIN, MACHINE_TYPE_LABELS, useMachines } from '@/entities/machine';
import type { Machine } from '@/entities/machine';
import { errorText, useForm } from '@/shared/lib';
import { Button, InputField, SelectField, useConfirm, useToast } from '@/shared/ui';
import { AVAILABILITY_LABELS, fromEditValues, toEditValues, validateMachineEdit } from '../model/form';
import type { EditMachineFormValues } from '../model/form';
import { useDeleteMachine } from '../model/useDeleteMachine';
import { MachineTypeOptions } from './MachineTypeOptions';

/** Строка таблицы машин: просмотр, редактирование и удаление. */
export function EditableMachineRow({ machine }: { machine: Machine }) {
  const { update } = useMachines();
  const deleteMachine = useDeleteMachine();
  const confirm = useConfirm();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<EditMachineFormValues>({
    initialValues: toEditValues(machine),
    validate: validateMachineEdit,
    onSubmit: async (values) => {
      await update(machine.id, fromEditValues(values));
      toast.show(`Машина №${machine.id} сохранена`);
      setIsEditing(false);
    },
    submitErrorFallback: 'Не удалось сохранить машину',
  });

  const startEditing = () => {
    form.reset(toEditValues(machine)); // берём актуальные данные машины
    setIsEditing(true);
  };

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: `Удалить машину №${machine.id}?`,
      message: 'Все её бронирования тоже будут удалены. Это действие нельзя отменить.',
      confirmText: 'Удалить',
      danger: true,
    });
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      await deleteMachine(machine.id);
      toast.show(`Машина №${machine.id} удалена`, 'info');
    } catch (err) {
      toast.show(errorText(err, 'Не удалось удалить машину'), 'error');
      setIsDeleting(false);
    }
  };

  const availability = machine.isUnderMaintenance ? 'maintenance' : 'available';

  if (!isEditing) {
    return (
      <tr>
        <td className="cell-number">{machine.id}</td>
        <td>{MACHINE_TYPE_LABELS[machine.type]}</td>
        <td>{machine.capacity} кг</td>
        <td>
          <span className={`status-pill status-${machine.isUnderMaintenance ? 'maintenance' : 'free'}`}>
            {AVAILABILITY_LABELS[availability]}
          </span>
        </td>
        <td className="cell-actions">
          <Button size="small" onClick={startEditing} disabled={isDeleting}>
            Изменить
          </Button>
          <Button variant="danger" size="small" onClick={handleDelete} isLoading={isDeleting} loadingText="Удаляем…">
            Удалить
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr className="row-editing">
        <td className="cell-number">{machine.id}</td>
        <td>
          <SelectField label="Тип" hideLabel {...form.field('type')}>
            <MachineTypeOptions />
          </SelectField>
        </td>
        <td>
          <InputField
            label="Загрузка, кг"
            hideLabel
            className="input-narrow"
            type="number"
            min={CAPACITY_MIN}
            max={CAPACITY_MAX}
            {...form.field('capacity')}
          />
        </td>
        <td>
          <SelectField label="Статус" hideLabel {...form.field('availability')}>
            <option value="available">{AVAILABILITY_LABELS.available}</option>
            <option value="maintenance">{AVAILABILITY_LABELS.maintenance}</option>
          </SelectField>
        </td>
        <td className="cell-actions">
          <Button
            variant="primary"
            size="small"
            onClick={() => form.handleSubmit()}
            isLoading={form.isSubmitting}
            loadingText="Сохраняем…"
          >
            Сохранить
          </Button>
          <Button size="small" onClick={() => setIsEditing(false)} disabled={form.isSubmitting}>
            Отмена
          </Button>
        </td>
      </tr>
      {form.submitError && (
        <tr>
          <td colSpan={5} className="form-error" role="alert">
            {form.submitError}
          </td>
        </tr>
      )}
    </>
  );
}
