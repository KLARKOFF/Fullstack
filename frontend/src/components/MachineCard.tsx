import React from 'react';
import { MACHINE_TYPE_LABELS } from '../types';
import type { Machine, MachineState, MachineStatus, MachineType } from '../types';
import { getProgress, minutesLeft } from '../utils/machineState';
import { formatDay, formatTime } from '../utils/time';

interface MachineCardProps {
  machine: Machine;
  state: MachineState;
  now: Date;
  onSelect: (machineId: string) => void;
}

const STATUS_CLASS: Record<MachineStatus, string> = {
  free: 'card-free',
  in_use: 'card-in-use',
  waiting: 'card-waiting',
  maintenance: 'card-maintenance',
};

const CYCLE_LABELS: Record<MachineType, string> = {
  washer: 'Стирка',
  dryer: 'Сушка',
};

export const MachineCard: React.FC<MachineCardProps> = ({ machine, state, now, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(machine.id)}
      className={`machine-card ${STATUS_CLASS[state.status]}`}
    >
      <div className="card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className="machine-number">{machine.id}</span>
            <span className="machine-type">
              {MACHINE_TYPE_LABELS[machine.type]}
            </span>
          </div>
          <span className="machine-capacity">до {machine.capacity} кг</span>
        </div>
      </div>

      <div>
        {state.status === 'free' && (
          <div>
            <div className="status-badge">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }}></span>
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
              <div
                className="progress-bar-fill"
                style={{ width: `${getProgress(state.booking, now)}%` }}
              ></div>
            </div>
          </div>
        ) : state.status === 'maintenance' ? (
          <div className="card-footer-link">
            <span>Недоступна</span>
          </div>
        ) : (
          <div className="card-footer-link">
            <span>Выбрать машину</span>
            <span>↗</span>
          </div>
        )}
      </div>
    </div>
  );
};