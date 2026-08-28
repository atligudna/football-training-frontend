import { AddActivityForm } from "./AddActivityForm";
import { ActivityCard } from "./ActivityCard";

import type {
  Activity,
  ActivityBlock,
} from "../types/training-story";

interface ActivityBlockCardProps {
  block: ActivityBlock;
  onAddActivity: (activity: Activity) => void;
  onDeleteActivity: (activityId: string) => void;
}

export function ActivityBlockCard({
  block,
  onAddActivity,
  onDeleteActivity,
}: ActivityBlockCardProps) {
  return (
    <div className="rounded-lg bg-muted p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium">{block.title}</p>

          <p className="text-sm text-muted-foreground capitalize">
            {block.type}
          </p>
        </div>

        <p className="text-sm font-medium">
          {block.durationMinutes} min
        </p>
      </div>

      {block.activities.length > 0 && (
        <div className="mt-4 space-y-3">
          {block.activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onDeleteActivity={() => onDeleteActivity(activity.id)}
            />
          ))}
        </div>
      )}

      <AddActivityForm onAddActivity={onAddActivity} />
    </div>
  );
}