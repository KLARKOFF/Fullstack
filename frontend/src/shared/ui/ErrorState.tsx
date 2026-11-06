import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/** Блок «не удалось загрузить» с кнопкой повтора. */
export function ErrorState({ title = 'Не удалось загрузить данные', message, onRetry }: ErrorStateProps) {
  return (
    <div className="state-block state-error" role="alert">
      <span className="state-icon" aria-hidden="true">⚠️</span>
      <p className="state-title">{title}</p>
      <p className="muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Повторить
        </Button>
      )}
    </div>
  );
}
