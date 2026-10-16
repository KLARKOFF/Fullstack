import React from 'react';
import type { Machine } from '../types';

interface MachineCardProps {
  machine: Machine;
  onSelect: (machineId: string) => void;
}

export const MachineCard: React.FC<MachineCardProps> = ({ machine, onSelect }) => {
  // Выбираем класс в зависимости от статуса
  const getStatusClass = () => {
    switch (machine.status) {
      case 'free': return 'card-free';
      case 'in_use': return 'card-in-use';
      case 'waiting': return 'card-waiting';
    }
  };

  return (
    <div 
      onClick={() => onSelect(machine.id)}
      className={`machine-card ${getStatusClass()}`}
    >
      {/* Верхняя строка */}
      <div className="card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className="machine-number">{machine.id}</span>
            <span className="machine-type">
              {machine.type === 'washer' ? 'Стиральная' : 'Сушильная'}
            </span>
          </div>
          <span className="machine-capacity">до {machine.capacity} кг</span>
        </div>
        
        <div className="machine-icon">
          {machine.type === 'washer' ? '🌀' : '💨'}
        </div>
      </div>

      {/* Центральная часть */}
      <div>
        {machine.status === 'free' && (
          <div>
            <div className="status-badge">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }}></span>
              Свободен
            </div>
            <h3 className="card-title">Можно запускать</h3>
            <p className="card-desc">Барабан свободен и ждёт ваши вещи.</p>
          </div>
        )}

        {machine.status === 'in_use' && (
          <div>
            <div className="status-badge">⏳ Используется</div>
            <h3 className="card-title">Ещё {machine.timeLeft}</h3>
            <p className="card-desc">Завершится в {machine.endTime}</p>
          </div>
        )}

        {machine.status === 'waiting' && (
          <div>
            <div className="status-badge">🔔 Ожидает выгрузки</div>
            <h3 className="card-title">Пора забрать вещи</h3>
            <p className="card-desc">Цикл завершён в {machine.endTime}</p>
          </div>
        )}
      </div>

      {/* Нижняя часть */}
      <div>
        {machine.status === 'in_use' ? (
          <div className="progress-container">
            <div className="progress-info">
              <span>{machine.currentStage}</span>
              <span>{machine.progress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${machine.progress}%` }}
              ></div>
            </div>
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