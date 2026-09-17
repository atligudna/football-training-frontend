"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authStorage } from "@/features/auth/utils/authStorage";

import { trainingStories } from "../data/training-stories";
import { trainingStoryService } from "../services/training-story.service";
import {
  getTrainingStoryById,
  updateTrainingStory,
} from "../utils/training-story-storage";
import {
  getRunProgress,
  saveRunProgress,
} from "../utils/run-progress-storage";

import type { Activity, TrainingStory } from "../types/training-story";
import type { RunNote } from "../utils/run-progress-storage";

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

function getInitialSeconds(story: TrainingStory | undefined) {
  if (!story) return 0;

  const firstActivity = getRunActivities(story)[0];

  return firstActivity ? firstActivity.activity.durationMinutes * 60 : 0;
}

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getTotalRunSeconds(runActivities: RunActivityItem[]) {
  return runActivities.reduce(
    (total, item) => total + item.activity.durationMinutes * 60,
    0
  );
}

function getCompletedRunSecondsBeforeActivity(
  runActivities: RunActivityItem[],
  activityIndex: number
) {
  return runActivities
    .slice(0, activityIndex)
    .reduce((total, item) => total + item.activity.durationMinutes * 60, 0);
}

function getSafeActivityIndex(story: TrainingStory, index: number) {
  const runActivityCount = getRunActivities(story).length;

  if (runActivityCount === 0) return 0;

  return Math.min(index, runActivityCount - 1);
}

