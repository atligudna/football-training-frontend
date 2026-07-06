import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { AppProviders } from "@/providers";

export const metadata: Metadata = {
  title: "Football Planner",
  description: "Training planning for football coaches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
  <body className="min-h-screen bg-background antialiased">
    {children}
  </body>
</html>
  );
}
