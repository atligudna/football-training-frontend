import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { TrainingStory } from "../types/training-story";

interface TrainingStoryHeaderProps {
  story: TrainingStory;
  onEdit: () => void;
  onDelete: () => void;
}

export function TrainingStoryHeader({
  story,
  onEdit,
  onDelete,
}: TrainingStoryHeaderProps) {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/sessions">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4" />
            Back to Training Stories
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {story.ageGroup}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {story.title}
          </h1>

          <p className="mt-2 text-muted-foreground">{story.description}</p>

          {story.theme && (
            <p className="mt-2 text-sm text-muted-foreground">
              Theme: {story.theme}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
            Edit Story
          </Button>

          <Button type="button" variant="ghost" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}