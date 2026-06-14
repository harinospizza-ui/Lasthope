import { AdminRole } from './types';

export interface AdminUser {
  role: AdminRole;
  username: string;
  password: string;
  outletId: string | null;
}

export const ADMIN_USERS: AdminUser[] = [
  { role: 'admin', username: 'Admin_Harinos', password: 'Harinos_Admin', outletId: null },
  { role: 'manager', username: 'Manager_Harinos', password: 'Harinos_Manager', outletId: null },
  { role: 'staff', username: 'Staff_Harinos', password: 'Harinos_Staff', outletId: null },
];

export const authenticateAdmin = (username: string, password: string): AdminUser | null =>
  ADMIN_USERS.find((user) => user.username === username && user.password === password) ?? null;
