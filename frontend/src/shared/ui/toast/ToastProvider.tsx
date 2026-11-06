import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/shared/lib';
import { ToastContext } from './ToastContext';
import type { ToastVariant } from './ToastContext';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  isLeaving: boolean;
}

const TOAST_LIFETIME_MS = 4000;

const ICONS: Record<ToastVariant, string> = {
  success: '✓',
  error: '!',
  info: 'i',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  // Сначала помечаем уведомление «уходящим» (играет анимация), удаляем по её окончании
  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, isLeaving: true } : t)));
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message, variant, isLeaving: false }]);
      const timer = setTimeout(() => {
        timers.current.delete(timer);
        dismiss(id);
      }, TOAST_LIFETIME_MS);
      timers.current.add(timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const active = timers.current;
    return () => active.forEach(clearTimeout);
  }, []);

  const handleAnimationEnd = (toast: Toast) => {
    if (toast.isLeaving) setToasts((prev) => prev.filter((t) => t.id !== toast.id));
  };

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cx('toast', `toast-${toast.variant}`, toast.isLeaving && 'is-leaving')}
            role={toast.variant === 'error' ? 'alert' : 'status'}
            onAnimationEnd={() => handleAnimationEnd(toast)}
          >
            <span className="toast-icon" aria-hidden="true">
              {ICONS[toast.variant]}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button type="button" className="close-btn" aria-label="Закрыть уведомление" onClick={() => dismiss(toast.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}
