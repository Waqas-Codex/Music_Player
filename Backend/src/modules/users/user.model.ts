export enum Role {
  USER = "USER",
  ARTIST = "ARTIST",
  ADMIN = "ADMIN",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  avatarUrl?: string;
}
