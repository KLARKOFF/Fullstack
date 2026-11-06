import { Link, NavLink } from 'react-router-dom';
import { useLaundry } from '@/entities/laundry';
import { useSession } from '@/entities/user';
import { useAuthModal } from '@/features/auth';
import { Skeleton } from '@/shared/ui';

export function Header() {
  const { laundry, status } = useLaundry();
  const { user, isAdmin } = useSession();
  const authModal = useAuthModal();

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-link">
          {status === 'loading' ? <Skeleton width="120px" height="16px" /> : laundry?.name || 'Ваша прачечная'}
        </Link>
      </div>

      <h1 className="header-title">
        <Link to="/" className="header-link">
          Dryers & Washers
        </Link>
      </h1>

      <nav className="header-nav">
        {isAdmin && (
          <NavLink to="/admin" className="profile-btn">
            ⚙️ Админ-панель
          </NavLink>
        )}

        {user ? (
          <NavLink to="/profile" className="profile-btn">
            👤 {user.name}
          </NavLink>
        ) : (
          <button type="button" onClick={() => authModal.open()} className="profile-btn">
            Войти
          </button>
        )}
      </nav>
    </header>
  );
}
