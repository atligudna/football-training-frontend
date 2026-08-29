import type { TrainingStory } from "../types/training-story";

export interface TrainingStorySummary {
  totalDurationMinutes: number;
  pitchCount: number;
  activityBlockCount: number;
  activityCount: number;
  equipmentCount: number;
}

export function getTrainingStorySummary(
  story: TrainingStory
): TrainingStorySummary {
  const activityBlocks = story.pitches.flatMap(
    (pitch) => pitch.activityBlocks
  );

  const activities = activityBlocks.flatMap(
    (block) => block.activities
  );

  const equipmentCount = activities.reduce(
    (total, activity) =>
      total +
      activity.equipment.reduce(
        (equipmentTotal, item) => equipmentTotal + item.quantity,
        0
      ),
    0
  );

  return {
    totalDurationMinutes: story.durationMinutes,
    pitchCount: story.pitches.length,
    activityBlockCount: activityBlocks.length,
    activityCount: activities.length,
    equipmentCount,
  };
}