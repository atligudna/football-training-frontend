"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../hooks/useAuth";

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const router = useRouter();

  const {
    initialized,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}