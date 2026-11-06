import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useBookings } from '@/entities/booking';
import { getMachineState, MachineCard, MachineCardSkeleton, useMachines } from '@/entities/machine';
import { useSession } from '@/entities/user';
import { useAuthModal } from '@/features/auth';
import { BookingModal } from '@/features/book-machine';
import { combineStatus, useNow } from '@/shared/lib';
import { EmptyState, ErrorState } from '@/shared/ui';

const SKELETON_CARDS = 6;

export function HomePage() {
  const now = useNow();
  const machinesState = useMachines();
  const bookingsState = useBookings();
  const { isAdmin } = useSession();
  const authModal = useAuthModal();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { machines } = machinesState;
  const { bookings } = bookingsState;
  const status = combineStatus(machinesState.status, bookingsState.status);
  const selectedMachine = machines.find((m) => m.id === selectedId) ?? null;

  // Повторяем только те загрузки, которые упали
  const retry = () => {
    if (machinesState.status === 'error') machinesState.reload();
    if (bookingsState.status === 'error') bookingsState.reload();
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="machines-grid" aria-busy="true" aria-label="Загружаем машины">
          {Array.from({ length: SKELETON_CARDS }, (_, i) => (
            <MachineCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (status === 'error') {
      return <ErrorState message={machinesState.error || bookingsState.error} onRetry={retry} />;
    }

    if (machines.length === 0) {
      return (
        <EmptyState
          icon="🧺"
          title="Машин пока нет"
          description="Как только администратор добавит машины, они появятся здесь."
          action={
            isAdmin && (
              <Link to="/admin" className="btn btn-primary">
                Добавить машины
              </Link>
            )
          }
        />
      );
    }

    return (
      <div className="machines-grid">
        {machines.map((machine, index) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            state={getMachineState(
              machine,
              bookings.filter((b) => b.machineId === machine.id),
              now,
            )}
            now={now}
            onSelect={setSelectedId}
            style={{ '--i': index } as CSSProperties}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <h2 className="section-title page-title">Все машины</h2>
      {renderContent()}

      <BookingModal
        machine={selectedMachine}
        now={now}
        onClose={() => setSelectedId(null)}
        onRequireLogin={() => authModal.open()}
      />
    </>
  );
}
