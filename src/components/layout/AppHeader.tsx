"use client";

import { usePathname } from "next/navigation";
import { Bell, CalendarDays } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatLongDate } from "@/lib/date";

const today = formatLongDate(new Date());

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/sessions": "Sessions",
  "/drills": "Drills",
  "/players": "Squad",
  "/fields": "Fields",
  "/equipment": "Equipment",
  "/analytics": "Analytics",
  "/categories": "Categories",
  "/settings": "Settings",
};

export default function AppHeader() {
  const pathname = usePathname();

  const { user } = useAuth();

  const title = pageTitles[pathname] ?? "Football Planner";


  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>

        <p className="text-sm text-muted-foreground">
          {today}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <button className="rounded-full p-2 transition hover:bg-muted">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2">
          <CalendarDays size={18} />

          <div className="text-right">
            <p className="font-medium">
              {user?.name ?? "Coach"}
            </p>

            <p className="text-xs text-muted-foreground">
              {user?.role ?? ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}