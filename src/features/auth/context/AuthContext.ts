import { createContext } from "react";

import type { LoginRequest, User } from "../types/auth";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  isAuthenticated: boolean;

  login(credentials: LoginRequest): Promise<void>;
  logout(): void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);