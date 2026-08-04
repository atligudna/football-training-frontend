"use client";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { authStorage } from "../utils/authStorage";
import { useRouter } from "next/navigation";
import type {
  LoginRequest,
  User,
} from "../types/auth";

import type { AuthContextType } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  //
  // State
  //
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  //
  // Restore Session
  //
  useEffect(() => {
    async function restoreSession() {
      const token = authStorage.getToken();

      if (!token) {
        setInitialized(true);
        return;
      }

      try {
        const user = await authService.me(token);

        setUser(user.data);
      } catch (error) {
        console.error("Unable to restore session", error);

        authStorage.clearToken();
        setUser(null);
      } finally {
        setInitialized(true);
      }
    }

    restoreSession();
  }, []);

  //
  // Login
  //
  async function login(credentials: LoginRequest) {
    setLoading(true);

    try {
      const response = await authService.login(credentials);

      authStorage.setToken(response.data.token);

      setUser(response.data.user);
    } catch (error) {
      authStorage.clearToken();
      setUser(null);

      throw error;
    } finally {
      setLoading(false);
    }
  }

  //
  // Logout
  //
  const logout = useCallback(() => {
    authStorage.clearToken();
    setUser(null);

    router.replace("/login");
  }, [router]);
  //
  // Context Value
  //
  const value: AuthContextType = useMemo(
    () => ({
      user,
      loading,
      initialized,
      login,
      logout,
      isAuthenticated: user !== null,
    }),
    [user, loading, initialized, logout,]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}