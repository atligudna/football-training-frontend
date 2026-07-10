import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  CalendarPlus,
  CalendarDays,
  ClipboardList,
  Users,
} from "lucide-react";

export default function QuickActionsCard() {
  const actions = [
    {
      title: "New Session",
      href: "/sessions",
      icon: CalendarPlus,
      variant: "default" as const,
    },
    {
      title: "Sessions",
      href: "/sessions",
      icon: CalendarDays,
      variant: "secondary" as const,
    },
    {
      title: "Drills",
      href: "/drills",
      icon: ClipboardList,
      variant: "secondary" as const,
    },
    {
      title: "Squad",
      href: "/players",
      icon: Users,
      variant: "secondary" as const,
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="mb-5 text-xl font-semibold">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
            >
              <Button
                variant={action.variant}
                className="h-20 w-full"
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon size={24} />
                  <span>{action.title}</span>
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}