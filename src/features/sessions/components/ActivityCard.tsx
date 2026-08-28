import type { Activity } from "../types/training-story";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="rounded-md border bg-background p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">{activity.title}</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {activity.description}
          </p>
        </div>

        <div className="text-right text-sm">
          <p className="font-medium">{activity.durationMinutes} min</p>

          <p className="capitalize text-muted-foreground">
            {activity.type}
          </p>
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
    </div>
  );
}