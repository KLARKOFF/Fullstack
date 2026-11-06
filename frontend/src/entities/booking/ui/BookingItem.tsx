import type { ReactNode } from 'react';
import { formatInterval } from '@/shared/lib';
import { Skeleton } from '@/shared/ui';
import type { Booking } from '../model/types';

interface BookingItemProps {
  booking: Booking;
  /** Дополнительная подпись к номеру машины, например её тип. */
  machineLabel?: string;
  /** Кнопки или статус справа. */
  actions?: ReactNode;
}

export function BookingItem({ booking, machineLabel, actions }: BookingItemProps) {
  return (
    <li className="booking-item">
      <div>
        <p className="booking-title">
          Машина №{booking.machineId}
          {machineLabel && ` · ${machineLabel}`}
        </p>
        <p className="muted">{formatInterval(booking)}</p>
      </div>
      {actions}
    </li>
  );
}

/** Заглушка строки списка, пока брони загружаются. */
export function BookingItemSkeleton() {
  return (
    <li className="booking-item" aria-hidden="true">
      <div className="skeleton-stack">
        <Skeleton width="180px" height="14px" />
        <Skeleton width="140px" height="12px" />
      </div>
      <Skeleton width="72px" height="24px" />
    </li>
  );
}
