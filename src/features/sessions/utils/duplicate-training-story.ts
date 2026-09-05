import type {
  Activity,
  ActivityBlock,
  Pitch,
  TrainingStory,
} from "../types/training-story";

function duplicateActivity(activity: Activity): Activity {
  return {
    ...activity,
    id: crypto.randomUUID(),
    coachingPoints: activity.coachingPoints.map((point) => ({
      ...point,
      id: crypto.randomUUID(),
    })),
    playerFocus: activity.playerFocus.map((focus) => ({
      ...focus,
      id: crypto.randomUUID(),
    })),
    equipment: activity.equipment.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
    })),
  };
}

function duplicateActivityBlock(block: ActivityBlock): ActivityBlock {
  return {
    ...block,
    id: crypto.randomUUID(),
    activities: block.activities.map(duplicateActivity),
  };
}

function duplicatePitch(pitch: Pitch): Pitch {
  return {
    ...pitch,
    id: crypto.randomUUID(),
    activityBlocks: pitch.activityBlocks.map(duplicateActivityBlock),
  };
}

export function duplicateTrainingStory(story: TrainingStory): TrainingStory {
  const now = new Date().toISOString();

  return {
    ...story,
    id: crypto.randomUUID(),
    title: `${story.title} (Copy)`,
    status: "draft",
    pitches: story.pitches.map(duplicatePitch),
    createdAt: now,
    updatedAt: now,
  };
}