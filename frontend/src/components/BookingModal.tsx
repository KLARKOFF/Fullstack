import React, { useState } from 'react';
import type { Machine } from '../types';

interface BookingModalProps {
  machine: Machine | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (machineId: string, time: string) => void;
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

const AVAILABLE_TIMES = ['10:00 - 11:00', '12:00 - 13:00', '14:00 - 15:00', '16:00 - 17:00', '18:00 - 19:00'];

export const BookingModal: React.FC<BookingModalProps> = ({ 
  machine, 
  isOpen, 
  onClose, 
  onConfirmBooking, 
  isLoggedIn, 
  onRequireLogin 
}) => {
  const [selectedTime, setSelectedTime] = useState(AVAILABLE_TIMES[0]);

  if (!isOpen || !machine) return null;

  const handleBookClick = () => {
    if (!isLoggedIn) {
      alert('Пожалуйста, войдите в систему, чтобы забронировать машину.');
      onRequireLogin();
      return;
    }
    onConfirmBooking(machine.id, selectedTime);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Бронирование машины №{machine.id}</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <p style={{ margin: '12px 0', color: '#4b5563' }}>
          Тип: <strong>{machine.type === 'washer' ? 'Стиральная' : 'Сушильная'}</strong> (до {machine.capacity} кг)
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Выберите удобное время:</label>
          <select 
            value={selectedTime} 
            onChange={(e) => setSelectedTime(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {AVAILABLE_TIMES.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleBookClick}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: '#059669', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Подтвердить бронь
        </button>
      </div>
    </div>
  );
};