import { validateEmail, validateUserName } from '@/entities/user';
import { check, minLength, required } from '@/shared/lib';
import type { FormErrors } from '@/shared/lib';

// Пароль пока проверяется только на клиенте: авторизации в backend ещё нет
export const PASSWORD_MIN_LENGTH = 6;

export type AuthMode = 'login' | 'register';

export type AuthFormValues = {
  name: string;
  email: string;
  password: string;
};

export function validateAuthForm(values: AuthFormValues, mode: AuthMode): FormErrors<AuthFormValues> {
  return {
    // При входе имя не спрашиваем, при регистрации оно обязательно
    name: mode === 'register' ? validateUserName(values.name) : undefined,
    email: validateEmail(values.email),
    password: check(
      values.password,
      required('Введите пароль'),
      minLength(PASSWORD_MIN_LENGTH, `Пароль должен быть не короче ${PASSWORD_MIN_LENGTH} символов`),
    ),
  };
}
