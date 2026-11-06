import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/widgets/header';

export function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {/* key: при смене страницы блок пересоздаётся и проигрывает анимацию появления */}
        <div key={pathname} className="route-transition">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
