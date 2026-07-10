"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { authStorage } from "../utils/authStorage";

import type { LoginRequest, User } from "../types/auth";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  //
  // State
  //
  const [user, setUser] = useState<User | null>(null);

  // loading þegar user smellir á Login
  const [loading, setLoading] = useState(false);

  // loading þegar appið ræsist
  const [initialized, setInitialized] = useState(false);

  //
  // Restore session
  //
  useEffect(() => {
    async function restoreSession() {
      const token = authStorage.getToken();

      if (!token) {
        setInitialized(true);
        return;
      }

      try {
        const response = await authService.me(token);

        setUser(response.data);
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
    } finally {
      setLoading(false);
    }
  }

  //
  // Logout
  //
  function logout() {
    authStorage.clearToken();
    setUser(null);
  }

  //
  // Context Value
  //
  const value = useMemo(
    () => ({
      user,
      loading,
      initialized,
      login,
      logout,
      isAuthenticated: user !== null,
    }),
    [user, loading, initialized]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}