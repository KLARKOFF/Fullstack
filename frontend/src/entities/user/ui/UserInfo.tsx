import type { User } from '../model/types';

export function UserInfo({ user }: { user: User }) {
  return (
    <dl className="info-list">
      <dt>Имя</dt>
      <dd>{user.name}</dd>
      <dt>Email</dt>
      <dd>{user.email}</dd>
      <dt>Комната</dt>
      <dd>{user.room || <span className="muted">не указана</span>}</dd>
      <dt>Роль</dt>
      <dd>{user.role === 'admin' ? 'Администратор' : 'Жилец'}</dd>
    </dl>
  );
}
