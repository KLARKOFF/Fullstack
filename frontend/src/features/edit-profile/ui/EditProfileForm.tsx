import { useSession, validateRoom, validateUserName } from '@/entities/user';
import type { User } from '@/entities/user';
import { useForm } from '@/shared/lib';
import { Button, FormError, InputField, useToast } from '@/shared/ui';

interface EditProfileFormProps {
  user: User;
  onClose: () => void;
}

type ProfileFormValues = {
  name: string;
  room: string;
};

export function EditProfileForm({ user, onClose }: EditProfileFormProps) {
  const { updateProfile } = useSession();
  const toast = useToast();

  const form = useForm<ProfileFormValues>({
    initialValues: { name: user.name, room: user.room ?? '' },
    validate: (values) => ({
      name: validateUserName(values.name),
      room: validateRoom(values.room),
    }),
    onSubmit: async (values) => {
      await updateProfile(values);
      toast.show('Данные сохранены');
      onClose();
    },
    submitErrorFallback: 'Не удалось сохранить изменения',
  });

  return (
    <form onSubmit={form.handleSubmit} className="form form-appear" noValidate>
      <InputField label="Имя" autoFocus {...form.field('name')} />
      <InputField label="Комната" placeholder="Например, 412" {...form.field('room')} />
      <InputField label="Email" value={user.email} disabled />

      <FormError message={form.submitError} />

      <div className="form-actions">
        <Button type="submit" variant="primary" isLoading={form.isSubmitting} loadingText="Сохранение…">
          Сохранить
        </Button>
        <Button onClick={onClose} disabled={form.isSubmitting}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
