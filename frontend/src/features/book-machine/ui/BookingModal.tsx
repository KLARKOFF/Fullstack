import { useState } from 'react';
import type { FormEvent } from 'react';
import { getDaySlots, overlaps, slotToInterval, useBookings } from '@/entities/booking';
import type { Slot } from '@/entities/booking';
import { MACHINE_TYPE_LABELS } from '@/entities/machine';
import type { Machine } from '@/entities/machine';
import { useSession } from '@/entities/user';
import { errorText, formatInterval, formatTime, fromDateInputValue, toDateInputValue } from '@/shared/lib';
import { Button, FormError, InputField, Modal, SelectField, useToast } from '@/shared/ui';
import { getBookingDayRange, validateBookingDay } from '../model/validation';

interface BookingModalProps {
  /** Выбранная машина; null — окно закрыто. */
  machine: Machine | null;
  now: Date;
  onClose: () => void;
  /** Вызывается, если гость нажал «Забронировать». */
  onRequireLogin: () => void;
}

export function BookingModal({ machine, now, onClose, onRequireLogin }: BookingModalProps) {
  // Во время анимации закрытия machine уже null — показываем последнюю открытую машину
  const [lastMachine, setLastMachine] = useState(machine);
  if (machine && machine !== lastMachine) setLastMachine(machine);
  const shown = machine ?? lastMachine;

  return (
    <Modal isOpen={!!machine} title={`Бронирование машины №${shown?.id ?? ''}`} onClose={onClose}>
      {shown && <BookingForm machine={shown} now={now} onDone={onClose} onRequireLogin={onRequireLogin} />}
    </Modal>
  );
}

interface BookingFormProps {
  machine: Machine;
  now: Date;
  onDone: () => void;
  onRequireLogin: () => void;
}

function BookingForm({ machine, now, onDone, onRequireLogin }: BookingFormProps) {
  const { user } = useSession();
  const { bookings, create } = useBookings();
  const toast = useToast();

  const [day, setDay] = useState(() => toDateInputValue(now));
  const [selectedStart, setSelectedStart] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { min, max } = getBookingDayRange(now);
  const dayError = validateBookingDay(day, now);
  const machineBookings = bookings.filter((b) => b.machineId === machine.id);

  // Прошедшие слоты не показываем, занятые показываем, но выбрать их нельзя
  const slots = dayError
    ? []
    : getDaySlots(fromDateInputValue(day)).filter((s) => s.end.getTime() > now.getTime());
  const isTaken = (slot: Slot) => machineBookings.some((b) => overlaps(slot, b));
  const freeSlots = slots.filter((s) => !isTaken(s));
  const chosen = freeSlots.find((s) => s.start.getTime() === selectedStart) ?? freeSlots[0];

  const handleDayChange = (value: string) => {
    setDay(value);
    setSelectedStart(null);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireLogin();
      return;
    }
    if (!chosen) return;

    setIsSaving(true);
    setError('');
    try {
      const created = await create({ userId: user.id, machineId: machine.id, ...slotToInterval(chosen) });
      toast.show(`Машина №${machine.id} забронирована: ${formatInterval(created)}`);
      onDone();
    } catch (err) {
      setError(errorText(err, 'Не удалось забронировать машину'));
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form" noValidate>
      <p className="muted">
        Тип: <strong>{MACHINE_TYPE_LABELS[machine.type]}</strong> (до {machine.capacity} кг)
      </p>

      <InputField
        label="Дата"
        type="date"
        value={day}
        min={min}
        max={max}
        onChange={(e) => handleDayChange(e.target.value)}
        error={dayError}
      />

      {!dayError &&
        (chosen ? (
          <SelectField
            label="Время"
            value={String(chosen.start.getTime())}
            onChange={(e) => setSelectedStart(Number(e.target.value))}
          >
            {slots.map((slot) => {
              const taken = isTaken(slot);
              return (
                <option key={slot.start.getTime()} value={String(slot.start.getTime())} disabled={taken}>
                  {formatTime(slot.start)}–{formatTime(slot.end)}
                  {taken ? ' (занято)' : ''}
                </option>
              );
            })}
          </SelectField>
        ) : (
          <p className="muted">На этот день свободного времени нет. Выберите другую дату.</p>
        ))}

      {!user && <p className="hint">Чтобы забронировать машину, войдите в аккаунт.</p>}

      <FormError message={error} />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={!!user && !chosen}
        isLoading={isSaving}
        loadingText="Бронирование…"
      >
        {user ? 'Подтвердить бронь' : 'Войти, чтобы забронировать'}
      </Button>
    </form>
  );
}
