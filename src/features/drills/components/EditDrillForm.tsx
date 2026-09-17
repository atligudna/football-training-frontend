"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";

import type { ActivityType } from "@/features/sessions";
import type { Drill } from "../types/drill";

const drillTypes: ActivityType[] = [
  "drill",
  "station",
  "game",
  "break",
  "reflection",
];

interface EditDrillFormProps {
  drill: Drill;
  onSave: (drill: Drill) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

function equipmentToText(drill: Drill) {
  return drill.equipment
    .map((item) => `${item.name}: ${item.quantity}`)
    .join("\n");
}

function coachingPointsToText(drill: Drill) {
  return drill.coachingPoints.map((point) => point.text).join("\n");
}

function textToLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function EditDrillForm({
  drill,
  onSave,
  onCancel,
  isSaving = false,
}: EditDrillFormProps) {
  const [title, setTitle] = useState(drill.title);
  const [type, setType] = useState<ActivityType>(drill.type);
  const [description, setDescription] = useState(drill.description);
  const [durationMinutes, setDurationMinutes] = useState(
    String(drill.durationMinutes)
  );
  const [ageGroup, setAgeGroup] = useState(drill.ageGroup ?? "");
  const [tagsText, setTagsText] = useState(drill.tags.join(", "));
  const [coachingPointsText, setCoachingPointsText] = useState(
    coachingPointsToText(drill)
  );
  const [equipmentText, setEquipmentText] = useState(
    equipmentToText(drill)
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const equipment = textToLines(equipmentText).map((line) => {
      const [namePart, quantityPart] = line.includes(":")
        ? line.split(":")
        : line.split(",");

      const quantity = Number(quantityPart?.trim() || 1);

      return {
        id: crypto.randomUUID(),
        name: namePart.trim(),
        quantity:
          Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      };
    });

    const updatedDrill: Drill = {
      ...drill,
      title: title.trim(),
      type,
      description: description.trim(),
      durationMinutes: Number(durationMinutes),
      ageGroup: ageGroup.trim() || undefined,
      tags: tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      coachingPoints: textToLines(coachingPointsText).map((text) => ({
        id: crypto.randomUUID(),
        text,
      })),
      equipment,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedDrill);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value as ActivityType)
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {drillTypes.map((drillType) => (
              <option key={drillType} value={drillType}>
                {drillType}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration</label>
          <input
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Age group</label>
          <input
            value={ageGroup}
            onChange={(event) => setAgeGroup(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <input
          value={tagsText}
          onChange={(event) => setTagsText(event.target.value)}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          placeholder="passing, scanning, first touch"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Coaching points</label>
          <textarea
            value={coachingPointsText}
            onChange={(event) =>
              setCoachingPointsText(event.target.value)
            }
            rows={4}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Equipment</label>
          <textarea
            value={equipmentText}
            onChange={(event) => setEquipmentText(event.target.value)}
            rows={4}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}