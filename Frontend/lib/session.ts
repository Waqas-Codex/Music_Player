import { Role } from "@/types";

interface SessionUser {
  _id: string;
  name: string;
  email: string;
  role?: Role | string;
}

export function persistAuthSession(token: string, user: SessionUser) {
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
}

export function isSessionArtist(user: SessionUser | null | undefined): boolean {
  return user?.role === Role.ARTIST || user?.role === Role.ADMIN;
}
