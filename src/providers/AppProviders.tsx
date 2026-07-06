"use client";

import { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import ReactQueryProvider from "./ReactQueryProvider";

interface Props {
    children: ReactNode;
}

export default function AppProviders({ children }: Props) {
    return (
        <ReactQueryProvider>
                {children}
        </ReactQueryProvider>
    );
}