import {
  CalendarDays,
  ChartColumn,
  ClipboardList,
  Goal,
  LayoutDashboard,
  Package,
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