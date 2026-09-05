"use client";

import type {
  TrainingStory,
  TrainingStoryStatus,
} from "../types/training-story";

const statuses: TrainingStoryStatus[] = [
  "draft",
  "planned",
  "active",
  "completed",
  "archived",
];

interface TrainingStoryStatusSelectProps {
  story: TrainingStory;
  onChangeStatus: (status: TrainingStoryStatus) => void;
}

export function TrainingStoryStatusSelect({
  story,
  onChangeStatus,
}: TrainingStoryStatusSelectProps) {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor={`story-status-${story.id}`}
        className="text-sm font-medium text-muted-foreground"
      >
        Status
      </label>

      <select
        id={`story-status-${story.id}`}
        value={story.status}
        onChange={(event) =>
          onChangeStatus(event.target.value as TrainingStoryStatus)
        }
        className="h-10 rounded-md border bg-background px-3 text-sm capitalize"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}