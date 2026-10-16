import { useState } from 'react';
import { Header } from './components/Header';
import { MachineCard } from './components/MachineCard';
import type { Machine } from './types';
import './App.css';

// МООК
const INITIAL_MACHINES: Machine[] = [
  { id: '01', type: 'washer', capacity: 6, status: 'free' },
  { 
    id: '02', 
    type: 'washer', 
    capacity: 6, 
    status: 'in_use', 
    timeLeft: '24 мин', 
    endTime: '14:56', 
    currentStage: 'Полоскание', 
    progress: 60 
  },
  { id: '03', type: 'washer', capacity: 6, status: 'waiting', endTime: '14:24' },
  { id: '04', type: 'washer', capacity: 8, status: 'free' },
  { 
    id: '05', 
    type: 'dryer', 
    capacity: 8, 
    status: 'in_use', 
    timeLeft: '12 мин', 
    endTime: '14:44', 
    currentStage: 'Сушка', 
    progress: 80 
  },
  { id: '06', type: 'dryer', capacity: 8, status: 'free' },
];

export default function App() {
  const [machines] = useState<Machine[]>(INITIAL_MACHINES);
  const [isLoggedIn] = useState<boolean>(false);

  const handleSelectMachine = (id: string) => {
    alert(`Клик по машине №${id}. Здесь откроется модальное окно с календарём!`);
  };

  const handleOpenProfile = () => {
    alert('Открытие модального окна профиля / авторизации!');
  };

  return (
    <div className="app-container">
      <Header 
        isLoggedIn={isLoggedIn} 
        onOpenProfile={handleOpenProfile} 
      />

      <main className="main-content">
        <div style={{ marginBottom: '24px' }}>
          <h2 className="section-title">Машины</h2>
          <p className="section-subtitle">Стирка без очереди: проверьте статус и выберите машину.</p>
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
    </div>
  );
}