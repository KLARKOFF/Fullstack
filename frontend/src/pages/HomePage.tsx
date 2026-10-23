import React, { useState } from 'react';
import { MachineCard } from '../components/MachineCard';
import { BookingModal } from '../components/BookingModal';
import type { Machine } from '../types';

interface HomePageProps {
  machines: Machine[];
  isLoggedIn: boolean;
  onRequireLogin: () => void;
  onConfirmBooking: (machineId: string, time: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  machines,
  isLoggedIn,
  onRequireLogin,
  onConfirmBooking,
}) => {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const handleSelectMachine = (id: string) => {
    const machine = machines.find((m) => m.id === id);
    if (!machine) return;

    if (machine.status === 'free') {
      setSelectedMachine(machine);
    } else if (machine.status === 'maintenance') {
      alert('Эта машина на обслуживании. Выберите другую.');
    } else {
      alert('Эта машина сейчас занята или ожидает выгрузки.');
    }
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
              onSelect={handleSelectMachine}
            />
          ))}
        </div>
      )}

      <BookingModal
        machine={selectedMachine}
        isOpen={!!selectedMachine}
        onClose={() => setSelectedMachine(null)}
        onConfirmBooking={onConfirmBooking}
        isLoggedIn={isLoggedIn}
        onRequireLogin={onRequireLogin}
      />
    </>
  );
};
