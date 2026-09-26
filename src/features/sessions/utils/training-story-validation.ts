import type {
  Pitch,
  TrainingStory,
} from "../types/training-story";

export interface TrainingStoryWarning {
  id: string;
  message: string;
}

function getGroupKey(
  pitch: Pitch
): string | null {
  if (pitch.groupId) {
    return `id:${pitch.groupId}`;
  }

  if (pitch.playerGroup) {
    return `legacy:${pitch.playerGroup
      .trim()
      .toLowerCase()}`;
  }

  return null;
}

export function getTrainingStoryWarnings(
  story: TrainingStory
): TrainingStoryWarning[] {
  const warnings: TrainingStoryWarning[] = [];

  if (story.pitches.length === 0) {
    warnings.push({
      id: "no-pitches",
      message:
        "No pitches have been added to this training story.",
    });

    return warnings;
  }

  for (const pitch of story.pitches) {
    if (
      !pitch.groupId &&
      !pitch.playerGroup
    ) {
      warnings.push({
        id: `missing-group-${pitch.id}`,
        message: `${pitch.name} has no player group assigned.`,
      });
    }

    if (!pitch.coachName?.trim()) {
      warnings.push({
        id: `missing-coach-${pitch.id}`,
        message: `${pitch.name} has no coach assigned.`,
      });
    }

    if (
      pitch.activityBlocks.length === 0
    ) {
      warnings.push({
        id: `missing-block-${pitch.id}`,
        message: `${pitch.name} has no activity blocks.`,
      });
    }
  }

  const pitchesByGroup =
    new Map<string, Pitch[]>();

  for (const pitch of story.pitches) {
    const groupKey =
      getGroupKey(pitch);

    if (!groupKey) continue;

    const current =
      pitchesByGroup.get(groupKey) ?? [];

    current.push(pitch);

    pitchesByGroup.set(
      groupKey,
      current
    );
  }

  for (const pitches of pitchesByGroup.values()) {
    if (pitches.length < 2) continue;

    const groupName =
      pitches[0].playerGroup ??
      "The same group";

    warnings.push({
      id: `duplicate-group-${pitches
        .map((pitch) => pitch.id)
        .join("-")}`,

      message:
        `${groupName} is assigned to multiple pitches: ` +
        pitches
          .map((pitch) => pitch.name)
          .join(", ") +
        ".",
    });
  }

  return warnings;
}

export function isTrainingStoryReady(
  story: TrainingStory
) {
  return (
    getTrainingStoryWarnings(story)
      .length === 0
  );
}