"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authStorage } from "@/features/auth/utils/authStorage";

import { trainingStories } from "../data/training-stories";
import { trainingStoryService } from "../services/training-story.service";
import {
  getTrainingStoryById,
  updateTrainingStory,
} from "../utils/training-story-storage";
import {
  clearRunProgress,
  getRunProgress,
} from "../utils/run-progress-storage";

import type { TrainingStory } from "../types/training-story";

interface TrainingStoryReviewClientProps {
  id: string;
}

function getRunNotesText(storyId: string) {
  const progress = getRunProgress(storyId);

  if (!progress || progress.notes.length === 0) return "";

  return progress.notes
    .map((note) => `• ${note.activityTitle}: ${note.text}`)
    .join("\n");
}

function getInitialNotes(story: TrainingStory | undefined) {
  if (!story) return "";

  if (story.review?.notes?.trim()) {
    return story.review.notes;
  }

  return getRunNotesText(story.id);
}

export function TrainingStoryReviewClient({
  id,
}: TrainingStoryReviewClientProps) {
  const router = useRouter();

  const [story, setStory] = useState<TrainingStory | undefined>(() =>
    getTrainingStoryById(id, trainingStories)
  );

  const [isLoadingBackendStory, setIsLoadingBackendStory] = useState(() =>
    Boolean(authStorage.getToken())
  );
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isSavingBackendReview, setIsSavingBackendReview] = useState(false);

  const [overallRating, setOverallRating] = useState(
    story?.review?.overallRating ?? 3
  );
  const [wentWell, setWentWell] = useState(story?.review?.wentWell ?? "");
  const [improveNextTime, setImproveNextTime] = useState(
    story?.review?.improveNextTime ?? ""
  );
  const [notes, setNotes] = useState(() => getInitialNotes(story));

  useEffect(() => {
    let isActive = true;

    const token = authStorage.getToken();

    if (!token) return;

    trainingStoryService
      .getFullTrainingStory(id, token)
      .then((backendStory) => {
        if (!isActive) return;

        setStory(backendStory);
        setOverallRating(backendStory.review?.overallRating ?? 3);
        setWentWell(backendStory.review?.wentWell ?? "");
        setImproveNextTime(backendStory.review?.improveNextTime ?? "");
        setNotes(getInitialNotes(backendStory));
        setBackendError(null);
      })
      .catch(() => {
        if (!isActive) return;

        setBackendError(
          "Could not load this training story from backend. Showing local version if available."
        );
      })
      .finally(() => {
        if (!isActive) return;

        setIsLoadingBackendStory(false);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!story) return;

    const token = authStorage.getToken();
    const now = new Date().toISOString();

    const updatedStory: TrainingStory = {
      ...story,
      status: "completed",
      review: {
        completedAt: story.review?.completedAt ?? now,
        overallRating,
        wentWell: wentWell.trim(),
        improveNextTime: improveNextTime.trim(),
        notes: notes.trim(),
      },
      updatedAt: now,
    };

    updateTrainingStory(updatedStory);

    if (!token) {
      clearRunProgress(story.id);
      router.push(`/sessions/${story.id}`);
      return;
    }

    setIsSavingBackendReview(true);
    setBackendError(null);

    try {
      const savedStory = await trainingStoryService.updateFullTrainingStory(
        story.id,
        updatedStory,
        token
      );

      updateTrainingStory(savedStory);
      clearRunProgress(story.id);
      router.push(`/sessions/${story.id}`);
    } catch {
      setBackendError(
        "Could not save review to backend. Local review is still saved on this device."
      );
    } finally {
      setIsSavingBackendReview(false);
    }
  }

  if (!story && isLoadingBackendStory) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border p-6">
          <h1 className="text-2xl font-bold">Loading training story...</h1>
          <p className="mt-2 text-muted-foreground">
            Fetching full training story from backend.
          </p>
        </div>
      </div>
    );
  }

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
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href={`/sessions/${story.id}`}>
        <Button variant="ghost">
          <ArrowLeft className="h-4 w-4" />
          Back to plan
        </Button>
      </Link>

      {isLoadingBackendStory && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Loading training story from backend...
        </div>
      )}

      {backendError && (
        <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {backendError}
        </div>
      )}

      {isSavingBackendReview && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Saving review to backend...
        </div>
      )}

      <header className="rounded-xl border p-6">
        <p className="text-sm font-medium text-muted-foreground">
          Training Review
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {story.title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Review the session while it is still fresh.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border p-6">
        <div className="space-y-2">
          <label htmlFor="overall-rating" className="text-sm font-medium">
            Overall rating
          </label>

          <select
            id="overall-rating"
            value={overallRating}
            onChange={(event) => setOverallRating(Number(event.target.value))}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            disabled={isSavingBackendReview}
          >
            <option value={1}>1 — Poor</option>
            <option value={2}>2 — Below average</option>
            <option value={3}>3 — OK</option>
            <option value={4}>4 — Good</option>
            <option value={5}>5 — Excellent</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="went-well" className="text-sm font-medium">
            What went well?
          </label>

          <textarea
            id="went-well"
            value={wentWell}
            onChange={(event) => setWentWell(event.target.value)}
            rows={4}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Players were focused, transitions were quick..."
            disabled={isSavingBackendReview}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="improve-next-time" className="text-sm font-medium">
            What should improve next time?
          </label>

          <textarea
            id="improve-next-time"
            value={improveNextTime}
            onChange={(event) => setImproveNextTime(event.target.value)}
            rows={4}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Need clearer setup, smaller groups, more balls..."
            disabled={isSavingBackendReview}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="review-notes" className="text-sm font-medium">
            Notes
          </label>

          <textarea
            id="review-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Anything else to remember..."
            disabled={isSavingBackendReview}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSavingBackendReview}>
            <Save className="h-4 w-4" />
            {isSavingBackendReview ? "Saving..." : "Save review"}
          </Button>
        </div>
      </form>
    </div>
  );
}