import {
  CalendarDays,
  ChartColumn,
  ClipboardList,
  Goal,
  Home,
  Package,
  Settings,
  Users,
  FolderTree,
} from "lucide-react";

export const navigation = [
  {
    title: "Home",
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
    title: "Equipment",
    href: "/equipment",
    icon: Package,
  },
  {
    title: "Fields",
    href: "/fields",
    icon: Goal,
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