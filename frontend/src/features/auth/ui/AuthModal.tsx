import { useSession } from '@/entities/user';
import { useForm } from '@/shared/lib';
import { Button, FormError, InputField, Modal, useToast } from '@/shared/ui';
import { validateAuthForm } from '../model/validation';
import type { AuthFormValues, AuthMode } from '../model/validation';

interface AuthModalProps {
  isOpen: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
}

export function AuthModal({ isOpen, mode, onModeChange, onClose }: AuthModalProps) {
  return (
    <Modal isOpen={isOpen} title={mode === 'register' ? 'Регистрация' : 'Вход в аккаунт'} onClose={onClose}>
      <AuthForm mode={mode} onModeChange={onModeChange} onDone={onClose} />
    </Modal>
  );
}

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onDone: () => void;
}

function AuthForm({ mode, onModeChange, onDone }: AuthFormProps) {
  const { login } = useSession();
  const toast = useToast();
  const isRegister = mode === 'register';

  const form = useForm<AuthFormValues>({
    initialValues: { name: '', email: '', password: '' },
    validate: (values) => validateAuthForm(values, mode),
    onSubmit: async ({ name, email }) => {
      const user = await login(name, email);
      toast.show(`Добро пожаловать, ${user.name}!`);
      onDone();
    },
    submitErrorFallback: 'Не удалось войти',
  });

  const toggleMode = () => {
    onModeChange(isRegister ? 'login' : 'register');
    form.reset(form.values); // введённое сохраняем, а старые ошибки убираем
  };

  return (
    <>
      <form onSubmit={form.handleSubmit} className="form" noValidate>
        {isRegister && (
          <InputField
            label="Имя"
            placeholder="Иван"
            autoComplete="name"
            fieldClassName="field-appear"
            {...form.field('name')}
          />
        )}
        <InputField
          label="Email"
          type="email"
          placeholder="example@mail.com"
          autoComplete="email"
          {...form.field('email')}
        />
        <InputField
          label="Пароль"
          type="password"
          placeholder="••••••••"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          {...form.field('password')}
        />

        <FormError message={form.submitError} />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={form.isSubmitting}
          loadingText={isRegister ? 'Регистрируем…' : 'Входим…'}
        >
          {isRegister ? 'Зарегистрироваться' : 'Войти'}
        </Button>
      </form>

      <p className="auth-switch">
        {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
        <Button variant="link" onClick={toggleMode}>
          {isRegister ? 'Войти' : 'Создать'}
        </Button>
      </p>
    </>
  );
}
