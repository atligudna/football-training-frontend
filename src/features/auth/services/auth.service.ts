import { api } from "@/lib/api";
import type {
  ApiResponse,
  LoginData,
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/auth";

export const authService = {
  login(credentials: LoginRequest) {
    return api.post<ApiResponse<LoginData>>(
      "/auth/login",
      credentials
    );
  },

  register(user: RegisterRequest) {
    return api.post<ApiResponse<User>>(
      "/auth/register",
      user
    );
  },

  me(token: string) {
    return api.get<ApiResponse<User>>(
      "/users/me",
      token
    );
  },
};