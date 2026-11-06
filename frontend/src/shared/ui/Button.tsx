import type { ButtonHTMLAttributes } from 'react';
import { cx } from '@/shared/lib';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'danger-solid' | 'link';
  size?: 'normal' | 'small';
  fullWidth?: boolean;
  /** Пока true, кнопка заблокирована и показывает loadingText. */
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  variant = 'secondary',
  size = 'normal',
  fullWidth = false,
  isLoading = false,
  loadingText,
  type = 'button',
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cx(
        'btn',
        `btn-${variant}`,
        size === 'small' && 'btn-small',
        fullWidth && 'btn-block',
        className,
      )}
    >
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}
