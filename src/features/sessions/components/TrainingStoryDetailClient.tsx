"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { trainingStories } from "../data/training-stories";
import {
    getTrainingStoryById,
    updateTrainingStory,
} from "../utils/training-story-storage";
import { AddPitchForm } from "./AddPitchForm";

import type {
    Activity,
    ActivityBlock,
    Pitch
} from "../types/training-story";
import { AddActivityBlockForm } from "./AddActivityBlockForm";
import { AddActivityForm } from "./AddActivityForm";

interface TrainingStoryDetailClientProps {
    id: string;
}

export function TrainingStoryDetailClient({
    id,
}: TrainingStoryDetailClientProps) {
    const [story, setStory] = useState(() =>
        getTrainingStoryById(id, trainingStories)
    );

    function handleAddPitch(pitch: Pitch) {
        if (!story) return;
        const updatedStory = {
            ...story,
            pitches: [...story.pitches, pitch],
            updatedAt: new Date().toISOString(),
        };
        updateTrainingStory(updatedStory);
        setStory(updatedStory);
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

            <AddPitchForm
                existingPitches={story.pitches}
                onAddPitch={handleAddPitch}
            />

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

                                            {block.activities.length > 0 && (
                                                <div className="mt-4 space-y-3">
                                                    {block.activities.map((activity) => (
                                                        <div
                                                            key={activity.id}
                                                            className="rounded-md border bg-background p-4"
                                                        >
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div>
                                                                    <p className="font-medium">{activity.title}</p>
                                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                                        {activity.description}
                                                                    </p>
                                                                </div>

                                                                <div className="text-right text-sm">
                                                                    <p className="font-medium">{activity.durationMinutes} min</p>
                                                                    <p className="capitalize text-muted-foreground">
                                                                        {activity.type}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {activity.coachingPoints.length > 0 && (
                                                                <div className="mt-3">
                                                                    <p className="text-sm font-medium">Coaching points</p>
                                                                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                                                                        {activity.coachingPoints.map((point) => (
                                                                            <li key={point.id}>✓ {point.text}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {activity.playerFocus.length > 0 && (
                                                                <div className="mt-3">
                                                                    <p className="text-sm font-medium">Player focus</p>
                                                                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                                                                        {activity.playerFocus.map((focus) => (
                                                                            <li key={focus.id}>• {focus.text}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <AddActivityForm
                                                onAddActivity={(activity) =>
                                                    handleAddActivity(pitch.id, block.id, activity)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>

                                <AddActivityBlockForm
                                    nextOrder={pitch.activityBlocks.length + 1}
                                    onAddActivityBlock={(activityBlock) =>
                                        handleAddActivityBlock(pitch.id, activityBlock)
                                    }
                                />

                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );

    function handleAddActivityBlock(pitchId: string, activityBlock: ActivityBlock) {
        if (!story) return;

        const updatedStory = {
            ...story,
            pitches: story.pitches.map((pitch) =>
                pitch.id === pitchId
                    ? {
                        ...pitch,
                        activityBlocks: [...pitch.activityBlocks, activityBlock],
                    }
                    : pitch
            ),
            updatedAt: new Date().toISOString(),
        };

        updateTrainingStory(updatedStory);
        setStory(updatedStory);
    }
    function handleAddActivity(
        pitchId: string,
        activityBlockId: string,
        activity: Activity
    ) {
        if (!story) return;

        const updatedStory = {
            ...story,
            pitches: story.pitches.map((pitch) =>
                pitch.id === pitchId
                    ? {
                        ...pitch,
                        activityBlocks: pitch.activityBlocks.map((block) =>
                            block.id === activityBlockId
                                ? {
                                    ...block,
                                    activities: [...block.activities, activity],
                                }
                                : block
                        ),
                    }
                    : pitch
            ),
            updatedAt: new Date().toISOString(),
        };

        updateTrainingStory(updatedStory);
        setStory(updatedStory);
    }
}
