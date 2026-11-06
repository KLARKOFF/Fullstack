import { useLaundry, validateLaundryName } from '@/entities/laundry';
import { useForm } from '@/shared/lib';
import { Button, FormError, InputField, useToast } from '@/shared/ui';

type LaundryFormValues = {
  name: string;
};

export function RenameLaundryForm({ initialName }: { initialName: string }) {
  const { rename } = useLaundry();
  const toast = useToast();

  const form = useForm<LaundryFormValues>({
    initialValues: { name: initialName },
    validate: (values) => ({ name: validateLaundryName(values.name) }),
    onSubmit: async (values) => {
      await rename(values.name);
      toast.show('Название прачечной сохранено');
    },
    submitErrorFallback: 'Не удалось сохранить название',
  });

  const isChanged = form.values.name.trim() !== initialName;

  return (
    <>
      <form onSubmit={form.handleSubmit} className="form-inline" noValidate>
        <InputField label="Название прачечной или общежития" fieldClassName="field-grow" {...form.field('name')} />
        <Button type="submit" variant="primary" disabled={!isChanged} isLoading={form.isSubmitting}>
          Сохранить
        </Button>
      </form>
      <FormError message={form.submitError} />
    </>
  );
}
