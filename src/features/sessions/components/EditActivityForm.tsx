"use client";
import {
  formatEquipmentForTextarea,
  parseEquipmentText,
} from "../utils/equipment-parser";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

import type { Activity, ActivityType } from "../types/training-story";

const activityTypes: ActivityType[] = [
  "drill",
  "station",
  "game",
  "break",
  "reflection",
];

interface EditActivityFormProps {
  activity: Activity;
  onSaveActivity: (activity: Activity) => void;
  onCancel: () => void;
}

function listToText(items: { text: string }[]) {
  return items.map((item) => item.text).join("\n");
}

export function EditActivityForm({
  activity,
  onSaveActivity,
  onCancel,
}: EditActivityFormProps) {
  const [title, setTitle] = useState(activity.title);
  const [type, setType] = useState<ActivityType>(activity.type);
  const [description, setDescription] = useState(activity.description);
  const [durationMinutes, setDurationMinutes] = useState(
    String(activity.durationMinutes)
  );
  const [coachingPointsText, setCoachingPointsText] = useState(
    listToText(activity.coachingPoints)
  );
  const [playerFocusText, setPlayerFocusText] = useState(
    listToText(activity.playerFocus)
  );
  const [equipmentText, setEquipmentText] = useState(
    formatEquipmentForTextarea(activity.equipment)
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updatedActivity: Activity = {
      ...activity,
      title,
      type,
      description,
      durationMinutes: Number(durationMinutes),
      coachingPoints: coachingPointsText
        .split("\n")
        .map((point) => point.trim())
        .filter(Boolean)
        .map((text) => ({
          id: crypto.randomUUID(),
          text,
        })),
      playerFocus: playerFocusText
        .split("\n")
        .map((focus) => focus.trim())
        .filter(Boolean)
        .map((text) => ({
          id: crypto.randomUUID(),
          text,
        })),
      equipment: parseEquipmentText(equipmentText),
    };

    onSaveActivity(updatedActivity);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border bg-background p-4">
      <h5 className="font-medium">Edit Activity</h5>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor={`edit-title-${activity.id}`}>
            Title
          </label>

          <input
            id={`edit-title-${activity.id}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor={`edit-type-${activity.id}`}>
            Type
          </label>

          <select
            id={`edit-type-${activity.id}`}
            value={type}
            onChange={(event) => setType(event.target.value as ActivityType)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {activityTypes.map((activityType) => (
              <option key={activityType} value={activityType}>
                {activityType}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-duration-${activity.id}`}
          >
            Duration
          </label>

          <input
            id={`edit-duration-${activity.id}`}
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-description-${activity.id}`}
          >
            Description
          </label>

          <input
            id={`edit-description-${activity.id}`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-coaching-points-${activity.id}`}
          >
            Coaching points
          </label>

          <textarea
            id={`edit-coaching-points-${activity.id}`}
            value={coachingPointsText}
            onChange={(event) => setCoachingPointsText(event.target.value)}
            className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-player-focus-${activity.id}`}
          >
            Player focus
          </label>

          <textarea
            id={`edit-player-focus-${activity.id}`}
            value={playerFocusText}
            onChange={(event) => setPlayerFocusText(event.target.value)}
            className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label
          className="text-sm font-medium"
          htmlFor={`edit-equipment-${activity.id}`}
        >
          Equipment
        </label>

        <textarea
          id={`edit-equipment-${activity.id}`}
          value={equipmentText}
          onChange={(event) => setEquipmentText(event.target.value)}
          placeholder={"Balls: 8\nCones: 12"}
          className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />

        <p className="text-xs text-muted-foreground">
          One item per line. Use format: name: quantity.
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button type="submit">Save Activity</Button>

        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}