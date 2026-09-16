import type {
  Activity,
  ActivityBlock,
  CoachingPoint,
  EquipmentItem,
  Pitch,
  PlayerFocus,
  TrainingStory,
} from "../types/training-story";

function duplicateCoachingPoint(point: CoachingPoint): CoachingPoint {
  return {
    ...point,
    id: crypto.randomUUID(),
  };
}

function duplicatePlayerFocus(focus: PlayerFocus): PlayerFocus {
  return {
    ...focus,
    id: crypto.randomUUID(),
  };
}

function duplicateEquipmentItem(item: EquipmentItem): EquipmentItem {
  return {
    ...item,
    id: crypto.randomUUID(),
  };
}

function duplicateActivity(activity: Activity): Activity {
  return {
    ...activity,
    id: crypto.randomUUID(),
    coachingPoints: activity.coachingPoints.map(duplicateCoachingPoint),
    playerFocus: activity.playerFocus.map(duplicatePlayerFocus),
    equipment: activity.equipment.map(duplicateEquipmentItem),
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
    review: undefined,
    pitches: story.pitches.map(duplicatePitch),
    createdAt: now,
    updatedAt: now,
  };
}