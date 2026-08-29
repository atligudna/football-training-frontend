"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { trainingStories } from "../data/training-stories";
import {
    deleteTrainingStory,
    getTrainingStoryById,
    updateTrainingStory,
} from "../utils/training-story-storage";
import { EditTrainingStoryForm } from "./EditTrainingStoryForm";
import { TrainingStorySummaryCards } from "./TrainingStorySummaryCards";
import { TrainingStoryHeader } from "./TrainingStoryHeader";
import { ObjectivesCard } from "./ObjectivesCard";
import { PitchSection } from "./PitchSection";
import type {
    Activity,
    ActivityBlock,
    Pitch,
    TrainingStory,
} from "../types/training-story";

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

    function saveStory(updatedStory: TrainingStory) {
        updateTrainingStory(updatedStory);
        setStory(updatedStory);
    }

    function handleSaveTrainingStory(updatedStory: TrainingStory) {
        saveStory(updatedStory);
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

        saveStory(updatedStory);
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

        saveStory(updatedStory);
    }

    function handleDeletePitch(pitchId: string) {
        if (!story) return;

        const updatedStory = {
            ...story,
            pitches: story.pitches.filter((pitch) => pitch.id !== pitchId),
            updatedAt: new Date().toISOString(),
        };

        saveStory(updatedStory);
    }

    function handleAddActivityBlock(
        pitchId: string,
        activityBlock: ActivityBlock
    ) {
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

        saveStory(updatedStory);
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

        saveStory(updatedStory);
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

        saveStory(updatedStory);
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

        saveStory(updatedStory);
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

        saveStory(updatedStory);
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

        saveStory(updatedStory);
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
            {isEditingStory ? (
                <EditTrainingStoryForm
                    story={story}
                    onSaveTrainingStory={handleSaveTrainingStory}
                    onCancel={() => setIsEditingStory(false)}
                />
            ) : (
                <TrainingStoryHeader
                    story={story}
                    onEdit={() => setIsEditingStory(true)}
                    onDelete={handleDeleteTrainingStory}
                />
            )}

            <TrainingStorySummaryCards story={story} />

            <ObjectivesCard story={story} />

            <PitchSection
                story={story}
                onAddPitch={handleAddPitch}
                onSavePitch={handleSavePitch}
                onDeletePitch={handleDeletePitch}
                onAddActivityBlock={handleAddActivityBlock}
                onSaveActivityBlock={handleSaveActivityBlock}
                onDeleteActivityBlock={handleDeleteActivityBlock}
                onAddActivity={handleAddActivity}
                onSaveActivity={handleSaveActivity}
                onDeleteActivity={handleDeleteActivity}
            />
        </div>
    );
}