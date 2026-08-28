import { AddActivityBlockForm } from "./AddActivityBlockForm";
import { ActivityBlockCard } from "./ActivityBlockCard";

import type {
  Activity,
  ActivityBlock,
  Pitch,
} from "../types/training-story";

interface PitchCardProps {
  pitch: Pitch;
  onAddActivityBlock: (activityBlock: ActivityBlock) => void;
  onAddActivity: (activityBlockId: string, activity: Activity) => void;
}

export function PitchCard({
  pitch,
  onAddActivityBlock,
  onAddActivity,
}: PitchCardProps) {
  return (
    <div className="rounded-xl border p-6">
      <div>
        <h3 className="text-lg font-semibold">{pitch.name}</h3>

        <p className="text-sm text-muted-foreground">
          {pitch.coachName ?? "No coach assigned"}
        </p>

        {pitch.playerGroup && (
          <p className="text-sm text-muted-foreground">
            {pitch.playerGroup}
          </p>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {pitch.activityBlocks.map((block) => (
          <ActivityBlockCard
            key={block.id}
            block={block}
            onAddActivity={(activity) =>
              onAddActivity(block.id, activity)
            }
          />
        ))}
      </div>

      <AddActivityBlockForm
        nextOrder={pitch.activityBlocks.length + 1}
        onAddActivityBlock={onAddActivityBlock}
      />
    </div>
  );
}