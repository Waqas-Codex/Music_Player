import axiosInstance from "@/lib/axios";
import { ApiRoutes } from "@/services/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

import { Role } from "@/types";

export interface AuthResponse {
  message?: string;
  token?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role?: Role | string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post(ApiRoutes.auth.login, credentials);
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      // Also set cookie for middleware (use same name as backend)
      document.cookie = `token=${response.data.token}; path=/; max-age=86400`; // 1 day
    }
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post(ApiRoutes.auth.register, data);
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      // Also set cookie for middleware (use same name as backend)
      document.cookie = `token=${response.data.token}; path=/; max-age=86400`; // 1 day
    }
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem("authToken");
    // Remove cookie (use same name as backend)
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    await axiosInstance.post(ApiRoutes.auth.logout);
  },

  async getCurrentUser() {
    const response = await axiosInstance.get(ApiRoutes.user.me);
    return response.data;
  },

  async updateProfileImage(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axiosInstance.put(ApiRoutes.user.avatar, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
