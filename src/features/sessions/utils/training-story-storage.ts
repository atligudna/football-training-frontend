import type { TrainingStory } from "../types/training-story";

const STORAGE_KEY = "football-planner-training-stories";

export function getStoredTrainingStories(): TrainingStory[] {
    if (typeof window === "undefined") {
        return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        return [];
    }

    try {
        return JSON.parse(raw) as TrainingStory[];
    } catch {
        return [];
    }
}

export function saveTrainingStory(story: TrainingStory) {
    const stories = getStoredTrainingStories();

    window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([story, ...stories])
    );
}

export function getAllTrainingStories(
    baseStories: TrainingStory[]
): TrainingStory[] {
    const storedStories = getStoredTrainingStories();

    const storedIds = new Set(
        storedStories.map((story) => story.id)
    );

    const baseStoriesNotInStorage = baseStories.filter(
        (story) => !storedIds.has(story.id)
    );

    return [...storedStories, ...baseStoriesNotInStorage];
}

export function getTrainingStoryById(
    id: string,
    baseStories: TrainingStory[]
): TrainingStory | undefined {
    return getAllTrainingStories(baseStories).find((story) => story.id === id);
}

export function updateTrainingStory(updatedStory: TrainingStory) {
    const stories = getStoredTrainingStories();

    const exists = stories.some((story) => story.id === updatedStory.id);

    const nextStories = exists
        ? stories.map((story) =>
            story.id === updatedStory.id ? updatedStory : story
        )
        : [updatedStory, ...stories];

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStories));
}