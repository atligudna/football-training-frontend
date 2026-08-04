"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";

export default function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        {user.name.charAt(0).toUpperCase()}
      </div>

      <div className="hidden text-left md:block">
        <p className="text-sm font-medium">
          {user.name}
        </p>

        <p className="text-xs text-muted-foreground">
          {user.role}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}