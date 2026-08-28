"use client";

import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import type { Pitch, PitchName } from "../types/training-story";

const pitchNames: PitchName[] = ["Pitch A", "Pitch B", "Pitch C", "Pitch D"];

interface AddPitchFormProps {
  existingPitches: Pitch[];
  onAddPitch: (pitch: Pitch) => void;
}

export function AddPitchForm({
  existingPitches,
  onAddPitch,
}: AddPitchFormProps) {
  const availablePitchNames = useMemo(() => {
    return pitchNames.filter(
      (pitchName) =>
        !existingPitches.some((pitch) => pitch.name === pitchName)
    );
  }, [existingPitches]);

  const [name, setName] = useState<PitchName>(
    availablePitchNames[0] ?? "Pitch A"
  );
  const [coachName, setCoachName] = useState("");
  const [playerGroup, setPlayerGroup] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const pitch: Pitch = {
      id: crypto.randomUUID(),
      name,
      coachName: coachName.trim() || undefined,
      playerGroup: playerGroup.trim() || undefined,
      order: existingPitches.length + 1,
      activityBlocks: [],
    };

    onAddPitch(pitch);

    setCoachName("");
    setPlayerGroup("");
  }

  if (availablePitchNames.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
        All pitches have been added.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">Add Pitch</h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="pitchName">
            Pitch
          </label>

          <select
            id="pitchName"
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
          <label className="text-sm font-medium" htmlFor="coachName">
            Coach
          </label>

          <input
            id="coachName"
            value={coachName}
            onChange={(event) => setCoachName(event.target.value)}
            placeholder="Atli"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="playerGroup">
            Player group
          </label>

          <input
            id="playerGroup"
            value={playerGroup}
            onChange={(event) => setPlayerGroup(event.target.value)}
            placeholder="Group 1"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
      </div>

      <div className="mt-5">
        <Button type="submit">Add Pitch</Button>
      </div>
    </form>
  );
}