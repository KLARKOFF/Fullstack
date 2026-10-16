import React from 'react';
import type { Booking, User } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  bookings, 
  onCancelBooking, 
  onLogout 
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h3>Личный кабинет</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div style={{ margin: '16px 0', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '16px' }}>👤 {user.name}</p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>{user.email}</p>
        </div>

        <h4 style={{ marginBottom: '8px' }}>Ваши бронирования:</h4>
        {bookings.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>У вас пока нет активных броней.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
            {bookings.map((booking) => (
              <div key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                <div>
                  <p style={{ fontWeight: '500', fontSize: '14px' }}>Машина №{booking.machineId} ({booking.machineType === 'washer' ? 'Стирка' : 'Сушка'})</p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>Время: {booking.time}</p>
                </div>
                <button 
                  onClick={() => onCancelBooking(booking.id)}
                  style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Отменить
                </button>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={() => { onLogout(); onClose(); }}
          style={{ width: '100%', padding: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};