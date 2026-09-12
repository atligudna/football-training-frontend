"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TrainingReviewCard } from "./TrainingReviewCard";
import { Button } from "@/components/ui/button";
import { duplicateTrainingStory } from "../utils/duplicate-training-story";
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
import { authStorage } from "@/features/auth/utils/authStorage";
import { trainingStoryService } from "../services/training-story.service";
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

    const [story, setStory] = useState<TrainingStory | undefined>(() =>
        getTrainingStoryById(id, trainingStories)
    );

    const [isLoadingBackendStory, setIsLoadingBackendStory] = useState(() =>
        Boolean(authStorage.getToken())
    );

    const [backendError, setBackendError] = useState<string | null>(null);
    const [backendSaveError, setBackendSaveError] = useState<string | null>(null);
    const [isSavingBackendStory, setIsSavingBackendStory] = useState(false);
    const [isEditingStory, setIsEditingStory] = useState(false);
    const [undoSnapshot, setUndoSnapshot] = useState<TrainingStory | null>(null);
    const [undoMessage, setUndoMessage] = useState("");
    const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let isActive = true;

        const token = authStorage.getToken();

        if (!token) {
            return;
        }

        trainingStoryService
            .getFullTrainingStory(id, token)
            .then((backendStory) => {
                if (!isActive) return;

                setStory(backendStory);
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

    function saveStory(updatedStory: TrainingStory) {
        setStory(updatedStory);
        updateTrainingStory(updatedStory);

        const token = authStorage.getToken();

        if (!token) return;

        setIsSavingBackendStory(true);
        setBackendSaveError(null);

        trainingStoryService
            .updateFullTrainingStory(updatedStory.id, updatedStory, token)
            .then((savedStory) => {
                setStory(savedStory);
                updateTrainingStory(savedStory);
            })
            .catch(() => {
                setBackendSaveError(
                    "Could not save this training story to backend. Local changes are still saved on this device."
                );
            })
            .finally(() => {
                setIsSavingBackendStory(false);
            });
    }

    function confirmDelete(message: string) {
        return window.confirm(message);
    }

    function saveStoryWithUndo(
        updatedStory: TrainingStory,
        previousStory: TrainingStory,
        message: string
    ) {
        saveStory(updatedStory);
        setUndoSnapshot(previousStory);
        setUndoMessage(message);

        if (undoTimerRef.current) {
            clearTimeout(undoTimerRef.current);
        }

        undoTimerRef.current = setTimeout(() => {
            setUndoSnapshot(null);
            setUndoMessage("");
            undoTimerRef.current = null;
        }, 3000);
    }

    function handleUndoDelete() {
        if (!undoSnapshot) return;

        saveStory(undoSnapshot);
        setUndoSnapshot(null);
        setUndoMessage("");

        if (undoTimerRef.current) {
            clearTimeout(undoTimerRef.current);
            undoTimerRef.current = null;
        }
    }

    function handleSaveTrainingStory(updatedStory: TrainingStory) {
        saveStory(updatedStory);
        setIsEditingStory(false);
    }

    function handleDuplicateTrainingStory() {
        if (!story) return;

        const duplicatedStory = duplicateTrainingStory(story);

        saveStory(duplicatedStory);
        setIsEditingStory(false);

        router.push(`/sessions/${duplicatedStory.id}`);
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
        const confirmed = confirmDelete(
            "Are you sure you want to delete this pitch? All blocks and activities inside it will also be deleted."
        );

        if (!confirmed) return;

        const previousStory = story;
        const updatedStory = {
            ...story,
            pitches: story.pitches.filter((pitch) => pitch.id !== pitchId),
            updatedAt: new Date().toISOString(),
        };

        saveStoryWithUndo(
            updatedStory,
            previousStory,
            "Pitch deleted"
        );
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
        const confirmed = confirmDelete(
            "Are you sure you want to delete this activity block? All activities inside it will also be deleted."
        );

        if (!confirmed) return;

        const previousStory = story;
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

        saveStoryWithUndo(
            updatedStory,
            previousStory,
            "Activity block deleted"
        );
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
        const confirmed = confirmDelete(
            "Are you sure you want to delete this activity?"
        );

        if (!confirmed) return;

        const previousStory = story;
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

        saveStoryWithUndo(
            updatedStory,
            previousStory,
            "Activity deleted"
        );
    }

    if (!story && isLoadingBackendStory) {
        return (
            <div className="rounded-xl border p-6">
                <h1 className="text-2xl font-bold">Loading training story...</h1>
                <p className="mt-2 text-muted-foreground">
                    Fetching full training story from backend.
                </p>
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
        <div className="space-y-8">
            {backendError && (
                <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
                    {backendError}
                </div>
            )}

            {isSavingBackendStory && (
                <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                    Saving training story to backend...
                </div>
            )}

            {backendSaveError && (
                <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
                    {backendSaveError}
                </div>
            )}

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
                    onDuplicate={handleDuplicateTrainingStory}
                    onDelete={handleDeleteTrainingStory}
                />
            )}

            <TrainingStorySummaryCards story={story} />
            {undoSnapshot && (
                <div className="fixed bottom-6 right-6 z-50 flex min-w-80 items-center justify-between gap-4 rounded-lg border bg-background px-4 py-3 shadow-lg">
                    <p className="text-sm font-medium">{undoMessage}</p>

                    <Button type="button" variant="secondary" onClick={handleUndoDelete}>
                        Undo
                    </Button>
                </div>
            )}
            <TrainingReviewCard story={story} />
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