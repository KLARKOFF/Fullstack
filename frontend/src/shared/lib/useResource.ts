import { useCallback, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { errorText } from './errorText';

export type LoadStatus = 'loading' | 'error' | 'success';

export interface Resource<T> {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  status: LoadStatus;
  error: string;
  /** Загрузить заново (например, по кнопке «Повторить»). */
  reload: () => void;
}

/**
 * Загружает данные при монтировании и хранит состояние загрузки: loading → success | error.
 * load должна быть «стабильной» функцией (объявленной вне компонента), иначе загрузка зациклится.
 */
export function useResource<T>(
  load: () => Promise<T>,
  initialData: T,
  errorFallback = 'Не удалось загрузить данные',
): Resource<T> {
  const [data, setData] = useState<T>(initialData);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState('');
  // Номер попытки: reload увеличивает его, и эффект запускает загрузку заново
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // Если компонент размонтировался или началась новая попытка — старый ответ игнорируем
    let isStale = false;
    load().then(
      (result) => {
        if (isStale) return;
        setData(result);
        setError('');
        setStatus('success');
      },
      (err: unknown) => {
        if (isStale) return;
        setError(errorText(err, errorFallback));
        setStatus('error');
      },
    );
    return () => {
      isStale = true;
    };
  }, [load, errorFallback, attempt]);

  const reload = useCallback(() => {
    setStatus('loading');
    setAttempt((n) => n + 1);
  }, []);

  return { data, setData, status, error, reload };
}

/** Общее состояние нескольких загрузок: ошибка важнее загрузки, загрузка важнее успеха. */
export function combineStatus(...statuses: LoadStatus[]): LoadStatus {
  if (statuses.includes('error')) return 'error';
  if (statuses.includes('loading')) return 'loading';
  return 'success';
}
