import { useEffect, useState } from 'react';

/** Текущее время, которое обновляется раз в intervalMs (по умолчанию 30 секунд). */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
