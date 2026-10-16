import React from 'react';

interface HeaderProps {
  onOpenProfile: () => void;
  isLoggedIn: boolean;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile, isLoggedIn, userName }) => {
  return (
    <header className="header">
      <div className="header-left">
        <span>Ваша прачечная</span>
      </div>

      <h1 className="header-title">Dryers & Washers</h1>

      <div>
        {isLoggedIn ? (
          <button onClick={onOpenProfile} className="profile-btn">
            👤 {userName || 'Профиль'}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onOpenProfile} className="profile-btn">
              Войти
            </button>
            <button 
              onClick={onOpenProfile} 
              className="profile-btn" 
              style={{ backgroundColor: '#047857', color: '#ffffff' }}
            >
              Регистрация
            </button>
          </div>
        )}
      </div>
    </header>
  );
};