export function RunTrainingStoryClient({ id }: RunTrainingStoryClientProps) {
  const router = useRouter();
  const activeStatusSavedForStoryId = useRef<string | null>(null);

  const [story, setStory] = useState<TrainingStory | undefined>(() =>
    getTrainingStoryById(id, trainingStories)
  );

  const [isLoadingBackendStory, setIsLoadingBackendStory] = useState(() =>
    Boolean(authStorage.getToken())
  );
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isSavingBackendStory, setIsSavingBackendStory] = useState(false);

  const [currentActivityIndex, setCurrentActivityIndex] = useState(() => {
    const initialStory = getTrainingStoryById(id, trainingStories);

    if (!initialStory) return 0;

    const progress = getRunProgress(initialStory.id);

    return progress?.currentActivityIndex ?? 0;
  });

  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    const initialStory = getTrainingStoryById(id, trainingStories);

    if (!initialStory) return 0;

    const progress = getRunProgress(initialStory.id);

    return progress?.secondsRemaining ?? getInitialSeconds(initialStory);
  });

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [runNoteText, setRunNoteText] = useState("");
  const [runNotes, setRunNotes] = useState<RunNote[]>(() => {
    const initialStory = getTrainingStoryById(id, trainingStories);

    if (!initialStory) return [];

    return getRunProgress(initialStory.id)?.notes ?? [];
  });

  const runActivities = useMemo(() => {
    if (!story) return [];
    return getRunActivities(story);
  }, [story]);

  useEffect(() => {
    let isActive = true;

    const token = authStorage.getToken();

    if (!token) return;

    trainingStoryService
      .getFullTrainingStory(id, token)
      .then((backendStory) => {
        if (!isActive) return;

        const progress = getRunProgress(backendStory.id);
        const safeActivityIndex = getSafeActivityIndex(
          backendStory,
          progress?.currentActivityIndex ?? 0
        );

        setStory(backendStory);
        setCurrentActivityIndex(safeActivityIndex);
        setSecondsRemaining(
          progress?.secondsRemaining ?? getInitialSeconds(backendStory)
        );
        setRunNotes(progress?.notes ?? []);
        setBackendError(null);
      })
      .catch(() => {
        if (!isActive) return;

        setBackendError(
          "Could not load this training story from backend. Showing local fallback version if available."
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

  useEffect(() => {
    if (!story) return;

    if (activeStatusSavedForStoryId.current === story.id) return;

    if (
      story.status === "active" ||
      story.status === "completed" ||
      story.status === "archived"
    ) {
      return;
    }

    activeStatusSavedForStoryId.current = story.id;

    const activeStory: TrainingStory = {
      ...story,
      status: "active",
      updatedAt: new Date().toISOString(),
    };

    updateTrainingStory(activeStory);

    const token = authStorage.getToken();

    if (!token) return;

    trainingStoryService
      .updateFullTrainingStory(activeStory.id, activeStory, token)
      .then((savedStory) => {
        setStory(savedStory);
        updateTrainingStory(savedStory);
      })
      .catch(() => {
        setBackendError(
          "Could not mark this training story as active in backend."
        );
      });
  }, [story]);

  const currentActivity = runActivities[currentActivityIndex];

  useEffect(() => {
    if (!isTimerRunning || secondsRemaining <= 0) return;

    const timeoutId = window.setTimeout(() => {
      const nextSeconds = Math.max(secondsRemaining - 1, 0);

      setSecondsRemaining(nextSeconds);

      if (story) {
        saveRunProgress(story.id, {
          currentActivityIndex,
          secondsRemaining: nextSeconds,
        });
      }

      if (nextSeconds === 0) {
        setIsTimerRunning(false);
      }
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [isTimerRunning, secondsRemaining, story, currentActivityIndex]);

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

  const activeStory = story;

  const isFirstActivity = currentActivityIndex === 0;
  const isLastActivity = currentActivityIndex === runActivities.length - 1;

  const progressPercent =
    runActivities.length > 0
      ? ((currentActivityIndex + 1) / runActivities.length) * 100
      : 0;

  const totalActivitySeconds = currentActivity
    ? currentActivity.activity.durationMinutes * 60
    : 0;

  const timerProgressPercent =
    totalActivitySeconds > 0
      ? ((totalActivitySeconds - secondsRemaining) / totalActivitySeconds) *
        100
      : 0;

  const totalRunSeconds = getTotalRunSeconds(runActivities);

  const completedRunSecondsBeforeCurrent =
    getCompletedRunSecondsBeforeActivity(runActivities, currentActivityIndex);

  const elapsedCurrentActivitySeconds = currentActivity
    ? Math.max(totalActivitySeconds - secondsRemaining, 0)
    : 0;

  const elapsedRunSeconds = Math.min(
    completedRunSecondsBeforeCurrent + elapsedCurrentActivitySeconds,
    totalRunSeconds
  );

  const remainingRunSeconds = Math.max(totalRunSeconds - elapsedRunSeconds, 0);

  const overallRunProgressPercent =
    totalRunSeconds > 0 ? (elapsedRunSeconds / totalRunSeconds) * 100 : 0;

  const reviewStatus = activeStory.review
    ? `Reviewed · ${activeStory.review.overallRating}/5`
    : activeStory.status === "completed"
      ? "Completed · No review yet"
      : "Not reviewed yet";

  function getSecondsForActivity(index: number) {
    const activity = runActivities[index];

    return activity ? activity.activity.durationMinutes * 60 : 0;
  }

  function resetTimerForActivity(index: number) {
    const nextSeconds = getSecondsForActivity(index);

    setSecondsRemaining(nextSeconds);
    setIsTimerRunning(false);

    saveRunProgress(activeStory.id, {
      currentActivityIndex: index,
      secondsRemaining: nextSeconds,
    });
  }

  function handleAddRunNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentActivity) return;

    const trimmedText = runNoteText.trim();

    if (!trimmedText) return;

    const note: RunNote = {
      id: crypto.randomUUID(),
      activityId: currentActivity.activity.id,
      activityTitle: currentActivity.activity.title,
      text: trimmedText,
      createdAt: new Date().toISOString(),
    };

    const nextNotes = [note, ...runNotes];

    setRunNotes(nextNotes);
    setRunNoteText("");

    saveRunProgress(activeStory.id, {
      currentActivityIndex,
      secondsRemaining,
      notes: nextNotes,
    });
  }

  function handleDeleteRunNote(noteId: string) {
    const nextNotes = runNotes.filter((note) => note.id !== noteId);

    setRunNotes(nextNotes);

    saveRunProgress(activeStory.id, {
      currentActivityIndex,
      secondsRemaining,
      notes: nextNotes,
    });
  }

  function handlePreviousActivity() {
    const nextIndex = Math.max(currentActivityIndex - 1, 0);

    setCurrentActivityIndex(nextIndex);
    resetTimerForActivity(nextIndex);
  }

  function handleNextActivity() {
    const nextIndex = Math.min(
      currentActivityIndex + 1,
      runActivities.length - 1
    );

    setCurrentActivityIndex(nextIndex);
    resetTimerForActivity(nextIndex);
  }

  function handleResetTimer() {
    if (!currentActivity) return;

    const nextSeconds = currentActivity.activity.durationMinutes * 60;

    setSecondsRemaining(nextSeconds);
    setIsTimerRunning(false);

    saveRunProgress(activeStory.id, {
      currentActivityIndex,
      secondsRemaining: nextSeconds,
    });
  }

  function handleRestartTraining() {
    const nextSeconds = getSecondsForActivity(0);

    setCurrentActivityIndex(0);
    setSecondsRemaining(nextSeconds);
    setIsTimerRunning(false);
    setRunNotes([]);
    setRunNoteText("");

    saveRunProgress(activeStory.id, {
      currentActivityIndex: 0,
      secondsRemaining: nextSeconds,
      notes: [],
    });
  }

  async function handleFinishTraining() {
    const completedStory: TrainingStory = {
      ...activeStory,
      status: "completed",
      updatedAt: new Date().toISOString(),
    };

    saveRunProgress(activeStory.id, {
      currentActivityIndex,
      secondsRemaining,
      notes: runNotes,
    });

    updateTrainingStory(completedStory);

    const token = authStorage.getToken();

    if (!token) {
      router.push(`/sessions/${activeStory.id}/review`);
      return;
    }

    setIsSavingBackendStory(true);
    setBackendError(null);

    try {
      const savedStory = await trainingStoryService.updateFullTrainingStory(
        activeStory.id,
        completedStory,
        token
      );

      updateTrainingStory(savedStory);
    } catch {
      setBackendError(
        "Could not mark this training story as completed in backend. You can still add the review locally."
      );
    } finally {
      setIsSavingBackendStory(false);
      router.push(`/sessions/${activeStory.id}/review`);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-28 sm:pb-6">
      <Link href={`/sessions/${activeStory.id}`}>
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

      {isSavingBackendStory && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Saving training status to backend...
        </div>
      )}

      <section className="rounded-xl border p-4 sm:p-6">
        <h2 className="text-xl font-semibold">Run notes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add quick notes during the session. They will appear on the review
          page.
        </p>

        <form onSubmit={handleAddRunNote} className="mt-4 space-y-3">
          <textarea
            value={runNoteText}
            onChange={(event) => setRunNoteText(event.target.value)}
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Example: Too many players waiting. Make groups smaller next time."
          />

          <div className="flex justify-end">
            <Button type="submit" variant="secondary">
              Add note
            </Button>
          </div>
        </form>

        {runNotes.length > 0 && (
          <div className="mt-5 space-y-3 border-t pt-4">
            {runNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-start justify-between gap-3 rounded-lg bg-muted p-3"
              >
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {note.activityTitle}
                  </p>
                  <p className="mt-1 text-sm">{note.text}</p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleDeleteRunNote(note.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <header className="rounded-xl border p-4 sm:p-6">
        <p className="text-sm font-medium text-muted-foreground">
          Run Training
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {activeStory.title}
        </h1>

        <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <p>
            <span className="font-medium text-foreground">Age group:</span>{" "}
            {activeStory.ageGroup}
          </p>
          <p>
            <span className="font-medium text-foreground">Duration:</span>{" "}
            {activeStory.durationMinutes} min
          </p>
          <p>
            <span className="font-medium text-foreground">Activities:</span>{" "}
            {runActivities.length}
          </p>
        </div>

        <div className="mt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={handleRestartTraining}
          >
            <RotateCcw className="h-4 w-4" />
            Restart training
          </Button>
        </div>
      </header>

      {runActivities.length === 0 || !currentActivity ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold">No activities to run</h2>
          <p className="mt-2 text-muted-foreground">
            Add pitches, blocks and activities before running this training.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-xl border p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Run summary
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Overall progress
                </h2>
              </div>

              <p className="rounded-full border px-3 py-1 text-sm font-medium">
                {Math.round(overallRunProgressPercent)}%
              </p>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-foreground"
                style={{ width: `${overallRunProgressPercent}%` }}
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Total time
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {formatSeconds(totalRunSeconds)}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Activities done
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {currentActivityIndex} / {runActivities.length}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Elapsed
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {formatSeconds(elapsedRunSeconds)}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Remaining
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {formatSeconds(remainingRunSeconds)}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Review status: {reviewStatus}
            </p>
          </section>

          <section className="rounded-xl border p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-muted-foreground">
                Activity {currentActivityIndex + 1} of {runActivities.length}
              </p>

              <p className="rounded-full border px-3 py-1 text-sm font-medium">
                {currentActivity.activity.durationMinutes} min
              </p>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-foreground"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </section>

          <section className="rounded-xl border p-5 text-center sm:p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Activity timer
            </p>

            <p className="mt-2 text-7xl font-bold tracking-tight sm:text-6xl">
              {formatSeconds(secondsRemaining)}
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-foreground"
                style={{ width: `${timerProgressPercent}%` }}
              />
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                onClick={() => setIsTimerRunning(true)}
                disabled={isTimerRunning || secondsRemaining === 0}
              >
                <Play className="h-4 w-4" />
                Start
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsTimerRunning(false)}
                disabled={!isTimerRunning}
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>

              <Button type="button" variant="ghost" onClick={handleResetTimer}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </section>

          <article className="rounded-xl border p-4 sm:p-6">
            <p className="text-sm font-medium text-muted-foreground">
              {currentActivity.pitchName} · {currentActivity.blockTitle} ·{" "}
              {currentActivity.blockType}
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {currentActivity.activity.title}
            </h2>

            {currentActivity.activity.description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {currentActivity.activity.description}
              </p>
            )}

            {currentActivity.activity.coachingPoints.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-semibold">Coaching points</h3>
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  {currentActivity.activity.coachingPoints.map((point) => (
                    <li key={point.id}>✓ {point.text}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentActivity.activity.playerFocus.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-semibold">Player focus</h3>
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  {currentActivity.activity.playerFocus.map((focus) => (
                    <li key={focus.id}>• {focus.text}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentActivity.activity.equipment.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-semibold">Equipment</h3>
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  {currentActivity.activity.equipment.map((equipment) => (
                    <li key={equipment.id}>
                      {equipment.name}: {equipment.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentActivity.activity.notes && (
              <div className="mt-6 rounded-lg bg-muted p-4">
                <h3 className="text-base font-semibold">Notes</h3>
                <p className="mt-2 text-muted-foreground">
                  {currentActivity.activity.notes}
                </p>
              </div>
            )}
          </article>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-4 backdrop-blur sm:sticky sm:inset-auto sm:rounded-xl sm:border">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handlePreviousActivity}
                disabled={isFirstActivity || isSavingBackendStory}
                className="flex-1 sm:flex-none"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {isLastActivity ? (
                <Button
                  type="button"
                  onClick={handleFinishTraining}
                  disabled={isSavingBackendStory}
                  className="flex-1 sm:flex-none"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isSavingBackendStory ? "Saving..." : "Finish"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNextActivity}
                  disabled={isSavingBackendStory}
                  className="flex-1 sm:flex-none"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}