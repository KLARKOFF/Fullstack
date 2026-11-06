export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  room?: string;
}

export type ProfileUpdate = Partial<Pick<User, 'name' | 'room'>>;
