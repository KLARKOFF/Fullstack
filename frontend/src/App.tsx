import { useState } from 'react';
import { Header } from './components/Header';
import { MachineCard } from './components/MachineCard';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { ProfileModal } from './components/ProfileModal';
import type { Machine, User, Booking } from './types';
import './App.css';

const INITIAL_MACHINES: Machine[] = [
  { id: '01', type: 'washer', capacity: 6, status: 'free' },
  { id: '02', type: 'washer', capacity: 6, status: 'in_use', timeLeft: '24 мин', endTime: '14:56', currentStage: 'Полоскание', progress: 60 },
  { id: '03', type: 'washer', capacity: 6, status: 'waiting', endTime: '14:24' },
  { id: '04', type: 'washer', capacity: 8, status: 'free' },
  { id: '05', type: 'dryer', capacity: 8, status: 'in_use', timeLeft: '12 мин', endTime: '14:44', currentStage: 'Сушка', progress: 80 },
  { id: '06', type: 'dryer', capacity: 8, status: 'free' },
];

export default function App() {
  const [machines] = useState<Machine[]>(INITIAL_MACHINES);
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Состояния модалок
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMachineForBooking, setSelectedMachineForBooking] = useState<Machine | null>(null);

  // Обработчик клика по машине
  const handleSelectMachine = (id: string) => {
    const machine = machines.find((m) => m.id === id);
    if (machine && machine.status === 'free') {
      setSelectedMachineForBooking(machine);
    } else {
      alert('Эта машина сейчас занята или ожидает выгрузки.');
    }
  };

  // Обработчик открытия профиля или входа
  const handleOpenProfileOrAuth = () => {
    if (user) {
      setIsProfileOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  // Успешный вход / регистрация
  const handleLogin = (name: string, email: string) => {
    setUser({ name, email });
  };

  // Выход из системы
  const handleLogout = () => {
    setUser(null);
    setBookings([]);
  };

  // Создание брони
  const handleConfirmBooking = (machineId: string, time: string) => {
    const machine = machines.find((m) => m.id === machineId);
    if (!machine) return;

    const newBooking: Booking = {
      id: Date.now().toString(),
      machineId,
      machineType: machine.type,
      time,
      date: 'Сегодня',
    };

    setBookings([...bookings, newBooking]);
    alert(`Машина №${machineId} успешно забронирована на ${time}!`);
  };

  // Отмена брони
  const handleCancelBooking = (bookingId: string) => {
    setBookings(bookings.filter((b) => b.id !== bookingId));
  };

  return (
    <div className="app-container">
      <Header 
        isLoggedIn={!!user} 
        userName={user?.name}
        onOpenProfile={handleOpenProfileOrAuth} 
      />

      <main className="main-content">
        <div style={{ marginBottom: '24px' }}>
          <h2 className="section-title">Все машины</h2>
        </div>

        <div className="machines-grid">
          {machines.map((machine) => (
            <MachineCard 
              key={machine.id} 
              machine={machine} 
              onSelect={handleSelectMachine} 
            />
          ))}
        </div>
      </main>

      {/* Модальные окна */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={handleLogin} 
      />

      <BookingModal 
        machine={selectedMachineForBooking} 
        isOpen={!!selectedMachineForBooking} 
        onClose={() => setSelectedMachineForBooking(null)} 
        onConfirmBooking={handleConfirmBooking}
        isLoggedIn={!!user}
        onRequireLogin={() => setIsAuthOpen(true)}
      />

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onLogout={handleLogout}
      />
    </div>
  );
}