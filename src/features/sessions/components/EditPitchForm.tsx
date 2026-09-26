"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/button";

import { authStorage } from "@/features/auth/utils/authStorage";
import { groupService } from "@/features/players/services/group.service";
import { coachService } from "@/features/coaches/services/coach.service";
import type { Coach } from "@/features/coaches/types/coach";
import type { PlayerGroup } from "@/features/players/types/group";

import type {
  Pitch,
  PitchName,
} from "../types/training-story";

const pitchNames: PitchName[] = [
  "Pitch A",
  "Pitch B",
  "Pitch C",
  "Pitch D",
];

const LEGACY_GROUP_VALUE =
  "__legacy_group__";
const LEGACY_COACH_VALUE =
  "__legacy_coach__";

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
  const [name, setName] =
    useState<PitchName>(pitch.name);

  const [coaches, setCoaches] =
    useState<Coach[]>([]);

  const [
    selectedCoachId,
    setSelectedCoachId,
  ] = useState(() => {
    if (pitch.coachId) {
      return pitch.coachId;
    }

    if (pitch.coachName) {
      return LEGACY_COACH_VALUE;
    }

    return "";
  });

  const [
    isLoadingCoaches,
    setIsLoadingCoaches,
  ] = useState(() =>
    Boolean(authStorage.getToken())
  );

  const [
    coachError,
    setCoachError,
  ] = useState<string | null>(null);

  const [groups, setGroups] = useState<
    PlayerGroup[]
  >([]);

  const [
    selectedGroupId,
    setSelectedGroupId,
  ] = useState(() => {
    if (pitch.groupId) {
      return pitch.groupId;
    }

    if (pitch.playerGroup) {
      return LEGACY_GROUP_VALUE;
    }

    return "";
  });

  const [isLoadingGroups, setIsLoadingGroups] =
    useState(() =>
      Boolean(authStorage.getToken())
    );

  const [groupError, setGroupError] =
    useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const token = authStorage.getToken();

    if (!token) return;

    groupService
      .getGroups(token)
      .then((backendGroups) => {
        if (!isActive) return;

        setGroups(backendGroups);
        setGroupError(null);
      })
      .catch(() => {
        if (!isActive) return;

        setGroupError(
          "Could not load player groups."
        );
      })
      .finally(() => {
        if (!isActive) return;

        setIsLoadingGroups(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const token = authStorage.getToken();

    if (!token) return;

    coachService
      .getCoaches(token)
      .then((backendCoaches) => {
        if (!isActive) return;

        setCoaches(backendCoaches);
        setCoachError(null);
      })
      .catch(() => {
        if (!isActive) return;

        setCoachError(
          "Could not load coaches."
        );
      })
      .finally(() => {
        if (!isActive) return;

        setIsLoadingCoaches(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const availablePitchNames =
    pitchNames.filter((pitchName) => {
      if (pitchName === pitch.name) {
        return true;
      }

      return !existingPitches.some(
        (existingPitch) =>
          existingPitch.name ===
          pitchName
      );
    });

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    let nextCoachId:
      | string
      | undefined;

    let nextCoachName:
      | string
      | undefined;

    if (
      selectedCoachId ===
      LEGACY_COACH_VALUE
    ) {
      nextCoachId = undefined;
      nextCoachName =
        pitch.coachName;
    } else if (selectedCoachId) {
      const selectedCoach =
        coaches.find(
          (coach) =>
            coach.id ===
            selectedCoachId
        );

      if (selectedCoach) {
        nextCoachId =
          selectedCoach.id;

        nextCoachName =
          selectedCoach.name;
      } else {
        nextCoachId =
          pitch.coachId;

        nextCoachName =
          pitch.coachName;
      }
    }
    let nextGroupId:
      | string
      | undefined;

    let nextPlayerGroup:
      | string
      | undefined;

    if (
      selectedGroupId ===
      LEGACY_GROUP_VALUE
    ) {
      nextGroupId = undefined;
      nextPlayerGroup =
        pitch.playerGroup;
    } else if (selectedGroupId) {
      const selectedGroup =
        groups.find(
          (group) =>
            group.id ===
            selectedGroupId
        );

      if (selectedGroup) {
        nextGroupId =
          selectedGroup.id;

        nextPlayerGroup =
          selectedGroup.name;
      } else {
        nextGroupId =
          pitch.groupId;

        nextPlayerGroup =
          pitch.playerGroup;
      }
    }

    const updatedPitch: Pitch = {
      ...pitch,
      name,

      coachName:
        nextCoachName,

      coachId:
        nextCoachId,

      playerGroup:
        nextPlayerGroup,

      groupId:
        nextGroupId,
    };

    onSavePitch(updatedPitch);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-background p-6"
    >
      <h3 className="text-lg font-semibold">
        Edit Pitch
      </h3>

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
            onChange={(event) =>
              setName(
                event.target
                  .value as PitchName
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {availablePitchNames.map(
              (pitchName) => (
                <option
                  key={pitchName}
                  value={pitchName}
                >
                  {pitchName}
                </option>
              )
            )}
          </select>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-pitch-coach-${pitch.id}`}
          >
            Coach
          </label>

          <select
            id={`edit-pitch-coach-${pitch.id}`}
            value={selectedCoachId}
            onChange={(event) =>
              setSelectedCoachId(
                event.target.value
              )
            }
            disabled={isLoadingCoaches}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">
              {isLoadingCoaches
                ? "Loading coaches..."
                : "No coach"}
            </option>

            {pitch.coachName &&
              !pitch.coachId && (
                <option
                  value={
                    LEGACY_COACH_VALUE
                  }
                >
                  {pitch.coachName} — old value
                </option>
              )}

            {coaches.map((coach) => (
              <option
                key={coach.id}
                value={coach.id}
              >
                {coach.name}
                {!coach.active
                  ? " — inactive"
                  : ""}
              </option>
            ))}
          </select>

          {coachError && (
            <p className="text-xs text-destructive">
              {coachError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium"
            htmlFor={`edit-pitch-group-${pitch.id}`}
          >
            Player group
          </label>

          <select
            id={`edit-pitch-group-${pitch.id}`}
            value={selectedGroupId}
            onChange={(event) =>
              setSelectedGroupId(
                event.target.value
              )
            }
            disabled={isLoadingGroups}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">
              {isLoadingGroups
                ? "Loading groups..."
                : "No group"}
            </option>

            {pitch.playerGroup &&
              !pitch.groupId && (
                <option
                  value={
                    LEGACY_GROUP_VALUE
                  }
                >
                  {pitch.playerGroup} —
                  old value
                </option>
              )}

            {groups.map((group) => (
              <option
                key={group.id}
                value={group.id}
              >
                {group.name}
                {group.ageGroup
                  ? ` — ${group.ageGroup}`
                  : ""}
              </option>
            ))}
          </select>

          {groupError && (
            <p className="text-xs text-destructive">
              {groupError}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button type="submit">
          Save Pitch
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}