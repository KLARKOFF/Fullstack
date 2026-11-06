import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { errorText } from './errorText';

/** Ошибки по полям формы: ключ — имя поля, значение — текст ошибки. */
export type FormErrors<V> = Partial<Record<keyof V, string | undefined>>;

/** Значения формы храним строками — так их отдают <input> и <select>. */
type FormValues = Record<string, string>;

interface SubmitHelpers<V> {
  /** Сбросить форму (например, очистить поля после успешного добавления). */
  reset: (nextValues?: V) => void;
}

interface UseFormOptions<V extends FormValues> {
  initialValues: V;
  validate: (values: V) => FormErrors<V>;
  onSubmit: (values: V, helpers: SubmitHelpers<V>) => Promise<void> | void;
  /** Текст, если при отправке случилась ошибка без сообщения. */
  submitErrorFallback?: string;
}

/**
 * Небольшой хук для форм: хранит значения, проверяет их и отправляет.
 * Ошибку поля показываем после того, как пользователь ушёл с поля (blur)
 * или попытался отправить форму, — чтобы не ругаться на каждую букву.
 */
export function useForm<V extends FormValues>({
  initialValues,
  validate,
  onSubmit,
  submitErrorFallback = 'Не удалось сохранить',
}: UseFormOptions<V>) {
  const [values, setValues] = useState<V>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof V, boolean>>>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const allErrors = validate(values);
  const isValid = Object.values(allErrors).every((error) => !error);

  // Видимые ошибки: только для полей, которые пользователь уже трогал
  const errors: FormErrors<V> = {};
  for (const key of Object.keys(allErrors) as (keyof V)[]) {
    if (wasSubmitted || touched[key]) errors[key] = allErrors[key];
  }

  const setValue = (key: keyof V, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSubmitError('');
  };

  /** Пропсы для поля: name, value, onChange, onBlur и текст ошибки. */
  const field = (key: keyof V) => ({
    name: String(key),
    value: values[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setValue(key, e.target.value),
    onBlur: () => setTouched((prev) => ({ ...prev, [key]: true })),
    error: errors[key],
  });

  const reset = (nextValues: V = initialValues) => {
    setValues(nextValues);
    setTouched({});
    setWasSubmitted(false);
    setSubmitError('');
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    setWasSubmitted(true);
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await onSubmit(values, { reset });
    } catch (err) {
      setSubmitError(errorText(err, submitErrorFallback));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { values, errors, isValid, isSubmitting, submitError, field, setValue, reset, handleSubmit };
}
