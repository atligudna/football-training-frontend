"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  Map,
  Backpack,
  ChartColumn,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

export const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Sessions",
    href: "/sessions",
    icon: CalendarDays,
  },
  {
    name: "Drills",
    href: "/drills",
    icon: ClipboardList,
  },
  {
    name: "Squad",
    href: "/players",
    icon: Users,
  },
  {
    name: "Fields",
    href: "/fields",
    icon: Map,
  },
  {
    name: "Equipment",
    href: "/equipment",
    icon: Backpack,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: ChartColumn,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r bg-background">
      {/* Header */}
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">
          ⚽ Football Planner
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={18} />

              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="font-medium">
          👤 Atli Guðnason
        </p>

        <p className="text-sm text-muted-foreground">
          Coach
        </p>
      </div>
    </aside>
  );
}