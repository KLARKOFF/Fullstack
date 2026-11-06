import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { cx } from '@/shared/lib';

interface FieldOwnProps {
  label: string;
  /** Текст ошибки под полем. Если есть — поле подсвечивается красным. */
  error?: string;
  /** Скрыть подпись визуально (например, в ячейке таблицы), но оставить для экранных дикторов. */
  hideLabel?: boolean;
  fieldClassName?: string;
}

interface FieldShellProps extends FieldOwnProps {
  id: string;
  children: ReactNode;
}

/** Общая обёртка поля: подпись, сам элемент и сообщение об ошибке. */
function FieldShell({ id, label, error, hideLabel, fieldClassName, children }: FieldShellProps) {
  return (
    <div className={cx('field', fieldClassName)}>
      <label htmlFor={id} className={cx('field-label', hideLabel && 'visually-hidden')}>
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

/** Атрибуты, которые связывают элемент с подписью и ошибкой. */
const controlProps = (id: string, error: string | undefined, className: string | undefined) => ({
  id,
  className: cx('input', error && 'input-invalid', className),
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? `${id}-error` : undefined,
});

type InputFieldProps = FieldOwnProps & InputHTMLAttributes<HTMLInputElement>;

export function InputField({ label, error, hideLabel, fieldClassName, className, ...props }: InputFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hideLabel={hideLabel} fieldClassName={fieldClassName}>
      <input {...props} {...controlProps(id, error, className)} />
    </FieldShell>
  );
}

type SelectFieldProps = FieldOwnProps & SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({ label, error, hideLabel, fieldClassName, className, children, ...props }: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hideLabel={hideLabel} fieldClassName={fieldClassName}>
      <select {...props} {...controlProps(id, error, className)}>
        {children}
      </select>
    </FieldShell>
  );
}
