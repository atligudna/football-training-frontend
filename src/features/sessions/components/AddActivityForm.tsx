"use client";

import { FormEvent, useId, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { drills as baseDrills } from "@/features/drills";
import { getAllDrills } from "@/features/drills";

import {
  formatEquipmentForTextarea,
  parseEquipmentText,
} from "../utils/equipment-parser";

import type { Activity, ActivityType } from "../types/training-story";

const activityTypes: ActivityType[] = [
  "drill",
  "station",
  "game",
  "break",
  "reflection",
];

interface AddActivityFormProps {
  onAddActivity: (activity: Activity) => void;
}

export function AddActivityForm({ onAddActivity }: AddActivityFormProps) {
  const formId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ActivityType>("drill");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("10");
  const [coachingPointsText, setCoachingPointsText] = useState("");
  const [playerFocusText, setPlayerFocusText] = useState("");
  const [equipmentText, setEquipmentText] = useState("");
  const [availableDrills] = useState(() => getAllDrills(baseDrills));
  const [selectedDrillId, setSelectedDrillId] = useState("");

  function resetForm() {
    setTitle("");
    setType("drill");
    setDescription("");
    setDurationMinutes("10");
    setCoachingPointsText("");
    setPlayerFocusText("");
    setEquipmentText("");
    setSelectedDrillId("");
  }

  function handleSelectDrill(drillId: string) {
    setSelectedDrillId(drillId);

    if (!drillId) return;

    const selectedDrill = availableDrills.find((drill) => drill.id === drillId);

    if (!selectedDrill) return;

    setTitle(selectedDrill.title);
    setType(selectedDrill.type);
    setDescription(selectedDrill.description);
    setDurationMinutes(String(selectedDrill.durationMinutes));
    setCoachingPointsText(
      selectedDrill.coachingPoints.map((point) => point.text).join("\n")
    );
    setEquipmentText(formatEquipmentForTextarea(selectedDrill.equipment));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const equipment = parseEquipmentText(equipmentText);

    const activity: Activity = {
      id: crypto.randomUUID(),
      title: title.trim(),
      type,
      description: description.trim(),
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
      equipment,
    };

    onAddActivity(activity);

    resetForm();
    setIsOpen(false);
  }

  function handleCancel() {
    resetForm();
    setIsOpen(false);
  }

  return (
    <section className="mt-4 rounded-lg border bg-background">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-muted/40"
      >
        <div>
          <h5 className="font-medium">Add Activity</h5>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a drill, station, game, break or reflection to this block.
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor={`${formId}-activity-title`}
              >
                Title
              </label>

              <input
                id={`${formId}-activity-title`}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Triangle Passing"
                required
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              />
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="space-y-2">
                <label
                  htmlFor={`${formId}-activity-drill-template`}
                  className="text-sm font-medium"
                >
                  Start from drill bank
                </label>

                <select
                  id={`${formId}-activity-drill-template`}
                  value={selectedDrillId}
                  onChange={(event) => handleSelectDrill(event.target.value)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">Choose a drill...</option>

                  {availableDrills.map((drill) => (
                    <option key={drill.id} value={drill.id}>
                      {drill.title} · {drill.ageGroup ?? "No age group"} ·{" "}
                      {drill.durationMinutes} min
                    </option>
                  ))}
                </select>

                <p className="text-xs text-muted-foreground">
                  Selecting a drill fills the activity form. You can still edit
                  everything before saving.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor={`${formId}-activity-type`}
              >
                Type
              </label>

              <select
                id={`${formId}-activity-type`}
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
                htmlFor={`${formId}-activity-duration`}
              >
                Duration
              </label>

              <input
                id={`${formId}-activity-duration`}
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
                htmlFor={`${formId}-activity-description`}
              >
                Description
              </label>

              <input
                id={`${formId}-activity-description`}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Players pass and rotate in triangles."
                required
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor={`${formId}-activity-coaching-points`}
              >
                Coaching points
              </label>

              <textarea
                id={`${formId}-activity-coaching-points`}
                value={coachingPointsText}
                onChange={(event) => setCoachingPointsText(event.target.value)}
                placeholder={"Open body\nPass to far foot\nMove after passing"}
                className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />

              <p className="text-xs text-muted-foreground">
                One coaching point per line.
              </p>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                htmlFor={`${formId}-activity-player-focus`}
              >
                Player focus
              </label>

              <textarea
                id={`${formId}-activity-player-focus`}
                value={playerFocusText}
                onChange={(event) => setPlayerFocusText(event.target.value)}
                placeholder={"Scan before receiving\nFirst touch forward"}
                className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />

              <p className="text-xs text-muted-foreground">
                One player focus item per line.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor={`${formId}-activity-equipment`}
            >
              Equipment
            </label>

            <textarea
              id={`${formId}-activity-equipment`}
              value={equipmentText}
              onChange={(event) => setEquipmentText(event.target.value)}
              placeholder={"Balls: 8\nCones: 12\nBibs: 10"}
              className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />

            <p className="text-xs text-muted-foreground">
              One item per line. Use format: name: quantity.
            </p>
          </div>

          <div className="mt-4 flex gap-3">
            <Button type="submit">Add Activity</Button>

            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}