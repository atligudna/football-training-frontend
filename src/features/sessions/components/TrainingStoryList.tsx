import { TrainingStoryCard } from "./TrainingStoryCard";

import type { TrainingStory } from "../types/training-story";

interface TrainingStoryListProps {
  stories: TrainingStory[];
}

export function TrainingStoryList({ stories }: TrainingStoryListProps) {
  if (stories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <h2 className="text-lg font-semibold">No training stories yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first training story to start planning sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {stories.map((story) => (
        <TrainingStoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}