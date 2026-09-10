"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Pause,
    Play,
    RotateCcw,
} from "lucide-react";

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

function formatSeconds(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function RunTrainingStoryClient({ id }: RunTrainingStoryClientProps) {
    const [story] = useState(() => getTrainingStoryById(id, trainingStories));
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [secondsRemaining, setSecondsRemaining] = useState(() => {
        if (!story) return 0;

        const firstActivity = getRunActivities(story)[0];

        return firstActivity ? firstActivity.activity.durationMinutes * 60 : 0;
    });
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const runActivities = useMemo(() => {
        if (!story) return [];
        return getRunActivities(story);
    }, [story]);

    const currentActivity = runActivities[currentActivityIndex];

    useEffect(() => {
        if (!isTimerRunning || secondsRemaining <= 0) return;

        const timeoutId = window.setTimeout(() => {
            const nextSeconds = Math.max(secondsRemaining - 1, 0);

            setSecondsRemaining(nextSeconds);

            if (nextSeconds === 0) {
                setIsTimerRunning(false);
            }
        }, 1000);

        return () => window.clearTimeout(timeoutId);
    }, [isTimerRunning, secondsRemaining]);

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
            ? ((totalActivitySeconds - secondsRemaining) / totalActivitySeconds) * 100
            : 0;


    function resetTimerForActivity(index: number) {
        const activity = runActivities[index];

        setSecondsRemaining(
            activity ? activity.activity.durationMinutes * 60 : 0
        );
        setIsTimerRunning(false);
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

        setSecondsRemaining(currentActivity.activity.durationMinutes * 60);
        setIsTimerRunning(false);
    }

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
                        <span className="font-medium text-foreground">Activities:</span>{" "}
                        {runActivities.length}
                    </p>
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

                    <section className="rounded-xl border p-6 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            Activity timer
                        </p>

                        <p className="mt-2 text-6xl font-bold tracking-tight">
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

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleResetTimer}
                            >
                                <RotateCcw className="h-4 w-4" />
                                Reset
                            </Button>
                        </div>
                    </section>

                    <article className="rounded-xl border p-6">
                        <p className="text-sm font-medium text-muted-foreground">
                            {currentActivity.pitchName} · {currentActivity.blockTitle} ·{" "}
                            {currentActivity.blockType}
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight">
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

                    <div className="flex items-center justify-between gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handlePreviousActivity}
                            disabled={isFirstActivity}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <Button
                            type="button"
                            onClick={handleNextActivity}
                            disabled={isLastActivity}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}