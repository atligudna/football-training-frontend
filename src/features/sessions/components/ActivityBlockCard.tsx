import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

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
  onDeleteActivityBlock: () => void;
}

export function ActivityBlockCard({
  block,
  onAddActivity,
  onDeleteActivity,
  onDeleteActivityBlock,
}: ActivityBlockCardProps) {
  return (
    <div className="rounded-lg bg-muted p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">{block.title}</p>

          <p className="text-sm text-muted-foreground capitalize">
            {block.type}
          </p>
        </div>

        <div className="flex items-start gap-3">
          <p className="text-sm font-medium">
            {block.durationMinutes} min
          </p>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDeleteActivityBlock}
            aria-label="Delete activity block"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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