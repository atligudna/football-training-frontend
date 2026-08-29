"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

import type {
  ActivityBlock,
  ActivityBlockType,
} from "../types/training-story";

const activityBlockTypes: ActivityBlockType[] = [
  "warmup",
  "technical",
  "tactical",
  "physical",
  "goalkeeping",
  "station",
  "game",
  "cooldown",
];

interface EditActivityBlockFormProps {
  block: ActivityBlock;
  onSaveActivityBlock: (activityBlock: ActivityBlock) => void;
  onCancel: () => void;
}

export function EditActivityBlockForm({
  block,
  onSaveActivityBlock,
  onCancel,
}: EditActivityBlockFormProps) {
  const [title, setTitle] = useState(block.title);
  const [type, setType] = useState<ActivityBlockType>(block.type);
  const [durationMinutes, setDurationMinutes] = useState(
    String(block.durationMinutes)
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updatedBlock: ActivityBlock = {
      ...block,
      title,
      type,
      durationMinutes: Number(durationMinutes),
    };

    onSaveActivityBlock(updatedBlock);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-background p-4">
      <h4 className="font-medium">Edit Activity Block</h4>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-block-title-${block.id}`}
          >
            Title
          </label>

          <input
            id={`edit-block-title-${block.id}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-block-type-${block.id}`}
          >
            Type
          </label>

          <select
            id={`edit-block-type-${block.id}`}
            value={type}
            onChange={(event) =>
              setType(event.target.value as ActivityBlockType)
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {activityBlockTypes.map((blockType) => (
              <option key={blockType} value={blockType}>
                {blockType}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-block-duration-${block.id}`}
          >
            Duration
          </label>

          <input
            id={`edit-block-duration-${block.id}`}
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button type="submit">Save Block</Button>

        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}