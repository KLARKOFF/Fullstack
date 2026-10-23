import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import * as api from './api';
import type { Booking, Laundry, Machine, User } from './types';
import './App.css';

export default function App() {
  const navigate = useNavigate();

  const [machines, setMachines] = useState<Machine[]>([]);
  const [laundry, setLaundry] = useState<Laundry | null>(null);
  const [user, setUser] = useState<User | null>(() => api.getSessionUser());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    api.getMachines().then(setMachines);
    api.getLaundry().then(setLaundry);
  }, []);

  const userId = user?.id;
  useEffect(() => {
    if (userId) api.getBookings(userId).then(setBookings);
  }, [userId]);

  const handleLogin = async (name: string, email: string) => {
    setUser(await api.login(name, email));
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setBookings([]);
    navigate('/');
  };

  const handleUpdateProfile = async (patch: api.ProfileUpdate) => {
    if (!user) return;
    setUser(await api.updateProfile(user.id, patch));
  };

  const handleConfirmBooking = async (machineId: string, time: string) => {
    const machine = machines.find((m) => m.id === machineId);
    if (!machine || !user) return;

    const created = await api.createBooking({
      userId: user.id,
      machineId,
      machineType: machine.type,
      time,
      date: 'Сегодня',
    });

    setBookings((prev) => [...prev, created]);
    alert(`Машина №${machineId} забронирована на ${time}`);
  };

  const handleCancelBooking = async (bookingId: string) => {
    await api.cancelBooking(bookingId);
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  const handleRenameLaundry = async (name: string) => {
    setLaundry(await api.updateLaundry(name));
  };

  const handleCreateMachine = async (data: api.MachineInput) => {
    await api.createMachine(data);
    setMachines(await api.getMachines());
  };

  const handleUpdateMachine = async (id: string, patch: api.MachineUpdate) => {
    const updated = await api.updateMachine(id, patch);
    setMachines((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const handleDeleteMachine = async (id: string) => {
    await api.deleteMachine(id);
    setMachines((prev) => prev.filter((m) => m.id !== id));
    setBookings((prev) => prev.filter((b) => b.machineId !== id));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="app-container">
      <Header
        laundryName={laundry?.name}
        user={user}
        onLoginClick={() => setIsAuthOpen(true)}
      />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                machines={machines}
                isLoggedIn={!!user}
                onRequireLogin={() => setIsAuthOpen(true)}
                onConfirmBooking={handleConfirmBooking}
              />
            }
          />
          <Route
            path="/profile"
            element={
              user ? (
                <ProfilePage
                  user={user}
                  bookings={bookings}
                  onUpdateProfile={handleUpdateProfile}
                  onCancelBooking={handleCancelBooking}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminPage
                  laundry={laundry}
                  machines={machines}
                  onRenameLaundry={handleRenameLaundry}
                  onCreateMachine={handleCreateMachine}
                  onUpdateMachine={handleUpdateMachine}
                  onDeleteMachine={handleDeleteMachine}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
