"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  Home,
  Menu,
  Package,
  Settings,
  Tags,
  Target,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/sessions", label: "Sessions", icon: Calendar },
  { href: "/drills", label: "Drills", icon: ClipboardList },
  { href: "/players", label: "Players", icon: Users },
  { href: "/fields", label: "Fields", icon: Target },
  { href: "/equipment", label: "Equipment", icon: Package },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileAppMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeMenu}
            aria-label="Close navigation"
          />

          <aside className="absolute left-0 top-0 flex h-full w-[min(82vw,320px)] flex-col border-r bg-background shadow-lg">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="text-lg font-bold"
              >
                ⚽ Football Planner
              </Link>

              <Button
                type="button"
                variant="ghost"
                onClick={closeMenu}
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 space-y-1 p-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}