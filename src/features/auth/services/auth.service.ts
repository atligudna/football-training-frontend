import { api } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterResponse {
  success: boolean;
  data: User;
}

export const authService = {
  login(credentials: LoginRequest) {
    return api.post<LoginResponse>("/auth/login", credentials);
  },

  register(user: RegisterRequest) {
    return api.post<RegisterResponse>("/auth/register", user);
  },
};