import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminPage } from '@/pages/admin';
import { HomePage } from '@/pages/home';
import { ProfilePage } from '@/pages/profile';
import { AppLayout } from '../layout/AppLayout';
import { RequireAdmin, RequireAuth } from './guards';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
