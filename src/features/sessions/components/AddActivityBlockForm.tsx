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

interface AddActivityBlockFormProps {
  nextOrder: number;
  onAddActivityBlock: (activityBlock: ActivityBlock) => void;
}

export function AddActivityBlockForm({
  nextOrder,
  onAddActivityBlock,
}: AddActivityBlockFormProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ActivityBlockType>("technical");
  const [durationMinutes, setDurationMinutes] = useState("15");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const activityBlock: ActivityBlock = {
      id: crypto.randomUUID(),
      title,
      type,
      order: nextOrder,
      durationMinutes: Number(durationMinutes),
      activities: [],
    };

    onAddActivityBlock(activityBlock);

    setTitle("");
    setType("technical");
    setDurationMinutes("15");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 rounded-lg border p-4">
      <h4 className="font-medium">Add Activity Block</h4>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor={`block-title-${nextOrder}`}>
            Title
          </label>

          <input
            id={`block-title-${nextOrder}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Warm-up"
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor={`block-type-${nextOrder}`}>
            Type
          </label>

          <select
            id={`block-type-${nextOrder}`}
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
            htmlFor={`block-duration-${nextOrder}`}
          >
            Duration
          </label>

          <input
            id={`block-duration-${nextOrder}`}
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
      </div>

      <div className="mt-4">
        <Button type="submit">Add Activity Block</Button>
      </div>
    </form>
  );
}