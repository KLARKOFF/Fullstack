/** Общая ошибка формы (например, ответ «сервера»). Ничего не рисует, если текста нет. */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="form-error" role="alert">
      {message}
    </p>
  );
}
