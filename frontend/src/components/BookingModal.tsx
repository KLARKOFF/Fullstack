import React, { useState } from 'react';
import { MACHINE_TYPE_LABELS } from '../types';
import type { Booking, Machine } from '../types';
import {
  BOOKING_DAYS_AHEAD,
  addDays,
  formatTime,
  fromDateInputValue,
  getDaySlots,
  overlaps,
  toDateInputValue,
} from '../utils/time';
import type { Slot } from '../utils/time';
import { errorText } from '../utils/errorText';

interface BookingModalProps {
  machine: Machine | null;
  bookings: Booking[]; // брони только этой машины
  now: Date;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (machineId: string, slot: Slot) => Promise<void>;
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

const fieldStyle = { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };

export const BookingModal: React.FC<BookingModalProps> = ({
  machine,
  bookings,
  now,
  isOpen,
  onClose,
  onConfirmBooking,
  isLoggedIn,
  onRequireLogin,
}) => {
  const [day, setDay] = useState(() => toDateInputValue(new Date()));
  const [selectedStart, setSelectedStart] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !machine) return null;

  const minDay = toDateInputValue(now);
  const maxDay = toDateInputValue(addDays(now, BOOKING_DAYS_AHEAD));

  // Прошедшие слоты не показываем, занятые показываем, но выбрать их нельзя
  const slots = getDaySlots(fromDateInputValue(day)).filter((s) => s.end.getTime() > now.getTime());
  const isTaken = (slot: Slot) => bookings.some((b) => overlaps(slot, b));
  const freeSlots = slots.filter((s) => !isTaken(s));
  const chosen = freeSlots.find((s) => s.start.getTime() === selectedStart) ?? freeSlots[0];

  const handleClose = () => {
    setSelectedStart(null);
    setError('');
    onClose();
  };

  const handleDayChange = (value: string) => {
    // Строки "YYYY-MM-DD" можно сравнивать как текст
    if (!value || value < minDay || value > maxDay) return;
    setDay(value);
    setSelectedStart(null);
  };

  const handleBookClick = async () => {
    if (!isLoggedIn) {
      alert('Пожалуйста, войдите в систему, чтобы забронировать машину.');
      onRequireLogin();
      return;
    }
    if (!chosen) return;

    setIsSaving(true);
    setError('');
    try {
      await onConfirmBooking(machine.id, chosen);
      handleClose();
    } catch (err) {
      setError(errorText(err, 'Не удалось забронировать машину'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Бронирование машины №{machine.id}</h3>
          <button onClick={handleClose} className="close-btn">✕</button>
        </div>

        <p style={{ margin: '12px 0', color: '#4b5563' }}>
          Тип: <strong>{MACHINE_TYPE_LABELS[machine.type]}</strong> (до {machine.capacity} кг)
        </p>

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Дата:</label>
          <input
            type="date"
            value={day}
            min={minDay}
            max={maxDay}
            onChange={(e) => handleDayChange(e.target.value)}
            style={fieldStyle}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Выберите удобное время:</label>
          {chosen ? (
            <select
              value={String(chosen.start.getTime())}
              onChange={(e) => setSelectedStart(Number(e.target.value))}
              style={fieldStyle}
            >
              {slots.map((slot) => {
                const taken = isTaken(slot);
                return (
                  <option key={slot.start.getTime()} value={String(slot.start.getTime())} disabled={taken}>
                    {formatTime(slot.start)}–{formatTime(slot.end)}{taken ? ' (занято)' : ''}
                  </option>
                );
              })}
            </select>
          ) : (
            <p className="muted">На этот день свободного времени нет. Выберите другую дату.</p>
          )}
        </div>

        {error && <p className="form-error" style={{ marginBottom: '12px' }}>{error}</p>}

        <button
          onClick={handleBookClick}
          disabled={!chosen || isSaving}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: chosen && !isSaving ? 'pointer' : 'not-allowed',
            opacity: chosen && !isSaving ? 1 : 0.6,
            fontWeight: 'bold'
          }}
        >
          {isSaving ? 'Бронирование…' : 'Подтвердить бронь'}
        </button>
      </div>
    </div>
  );
};