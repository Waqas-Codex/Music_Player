// User types
export enum Role {
  USER = 'USER',
  ARTIST = 'ARTIST',
  ADMIN = 'ADMIN'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// Auth token
export interface AuthToken {
  token: string;
  refreshToken?: string;
}

// API Response types
export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface ErrorResponse {
  message: string;
  statusCode?: number;
}

