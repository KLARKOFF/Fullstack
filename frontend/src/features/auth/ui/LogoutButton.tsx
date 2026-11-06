import { useNavigate } from 'react-router-dom';
import { useSession } from '@/entities/user';
import { Button, useToast } from '@/shared/ui';

export function LogoutButton() {
  const { logout } = useSession();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.show('Вы вышли из аккаунта', 'info');
  };

  return (
    <Button variant="danger" onClick={handleLogout}>
      Выйти из аккаунта
    </Button>
  );
}
