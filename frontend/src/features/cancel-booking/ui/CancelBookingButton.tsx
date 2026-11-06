import { useState } from 'react';
import { useBookings } from '@/entities/booking';
import type { Booking } from '@/entities/booking';
import { errorText, formatInterval } from '@/shared/lib';
import { Button, useConfirm, useToast } from '@/shared/ui';

export function CancelBookingButton({ booking }: { booking: Booking }) {
  const { cancel } = useBookings();
  const confirm = useConfirm();
  const toast = useToast();
  const [isBusy, setIsBusy] = useState(false);

  const handleClick = async () => {
    const isConfirmed = await confirm({
      title: 'Отменить бронь?',
      message: `Машина №${booking.machineId}, ${formatInterval(booking)}. Слот станет свободным для других.`,
      confirmText: 'Отменить бронь',
      cancelText: 'Оставить',
      danger: true,
    });
    if (!isConfirmed) return;

    setIsBusy(true);
    try {
      await cancel(booking.id);
      toast.show('Бронь отменена', 'info');
    } catch (err) {
      toast.show(errorText(err, 'Не удалось отменить бронь'), 'error');
      setIsBusy(false);
    }
  };

  return (
    <Button variant="danger" size="small" onClick={handleClick} isLoading={isBusy} loadingText="Отменяем…">
      Отменить
    </Button>
  );
}
