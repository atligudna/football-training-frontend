import type {
  Activity,
  ActivityBlock,
  Pitch,
  TrainingStory,
} from "../types/training-story";

function cloneActivity(activity: Activity): Activity {
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

function cloneActivityBlock(block: ActivityBlock): ActivityBlock {
  return {
    ...block,
    id: crypto.randomUUID(),
    activities: block.activities.map(cloneActivity),
  };
}

function clonePitch(pitch: Pitch): Pitch {
  return {
    ...pitch,
    id: crypto.randomUUID(),
    activityBlocks: pitch.activityBlocks.map(cloneActivityBlock),
  };
}

export function createTrainingStoryFromTemplate(
  template: TrainingStory
): TrainingStory {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: template.title,
    description: template.description,
    ageGroup: template.ageGroup,
    durationMinutes: template.durationMinutes,
    theme: template.theme,
    objectives: [...template.objectives],
    status: "draft",
    pitches: template.pitches.map(clonePitch),
    createdAt: now,
    updatedAt: now,
  };
}