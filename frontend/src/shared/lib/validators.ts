// Простые правила проверки строковых значений форм.
// Каждое правило возвращает текст ошибки или undefined, если значение подходит.

export type Validator = (value: string) => string | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const required =
  (message: string): Validator =>
  (value) =>
    value.trim() ? undefined : message;

export const minLength =
  (min: number, message: string): Validator =>
  (value) =>
    value.trim().length >= min ? undefined : message;

export const maxLength =
  (max: number, message: string): Validator =>
  (value) =>
    value.trim().length <= max ? undefined : message;

export const matches =
  (pattern: RegExp, message: string): Validator =>
  (value) =>
    pattern.test(value.trim()) ? undefined : message;

export const isEmail = (message: string): Validator => matches(EMAIL_RE, message);

export const integerInRange =
  (min: number, max: number, message: string): Validator =>
  (value) => {
    const n = Number(value);
    return value.trim() !== '' && Number.isInteger(n) && n >= min && n <= max
      ? undefined
      : message;
  };

/** Применяет правила по порядку и возвращает первую найденную ошибку. */
export function check(value: string, ...validators: Validator[]): string | undefined {
  for (const validate of validators) {
    const error = validate(value);
    if (error) return error;
  }
  return undefined;
}
