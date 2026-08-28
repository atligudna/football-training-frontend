import Link from "next/link";
import { Clock, Layers, Target } from "lucide-react";

import { Card } from "@/components/ui/card";

import type { TrainingStory } from "../types/training-story";

interface TrainingStoryCardProps {
  story: TrainingStory;
}

export function TrainingStoryCard({ story }: TrainingStoryCardProps) {
  const pitchCount = story.pitches.length;
  const blockCount = story.pitches.reduce(
    (total, pitch) => total + pitch.activityBlocks.length,
    0
  );

  return (
    <Link href={`/sessions/${story.id}`} className="block">
      <Card className="p-6 transition hover:border-primary hover:shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {story.ageGroup}
            </p>

            <h2 className="mt-1 text-xl font-semibold">{story.title}</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {story.description}
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
            {story.status}
          </span>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{story.durationMinutes} min</span>
          </div>

          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>
              {pitchCount} {pitchCount === 1 ? "pitch" : "pitches"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>
              {blockCount} {blockCount === 1 ? "block" : "blocks"}
            </span>
          </div>
        </div>

        {story.objectives.length > 0 && (
          <div className="mt-5 border-t pt-4">
            <p className="mb-2 text-sm font-medium">Objectives</p>

            <ul className="space-y-1 text-sm text-muted-foreground">
              {story.objectives.slice(0, 3).map((objective) => (
                <li key={objective}>✓ {objective}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </Link>
  );
}