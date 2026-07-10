"use client";

import { ReactNode } from "react";
import ReactQueryProvider from "./ReactQueryProvider";
import { AuthProvider } from "@/features/auth/providers/AuthProvider";

interface Props {
  children: ReactNode;
}

export function AppProviders({ children }: Props) {
  return (
    <ReactQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryProvider>
  );
}