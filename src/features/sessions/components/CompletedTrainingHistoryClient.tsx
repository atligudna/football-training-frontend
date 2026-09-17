"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authStorage } from "@/features/auth/utils/authStorage";

import { trainingStories } from "../data/training-stories";
import { trainingStoryService } from "../services/training-story.service";
import { getAllTrainingStories } from "../utils/training-story-storage";
import { TrainingStoryList } from "./TrainingStoryList";

import type { TrainingStory } from "../types/training-story";

function getFallbackTrainingStories(): TrainingStory[] {
  return getAllTrainingStories(trainingStories);
}

function getInitialTrainingStories(): TrainingStory[] {
  const token = authStorage.getToken();

  if (token) {
    return [];
  }

  return getFallbackTrainingStories();
}

function getCompletedDate(story: TrainingStory) {
  return story.review?.completedAt ?? story.updatedAt;
}

export function CompletedTrainingHistoryClient() {
  const [stories, setStories] = useState<TrainingStory[]>(
    getInitialTrainingStories
  );

  const [isLoadingBackendStories, setIsLoadingBackendStories] = useState(() =>
    Boolean(authStorage.getToken())
  );
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const token = authStorage.getToken();

    if (!token) return;

    trainingStoryService
      .getTrainingStories(token)
      .then((backendStories) =>
        Promise.all(
          backendStories.map((backendStory) =>
            trainingStoryService
              .getFullTrainingStory(backendStory.id, token)
              .catch(() => backendStory)
          )
        )
      )
      .then((fullBackendStories) => {
        if (!isActive) return;

        setStories(fullBackendStories);
        setBackendError(null);
      })
      .catch(() => {
        if (!isActive) return;

        setStories(getFallbackTrainingStories());
        setBackendError(
          "Could not load completed training history from backend. Showing local fallback stories."
        );
      })
      .finally(() => {
        if (!isActive) return;

        setIsLoadingBackendStories(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const completedStories = useMemo(() => {
    return stories
      .filter((story) => story.status === "completed" || Boolean(story.review))
      .sort(
        (a, b) =>
          new Date(getCompletedDate(b)).getTime() -
          new Date(getCompletedDate(a)).getTime()
      );
  }, [stories]);

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

      <header className="rounded-xl border p-6">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          <p className="text-sm font-medium text-muted-foreground">
            Completed Training History
          </p>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Training History
        </h1>

        <p className="mt-2 text-muted-foreground">
          Review completed sessions, reuse good trainings and learn from older
          sessions.
        </p>
      </header>

      {isLoadingBackendStories && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Loading completed training history from backend...
        </div>
      )}

      {backendError && (
        <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {backendError}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Showing {completedStories.length} completed training stories.
      </p>

      {completedStories.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold">No completed trainings yet</h2>
          <p className="mt-2 text-muted-foreground">
            Complete a training session and save a review to build your history.
          </p>
        </div>
      ) : (
        <TrainingStoryList stories={completedStories} />
      )}
    </div>
  );
}