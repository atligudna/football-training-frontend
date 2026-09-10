"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { trainingStories } from "../data/training-stories";
import { getTrainingStoryById } from "../utils/training-story-storage";

import type { Activity, TrainingStory } from "../types/training-story";

interface RunTrainingStoryClientProps {
  id: string;
}

interface RunActivityItem {
  pitchName: string;
  blockTitle: string;
  blockType: string;
  activity: Activity;
}

function getRunActivities(story: TrainingStory): RunActivityItem[] {
  return story.pitches.flatMap((pitch) =>
    pitch.activityBlocks.flatMap((block) =>
      block.activities.map((activity) => ({
        pitchName: pitch.name,
        blockTitle: block.title,
        blockType: block.type,
        activity,
      }))
    )
  );
}

export function RunTrainingStoryClient({ id }: RunTrainingStoryClientProps) {
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

  const runActivities = getRunActivities(story);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href={`/sessions/${story.id}`}>
        <Button variant="ghost">
          <ArrowLeft className="h-4 w-4" />
          Back to plan
        </Button>
      </Link>

      <header className="rounded-xl border p-6">
        <p className="text-sm font-medium text-muted-foreground">
          Run Training
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {story.title}
        </h1>

        <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <p>
            <span className="font-medium text-foreground">Age group:</span>{" "}
            {story.ageGroup}
          </p>
          <p>
            <span className="font-medium text-foreground">Duration:</span>{" "}
            {story.durationMinutes} min
          </p>
          <p>
            <span className="font-medium text-foreground">Status:</span>{" "}
            {story.status}
          </p>
        </div>
      </header>

      {runActivities.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold">No activities to run</h2>
          <p className="mt-2 text-muted-foreground">
            Add pitches, blocks and activities before running this training.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {runActivities.map((item, index) => (
            <article
              key={item.activity.id}
              className="rounded-xl border p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Activity {index + 1} · {item.pitchName} · {item.blockTitle}
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    {item.activity.title}
                  </h2>
                </div>

                <div className="rounded-full border px-3 py-1 text-sm font-medium">
                  {item.activity.durationMinutes} min
                </div>
              </div>

              {item.activity.description && (
                <p className="mt-4 text-muted-foreground">
                  {item.activity.description}
                </p>
              )}

              {item.activity.coachingPoints.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold">Coaching points</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {item.activity.coachingPoints.map((point) => (
                      <li key={point.id}>✓ {point.text}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.activity.equipment.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold">Equipment</h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {item.activity.equipment.map((equipment) => (
                      <li key={equipment.id}>
                        {equipment.name}: {equipment.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}