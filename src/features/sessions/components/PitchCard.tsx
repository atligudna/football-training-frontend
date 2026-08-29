import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

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
  onDeleteActivity: (activityBlockId: string, activityId: string) => void;
  onDeleteActivityBlock: (activityBlockId: string) => void;
  onSaveActivity: (activityBlockId: string, activity: Activity) => void;
  onDeletePitch: () => void;
  onSaveActivityBlock: (activityBlock: ActivityBlock) => void;
}

export function PitchCard({
  pitch,
  onAddActivityBlock,
  onAddActivity,
  onDeleteActivity,
  onDeleteActivityBlock,
  onDeletePitch,
  onSaveActivity,
  onSaveActivityBlock,
}: PitchCardProps) {
  return (
    <div className="rounded-xl border p-6">
      <div className="flex items-start justify-between gap-4">
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

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDeletePitch}
          aria-label="Delete pitch"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {pitch.activityBlocks.map((block) => (
          <ActivityBlockCard
            key={block.id}
            block={block}
            onAddActivity={(activity) =>
              onAddActivity(block.id, activity)
            }
            onDeleteActivity={(activityId) =>
              onDeleteActivity(block.id, activityId)
            }
            onDeleteActivityBlock={() =>
              onDeleteActivityBlock(block.id)
            }
            onSaveActivity={(activity) => 
              onSaveActivity(block.id, activity)
            }
            onSaveActivityBlock={onSaveActivityBlock}
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