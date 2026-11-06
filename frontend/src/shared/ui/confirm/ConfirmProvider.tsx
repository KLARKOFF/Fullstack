import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { ConfirmContext } from './ConfirmContext';
import type { ConfirmOptions } from './ConfirmContext';

interface ConfirmRequest {
  options: ConfirmOptions;
  resolve: (answer: boolean) => void;
}

/** Своё окно подтверждения вместо системного confirm(): не блокирует страницу и выглядит как приложение. */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ConfirmRequest | null>(null);
  // Текст храним отдельно, чтобы он не пропадал во время анимации закрытия
  const [shownOptions, setShownOptions] = useState<ConfirmOptions | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setShownOptions(options);
        setRequest({ options, resolve });
      }),
    [],
  );

  const answer = (value: boolean) => {
    request?.resolve(value);
    setRequest(null);
  };

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext value={value}>
      {children}
      <Modal isOpen={!!request} title={shownOptions?.title ?? ''} onClose={() => answer(false)}>
        <div className="form">
          <p>{shownOptions?.message}</p>
          <div className="form-actions form-actions-end">
            <Button onClick={() => answer(false)}>{shownOptions?.cancelText ?? 'Отмена'}</Button>
            <Button variant={shownOptions?.danger ? 'danger-solid' : 'primary'} onClick={() => answer(true)} autoFocus>
              {shownOptions?.confirmText ?? 'Подтвердить'}
            </Button>
          </div>
        </div>
      </Modal>
    </ConfirmContext>
  );
}
