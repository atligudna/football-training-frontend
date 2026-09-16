import type { Metadata } from "next";

import { AuthProvider } from "@/features/auth/providers/AuthProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Football Planner",
  description: "Plan football training sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}