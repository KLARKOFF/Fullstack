import React, { useState } from 'react';
import type { ProfileUpdate } from '../api';
import { MACHINE_TYPE_LABELS } from '../types';
import type { Booking, User } from '../types';
import { useNow } from '../hooks/useNow';
import { errorText } from '../utils/errorText';
import { formatInterval, ms } from '../utils/time';

interface ProfilePageProps {
  user: User;
  bookings: Booking[];
  onUpdateProfile: (patch: ProfileUpdate) => Promise<void>;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  bookings,
  onUpdateProfile,
  onCancelBooking,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const now = useNow();

  // Активные брони — те, что ещё не закончились; прошедшие в списке не показываем
  const activeBookings = bookings
    .filter((b) => ms(b.endAt) > now.getTime())
    .sort((a, b) => ms(a.startAt) - ms(b.startAt));

  const startEditing = () => {
    setName(user.name);
    setRoom(user.room ?? '');
    setError('');
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await onUpdateProfile({ name, room });
      setIsEditing(false);
    } catch (err) {
      setError(errorText(err, 'Не удалось сохранить изменения'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    if (!confirm(`Отменить бронь машины №${booking.machineId} (${formatInterval(booking.startAt, booking.endAt)})?`)) return;
    try {
      await onCancelBooking(booking.id);
    } catch (err) {
      alert(errorText(err, 'Не удалось отменить бронь'));
    }
  };

  return (
    <div className="page">
      <h2 className="section-title">Личный кабинет</h2>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Личные данные</h3>
          {!isEditing && (
            <button className="btn btn-secondary" onClick={startEditing}>
              Изменить
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="form">
            <label className="field">
              <span>Имя</span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                autoFocus
              />
            </label>

            <label className="field">
              <span>Комната</span>
              <input
                className="input"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Например, 412"
                maxLength={10}
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input className="input" value={user.email} disabled />
            </label>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Сохранение…' : 'Сохранить'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <dl className="info-list">
            <dt>Имя</dt>
            <dd>{user.name}</dd>
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Комната</dt>
            <dd>{user.room || <span className="muted">не указана</span>}</dd>
            <dt>Роль</dt>
            <dd>{user.role === 'admin' ? 'Администратор' : 'Жилец'}</dd>
          </dl>
        )}
      </section>

      <section className="panel">
        <h3 className="panel-title">Мои бронирования</h3>

        {activeBookings.length === 0 ? (
          <p className="muted">У вас нет активных броней. Выберите свободную машину на главной странице.</p>
        ) : (
          <ul className="booking-list">
            {activeBookings.map((booking) => (
              <li key={booking.id} className="booking-item">
                <div>
                  <p className="booking-title">
                    Машина №{booking.machineId} · {MACHINE_TYPE_LABELS[booking.machineType]}
                  </p>
                  <p className="muted">{formatInterval(booking.startAt, booking.endAt)}</p>
                </div>
                {ms(booking.startAt) > now.getTime() ? (
                  <button className="btn btn-danger btn-small" onClick={() => handleCancelBooking(booking)}>
                    Отменить
                  </button>
                ) : (
                  <span className="muted">Идёт сейчас</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <button className="btn btn-danger" onClick={onLogout}>
        Выйти из аккаунта
      </button>
    </div>
  );
};