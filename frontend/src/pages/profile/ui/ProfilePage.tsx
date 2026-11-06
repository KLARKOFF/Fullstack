import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingItem, BookingItemSkeleton, useBookings } from '@/entities/booking';
import { MACHINE_TYPE_LABELS, useMachines } from '@/entities/machine';
import { UserInfo, useSession } from '@/entities/user';
import type { User } from '@/entities/user';
import { LogoutButton } from '@/features/auth';
import { CancelBookingButton } from '@/features/cancel-booking';
import { EditProfileForm } from '@/features/edit-profile';
import { ms, useNow } from '@/shared/lib';
import { Button, EmptyState, ErrorState } from '@/shared/ui';

export function ProfilePage() {
  // Страница открывается только вошедшим (см. RequireAuth), поэтому user здесь есть
  const user = useSession().user as User;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="page">
      <h2 className="section-title">Личный кабинет</h2>

      <section className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Личные данные</h3>
          {!isEditing && <Button onClick={() => setIsEditing(true)}>Изменить</Button>}
        </div>

        {isEditing ? (
          <EditProfileForm user={user} onClose={() => setIsEditing(false)} />
        ) : (
          <UserInfo user={user} />
        )}
      </section>

      <section className="panel">
        <h3 className="panel-title">Мои бронирования</h3>
        <MyBookings userId={user.id} />
      </section>

      <LogoutButton />
    </div>
  );
}

function MyBookings({ userId }: { userId: string }) {
  const now = useNow();
  const { bookings, status, error, reload } = useBookings();
  const { machines } = useMachines();

  if (status === 'loading') {
    return (
      <ul className="booking-list" aria-busy="true" aria-label="Загружаем брони">
        <BookingItemSkeleton />
        <BookingItemSkeleton />
      </ul>
    );
  }

  if (status === 'error') {
    return <ErrorState message={error} onRetry={reload} />;
  }

  // Активные брони — те, что ещё не закончились; прошедшие в списке не показываем
  const activeBookings = bookings
    .filter((b) => b.userId === userId && ms(b.endAt) > now.getTime())
    .sort((a, b) => ms(a.startAt) - ms(b.startAt));

  if (activeBookings.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="Активных броней нет"
        description="Выберите свободную машину и удобное время."
        action={
          <Link to="/" className="btn btn-primary">
            К машинам
          </Link>
        }
      />
    );
  }

  const machineTypeLabel = (machineId: string) => {
    const machine = machines.find((m) => m.id === machineId);
    return machine && MACHINE_TYPE_LABELS[machine.type];
  };

  return (
    <ul className="booking-list">
      {activeBookings.map((booking) => (
        <BookingItem
          key={booking.id}
          booking={booking}
          machineLabel={machineTypeLabel(booking.machineId)}
          actions={
            ms(booking.startAt) > now.getTime() ? (
              <CancelBookingButton booking={booking} />
            ) : (
              <span className="muted">Идёт сейчас</span>
            )
          }
        />
      ))}
    </ul>
  );
}
