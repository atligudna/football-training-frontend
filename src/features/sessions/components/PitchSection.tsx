import { AddPitchForm } from "./AddPitchForm";
import { PitchCard } from "./PitchCard";

import type {
  Activity,
  ActivityBlock,
  Pitch,
  TrainingStory,
} from "../types/training-story";

interface PitchSectionProps {
  story: TrainingStory;
  onAddPitch: (pitch: Pitch) => void;
  onSavePitch: (pitch: Pitch) => void;
  onDeletePitch: (pitchId: string) => void;
  onAddActivityBlock: (
    pitchId: string,
    activityBlock: ActivityBlock
  ) => void;
  onSaveActivityBlock: (
    pitchId: string,
    activityBlock: ActivityBlock
  ) => void;
  onDeleteActivityBlock: (
    pitchId: string,
    activityBlockId: string
  ) => void;
  onAddActivity: (
    pitchId: string,
    activityBlockId: string,
    activity: Activity
  ) => void;
  onSaveActivity: (
    pitchId: string,
    activityBlockId: string,
    activity: Activity
  ) => void;
  onDeleteActivity: (
    pitchId: string,
    activityBlockId: string,
    activityId: string
  ) => void;
}

export function PitchSection({
  story,
  onAddPitch,
  onSavePitch,
  onDeletePitch,
  onAddActivityBlock,
  onSaveActivityBlock,
  onDeleteActivityBlock,
  onAddActivity,
  onSaveActivity,
  onDeleteActivity,
}: PitchSectionProps) {
  return (
    <>
      <AddPitchForm
        existingPitches={story.pitches}
        onAddPitch={onAddPitch}
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
                onSavePitch={onSavePitch}
                onAddActivityBlock={(activityBlock) =>
                  onAddActivityBlock(pitch.id, activityBlock)
                }
                onAddActivity={(activityBlockId, activity) =>
                  onAddActivity(pitch.id, activityBlockId, activity)
                }
                onDeleteActivity={(activityBlockId, activityId) =>
                  onDeleteActivity(pitch.id, activityBlockId, activityId)
                }
                onDeleteActivityBlock={(activityBlockId) =>
                  onDeleteActivityBlock(pitch.id, activityBlockId)
                }
                onDeletePitch={() => onDeletePitch(pitch.id)}
                onSaveActivity={(activityBlockId, activity) =>
                  onSaveActivity(pitch.id, activityBlockId, activity)
                }
                onSaveActivityBlock={(activityBlock) =>
                  onSaveActivityBlock(pitch.id, activityBlock)
                }
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}