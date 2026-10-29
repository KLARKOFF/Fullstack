import React, { useState } from 'react';
import { MachineCard } from '../components/MachineCard';
import { BookingModal } from '../components/BookingModal';
import { useNow } from '../hooks/useNow';
import { getMachineState } from '../utils/machineState';
import type { Slot } from '../utils/time';
import type { Booking, Machine } from '../types';

interface HomePageProps {
  machines: Machine[];
  schedule: Booking[];
  isLoggedIn: boolean;
  onRequireLogin: () => void;
  onConfirmBooking: (machineId: string, slot: Slot) => Promise<void>;
}

export const HomePage: React.FC<HomePageProps> = ({
  machines,
  schedule,
  isLoggedIn,
  onRequireLogin,
  onConfirmBooking,
}) => {
  const now = useNow();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedMachine = machines.find((m) => m.id === selectedId) ?? null;

  const handleSelectMachine = (id: string) => {
    const machine = machines.find((m) => m.id === id);
    if (!machine) return;

    if (machine.isUnderMaintenance) {
      alert('Эта машина на обслуживании. Выберите другую.');
      return;
    }
    setSelectedId(id);
  };

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h2 className="section-title">Все машины</h2>
      </div>

      {machines.length === 0 ? (
        <p className="muted">Машин пока нет.</p>
      ) : (
        <div className="machines-grid">
          {machines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              state={getMachineState(machine, schedule, now)}
              now={now}
              onSelect={handleSelectMachine}
            />
          ))}
        </div>
      )}

      <BookingModal
        machine={selectedMachine}
        bookings={schedule.filter((b) => b.machineId === selectedId)}
        now={now}
        isOpen={!!selectedMachine}
        onClose={() => setSelectedId(null)}
        onConfirmBooking={onConfirmBooking}
        isLoggedIn={isLoggedIn}
        onRequireLogin={onRequireLogin}
      />
    </>
  );
};