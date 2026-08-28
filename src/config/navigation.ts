import type { LucideIcon } from "lucide-react";

import {
  Home,
  CalendarDays,
  ClipboardList,
  Users,
  Goal,
  Package,
  FolderTree,
  ChartColumn,
  Settings,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Sessions",
    href: "/sessions",
    icon: CalendarDays,
  },
  {
    title: "Drills",
    href: "/drills",
    icon: ClipboardList,
  },
  {
    title: "Players",
    href: "/players",
    icon: Users,
  },
  {
    title: "Fields",
    href: "/fields",
    icon: Goal,
  },
  {
    title: "Equipment",
    href: "/equipment",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: FolderTree,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: ChartColumn,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];