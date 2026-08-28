"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { trainingStories } from "../data/training-stories";
import { getTrainingStoryById } from "../utils/training-story-storage";

interface TrainingStoryDetailClientProps {
  id: string;
}

export function TrainingStoryDetailClient({
  id,
}: TrainingStoryDetailClientProps) {
  const story = getTrainingStoryById(id, trainingStories);

  if (!story) {
    return (
      <div className="space-y-6">
        <Link href="/sessions">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4" />
            Back to Training Stories
          </Button>
        </Link>

        <div className="rounded-xl border border-dashed p-10 text-center">
          <h1 className="text-2xl font-semibold">Training story not found</h1>
          <p className="mt-2 text-muted-foreground">
            This training story does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/sessions">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4" />
            Back to Training Stories
          </Button>
        </Link>
      </div>

      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {story.ageGroup}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {story.title}
        </h1>

        <p className="mt-2 text-muted-foreground">{story.description}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Duration</p>
          <p className="mt-1 text-2xl font-semibold">
            {story.durationMinutes} min
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="mt-1 text-2xl font-semibold capitalize">
            {story.status}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Pitches</p>
          <p className="mt-1 text-2xl font-semibold">
            {story.pitches.length}
          </p>
        </div>
      </section>

      <section className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold">Objectives</h2>

        {story.objectives.length === 0 ? (
          <p className="mt-4 text-muted-foreground">
            No objectives added yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-2 text-muted-foreground">
            {story.objectives.map((objective) => (
              <li key={objective}>✓ {objective}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pitches</h2>

        {story.pitches.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            No pitches added yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {story.pitches.map((pitch) => (
              <div key={pitch.id} className="rounded-xl border p-6">
                <div>
                  <h3 className="text-lg font-semibold">{pitch.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pitch.coachName ?? "No coach assigned"}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {pitch.activityBlocks.map((block) => (
                    <div key={block.id} className="rounded-lg bg-muted p-4">
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}