"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { trainingStories } from "../data/training-stories";
import {
    getTrainingStoryById,
    updateTrainingStory,
    deleteTrainingStory
} from "../utils/training-story-storage";
import { AddPitchForm } from "./AddPitchForm";
import { PitchCard } from "./PitchCard";
import type {
    Activity,
    ActivityBlock,
    Pitch,
    TrainingStory
} from "../types/training-story";
import { TrainingStorySummaryCards } from "./TrainingStorySummaryCards";
import { EditTrainingStoryForm } from "./EditTrainingStoryForm";

interface TrainingStoryDetailClientProps {
    id: string;
}

export function TrainingStoryDetailClient({
    id,
}: TrainingStoryDetailClientProps) {
    const router = useRouter();
    const [story, setStory] = useState(() =>
        getTrainingStoryById(id, trainingStories)
    );
    const [isEditingStory, setIsEditingStory] = useState(false);


    function handleSaveTrainingStory(updatedStory: TrainingStory) {
        updateTrainingStory(updatedStory);
        setStory(updatedStory);
        setIsEditingStory(false);
    }
    function handleDeleteTrainingStory() {
        if (!story) return;

        const confirmed = window.confirm(
            `Delete "${story.title}"? This cannot be undone.`
        );

        if (!confirmed) return;

        deleteTrainingStory(story.id);
        router.push("/sessions");
    }
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

            {isEditingStory ? (
                <EditTrainingStoryForm
                    story={story}
                    onSaveTrainingStory={handleSaveTrainingStory}
                    onCancel={() => setIsEditingStory(false)}
                />
            ) : (
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
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsEditingStory(true)}
                        >
                            <Pencil className="h-4 w-4" />
                            Edit Story
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleDeleteTrainingStory}
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>
            )}

            <TrainingStorySummaryCards story={story} />

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
                            <PitchCard
                                key={pitch.id}
                                pitch={pitch}
                                existingPitches={story.pitches}
                                onSavePitch={handleSavePitch}
                                onAddActivityBlock={(activityBlock) =>
                                    handleAddActivityBlock(pitch.id, activityBlock)
                                }
                                onAddActivity={(activityBlockId, activity) =>
                                    handleAddActivity(pitch.id, activityBlockId, activity)
                                }
                                onDeleteActivity={(activityBlockId, activityId) =>
                                    handleDeleteActivity(pitch.id, activityBlockId, activityId)
                                }
                                onDeleteActivityBlock={(activityBlockId) =>
                                    handleDeleteActivityBlock(pitch.id, activityBlockId)
                                }
                                onDeletePitch={() => handleDeletePitch(pitch.id)}
                                onSaveActivity={(activityBlockId, activity) =>
                                    handleSaveActivity(pitch.id, activityBlockId, activity)
                                }
                                onSaveActivityBlock={(activityBlock) =>
                                    handleSaveActivityBlock(pitch.id, activityBlock)
                                }
                            />
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

    function handleDeleteActivity(
        pitchId: string,
        activityBlockId: string,
        activityId: string
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
                                    activities: block.activities.filter(
                                        (activity) => activity.id !== activityId
                                    ),
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
    function handleSaveActivity(
        pitchId: string,
        activityBlockId: string,
        updatedActivity: Activity
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
                                    activities: block.activities.map((activity) =>
                                        activity.id === updatedActivity.id
                                            ? updatedActivity
                                            : activity
                                    ),
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
    function handleSaveActivityBlock(
        pitchId: string,
        updatedActivityBlock: ActivityBlock
    ) {
        if (!story) return;

        const updatedStory = {
            ...story,
            pitches: story.pitches.map((pitch) =>
                pitch.id === pitchId
                    ? {
                        ...pitch,
                        activityBlocks: pitch.activityBlocks.map((block) =>
                            block.id === updatedActivityBlock.id
                                ? updatedActivityBlock
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
    function handleSavePitch(updatedPitch: Pitch) {
        if (!story) return;

        const updatedStory = {
            ...story,
            pitches: story.pitches.map((pitch) =>
                pitch.id === updatedPitch.id ? updatedPitch : pitch
            ),
            updatedAt: new Date().toISOString(),
        };

        updateTrainingStory(updatedStory);
        setStory(updatedStory);
    }
    function handleDeleteActivityBlock(
        pitchId: string,
        activityBlockId: string
    ) {
        if (!story) return;

        const updatedStory = {
            ...story,
            pitches: story.pitches.map((pitch) =>
                pitch.id === pitchId
                    ? {
                        ...pitch,
                        activityBlocks: pitch.activityBlocks.filter(
                            (block) => block.id !== activityBlockId
                        ),
                    }
                    : pitch
            ),
            updatedAt: new Date().toISOString(),
        };

        updateTrainingStory(updatedStory);
        setStory(updatedStory);
    }
    function handleDeletePitch(pitchId: string) {
        if (!story) return;

        const updatedStory = {
            ...story,
            pitches: story.pitches.filter((pitch) => pitch.id !== pitchId),
            updatedAt: new Date().toISOString(),
        };

        updateTrainingStory(updatedStory);
        setStory(updatedStory);
    }

}
