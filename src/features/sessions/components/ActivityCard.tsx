import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Activity } from "../types/training-story";

interface ActivityCardProps {
    activity: Activity;
    onDeleteActivity?: () => void;
}

export function ActivityCard({
    activity,
    onDeleteActivity,
}: ActivityCardProps) {
    return (
        <div className="rounded-md border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-medium">{activity.title}</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {activity.description}
                    </p>
                </div>

                <div className="flex items-start gap-3">
                    <div className="text-right text-sm">
                        <p className="font-medium">{activity.durationMinutes} min</p>

                        <p className="capitalize text-muted-foreground">
                            {activity.type}
                        </p>
                    </div>

                    {onDeleteActivity && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onDeleteActivity}
                            aria-label="Delete activity"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {activity.coachingPoints.length > 0 && (
                <div className="mt-3">
                    <p className="text-sm font-medium">Coaching points</p>

                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                        {activity.coachingPoints.map((point) => (
                            <li key={point.id}>✓ {point.text}</li>
                        ))}
                    </ul>
                </div>
            )}

            {activity.playerFocus.length > 0 && (
                <div className="mt-3">
                    <p className="text-sm font-medium">Player focus</p>

                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                        {activity.playerFocus.map((focus) => (
                            <li key={focus.id}>• {focus.text}</li>
                        ))}
                    </ul>
                </div>
            )}

            {activity.equipment.length > 0 && (
                <div className="mt-3">
                    <p className="text-sm font-medium">Equipment</p>

                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                        {activity.equipment.map((item) => (
                            <li key={item.id}>
                                {item.name} x {item.quantity}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}