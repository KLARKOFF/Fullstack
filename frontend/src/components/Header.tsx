import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { User } from '../types';

interface HeaderProps {
  laundryName?: string;
  user: User | null;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ laundryName, user, onLoginClick }) => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-link">
          {laundryName || 'Ваша прачечная'}
        </Link>
      </div>

      <h1 className="header-title">
        <Link to="/" className="header-link">Dryers & Washers</Link>
      </h1>

      <nav className="header-nav">
        {user?.role === 'admin' && (
          <NavLink to="/admin" className="profile-btn">
            ⚙️ Админ-панель
          </NavLink>
        )}

        {user ? (
          <NavLink to="/profile" className="profile-btn">
            👤 {user.name}
          </NavLink>
        ) : (
          <button onClick={onLoginClick} className="profile-btn">
            Войти
          </button>
        )}
      </nav>
    </header>
  );
};
