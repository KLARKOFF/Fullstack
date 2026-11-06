import type { CSSProperties, KeyboardEvent } from 'react';
import { formatDay, formatTime } from '@/shared/lib';
import { Skeleton } from '@/shared/ui';
import { CYCLE_LABELS, MACHINE_TYPE_LABELS } from '../model/labels';
import { getProgress, minutesLeft } from '../model/state';
import type { Machine, MachineState, MachineStatus } from '../model/types';

interface MachineCardProps {
  machine: Machine;
  state: MachineState;
  now: Date;
  onSelect: (machineId: string) => void;
  style?: CSSProperties;
}

const STATUS_CLASS: Record<MachineStatus, string> = {
  free: 'card-free',
  in_use: 'card-in-use',
  waiting: 'card-waiting',
  maintenance: 'card-maintenance',
};

export function MachineCard({ machine, state, now, onSelect, style }: MachineCardProps) {
  const isDisabled = state.status === 'maintenance';

  // Карточка ведёт себя как кнопка: доступна с клавиатуры (Tab, Enter, пробел)
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSelect(machine.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled || undefined}
      aria-label={`Машина №${machine.id}, ${MACHINE_TYPE_LABELS[machine.type].toLowerCase()}`}
      onClick={() => !isDisabled && onSelect(machine.id)}
      onKeyDown={handleKeyDown}
      className={`machine-card ${STATUS_CLASS[state.status]}`}
      style={style}
    >
      <div className="card-header">
        <div>
          <div className="machine-heading">
            <span className="machine-number">{machine.id}</span>
            <span className="machine-type">{MACHINE_TYPE_LABELS[machine.type]}</span>
          </div>
          <span className="machine-capacity">до {machine.capacity} кг</span>
        </div>
      </div>

      <div>
        {state.status === 'free' && (
          <div>
            <div className="status-badge">
              <span className="status-dot" />
              Свободен
            </div>
            <h3 className="card-title">Можно запускать</h3>
            <p className="card-desc">
              {state.nextBooking
                ? `Ближайшая бронь: ${formatDay(state.nextBooking.startAt, now)}, ${formatTime(state.nextBooking.startAt)}`
                : 'Ближайших броней нет'}
            </p>
          </div>
        )}

        {state.status === 'in_use' && (
          <div>
            <div className="status-badge">⏳ Используется</div>
            <h3 className="card-title">Ещё {minutesLeft(state.booking, now)} мин</h3>
            <p className="card-desc">Завершится в {formatTime(state.booking.endAt)}</p>
          </div>
        )}

        {state.status === 'waiting' && (
          <div>
            <div className="status-badge">🔔 Ожидает выгрузки</div>
            <h3 className="card-title">Пора забрать вещи</h3>
            <p className="card-desc">Цикл завершён в {formatTime(state.booking.endAt)}</p>
          </div>
        )}

        {state.status === 'maintenance' && (
          <div>
            <div className="status-badge">🔧 На обслуживании</div>
            <h3 className="card-title">Временно недоступна</h3>
            <p className="card-desc">Выберите другую машину.</p>
          </div>
        )}
      </div>

      <div>
        {state.status === 'in_use' ? (
          <div className="progress-container">
            <div className="progress-info">
              <span>{CYCLE_LABELS[machine.type]}</span>
              <span>{getProgress(state.booking, now)}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${getProgress(state.booking, now)}%` }} />
            </div>
          </div>
        ) : (
          <div className="card-footer-link">
            {isDisabled ? (
              <span>Недоступна</span>
            ) : (
              <>
                <span>Выбрать машину</span>
                <span className="card-arrow">↗</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Заглушка карточки, пока список машин загружается. */
export function MachineCardSkeleton() {
  return (
    <div className="machine-card machine-card-skeleton" aria-hidden="true">
      <div>
        <Skeleton width="45%" height="24px" />
        <div className="skeleton-gap" />
        <Skeleton width="25%" height="12px" />
      </div>
      <div>
        <Skeleton width="30%" height="20px" />
        <div className="skeleton-gap" />
        <Skeleton width="60%" height="16px" />
        <div className="skeleton-gap" />
        <Skeleton width="80%" height="12px" />
      </div>
      <Skeleton width="100%" height="12px" />
    </div>
  );
}
