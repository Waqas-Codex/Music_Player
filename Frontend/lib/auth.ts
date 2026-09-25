import { Role } from '@/types';

interface AuthUser {
  role?: Role | string;
}

export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isArtistUser(user: AuthUser | null | undefined): boolean {
  if (user?.role === Role.ARTIST || user?.role === Role.ADMIN) {
    return true;
  }

  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem('authToken');
  if (!token) return false;

  const payload = parseJwtPayload(token);
  return payload?.role === Role.ARTIST || payload?.role === Role.ADMIN;
}
