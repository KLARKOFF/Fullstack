import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

/** Заглушка для пустого списка: что произошло и что можно сделать. */
export function EmptyState({ icon = '🫧', title, description, action }: EmptyStateProps) {
  return (
    <div className="state-block">
      <span className="state-icon" aria-hidden="true">{icon}</span>
      <p className="state-title">{title}</p>
      {description && <p className="muted">{description}</p>}
      {action}
    </div>
  );
}
