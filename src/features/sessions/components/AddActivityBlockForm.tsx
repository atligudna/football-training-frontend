"use client";

import { FormEvent, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ActivityBlockType>("technical");
  const [durationMinutes, setDurationMinutes] = useState("15");

  function resetForm() {
    setTitle("");
    setType("technical");
    setDurationMinutes("15");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const activityBlock: ActivityBlock = {
      id: crypto.randomUUID(),
      title: title.trim(),
      type,
      order: nextOrder,
      durationMinutes: Number(durationMinutes),
      activities: [],
    };

    onAddActivityBlock(activityBlock);

    resetForm();
    setIsOpen(false);
  }

  function handleCancel() {
    resetForm();
    setIsOpen(false);
  }

  return (
    <section className="mt-5 rounded-lg border">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-muted/40"
      >
        <div>
          <h4 className="font-medium">Add Activity Block</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new block to this pitch, such as warm-up, technical work or a
            game.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium">
          <Plus className="h-4 w-4" />
          <span>{isOpen ? "Close" : "Open"}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor={`block-title-${nextOrder}`}
              >
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
              <label
                className="text-sm font-medium"
                htmlFor={`block-type-${nextOrder}`}
              >
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

          <div className="mt-4 flex gap-3">
            <Button type="submit">Add Activity Block</Button>

            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}