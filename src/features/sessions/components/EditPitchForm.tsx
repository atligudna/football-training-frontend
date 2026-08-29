"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";

import type { Pitch, PitchName } from "../types/training-story";

const pitchNames: PitchName[] = ["Pitch A", "Pitch B", "Pitch C", "Pitch D"];

interface EditPitchFormProps {
  pitch: Pitch;
  existingPitches: Pitch[];
  onSavePitch: (pitch: Pitch) => void;
  onCancel: () => void;
}

export function EditPitchForm({
  pitch,
  existingPitches,
  onSavePitch,
  onCancel,
}: EditPitchFormProps) {
  const [name, setName] = useState<PitchName>(pitch.name);
  const [coachName, setCoachName] = useState(pitch.coachName ?? "");
  const [playerGroup, setPlayerGroup] = useState(pitch.playerGroup ?? "");

  const availablePitchNames = pitchNames.filter((pitchName) => {
    if (pitchName === pitch.name) return true;

    return !existingPitches.some(
      (existingPitch) => existingPitch.name === pitchName
    );
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updatedPitch: Pitch = {
      ...pitch,
      name,
      coachName: coachName.trim() || undefined,
      playerGroup: playerGroup.trim() || undefined,
    };

    onSavePitch(updatedPitch);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-background p-6">
      <h3 className="text-lg font-semibold">Edit Pitch</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-pitch-name-${pitch.id}`}
          >
            Pitch
          </label>

          <select
            id={`edit-pitch-name-${pitch.id}`}
            value={name}
            onChange={(event) => setName(event.target.value as PitchName)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {availablePitchNames.map((pitchName) => (
              <option key={pitchName} value={pitchName}>
                {pitchName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-pitch-coach-${pitch.id}`}
          >
            Coach
          </label>

          <input
            id={`edit-pitch-coach-${pitch.id}`}
            value={coachName}
            onChange={(event) => setCoachName(event.target.value)}
            placeholder="Atli"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-pitch-group-${pitch.id}`}
          >
            Player group
          </label>

          <input
            id={`edit-pitch-group-${pitch.id}`}
            value={playerGroup}
            onChange={(event) => setPlayerGroup(event.target.value)}
            placeholder="Group 1"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button type="submit">Save Pitch</Button>

        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}