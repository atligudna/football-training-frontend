import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Package,
  Map,
  Goal,
  ChartColumn,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
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
    title: "Categories",
    href: "/categories",
    icon: Map,
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