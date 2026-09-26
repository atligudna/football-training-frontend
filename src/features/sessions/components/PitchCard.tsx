"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authStorage } from "@/features/auth/utils/authStorage";
import { groupService } from "@/features/players/services/group.service";

import { AddActivityBlockForm } from "./AddActivityBlockForm";
import { ActivityBlockCard } from "./ActivityBlockCard";
import { EditPitchForm } from "./EditPitchForm";

import type {
  Activity,
  ActivityBlock,
  Pitch,
} from "../types/training-story";

interface PitchCardProps {
  pitch: Pitch;
  existingPitches: Pitch[];
  onAddActivityBlock: (
    activityBlock: ActivityBlock
  ) => void;
  onAddActivity: (
    activityBlockId: string,
    activity: Activity
  ) => void;
  onDeleteActivity: (
    activityBlockId: string,
    activityId: string
  ) => void;
  onDeleteActivityBlock: (
    activityBlockId: string
  ) => void;
  onDeletePitch: () => void;
  onSaveActivity: (
    activityBlockId: string,
    activity: Activity
  ) => void;
  onSaveActivityBlock: (
    activityBlock: ActivityBlock
  ) => void;
  onSavePitch: (pitch: Pitch) => void;
}

interface LoadedPlayerCount {
  groupId: string;
  count: number;
}

export function PitchCard({
  pitch,
  existingPitches,
  onAddActivityBlock,
  onAddActivity,
  onDeleteActivity,
  onDeleteActivityBlock,
  onDeletePitch,
  onSaveActivity,
  onSaveActivityBlock,
  onSavePitch,
}: PitchCardProps) {
  const [isEditing, setIsEditing] =
    useState(false);

  const [
    loadedPlayerCount,
    setLoadedPlayerCount,
  ] = useState<LoadedPlayerCount | null>(
    null
  );

  const [
    failedGroupId,
    setFailedGroupId,
  ] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const groupId = pitch.groupId;

    if (!groupId) {
      return;
    }

    const token = authStorage.getToken();

    if (!token) {
      return;
    }

    groupService
      .getGroupPlayers(groupId, token)
      .then((players) => {
        if (!isActive) return;

        setLoadedPlayerCount({
          groupId,
          count: players.length,
        });

        setFailedGroupId(null);
      })
      .catch(() => {
        if (!isActive) return;

        setFailedGroupId(groupId);
      });

    return () => {
      isActive = false;
    };
  }, [pitch.groupId]);

  const playerCount =
    pitch.groupId &&
    loadedPlayerCount?.groupId ===
      pitch.groupId
      ? loadedPlayerCount.count
      : null;

  const playerCountFailed =
    Boolean(pitch.groupId) &&
    failedGroupId === pitch.groupId;

  const isLoadingPlayerCount =
    Boolean(pitch.groupId) &&
    playerCount === null &&
    !playerCountFailed;

  if (isEditing) {
    return (
      <EditPitchForm
        pitch={pitch}
        existingPitches={
          existingPitches
        }
        onSavePitch={(
          updatedPitch
        ) => {
          onSavePitch(updatedPitch);
          setIsEditing(false);
        }}
        onCancel={() =>
          setIsEditing(false)
        }
      />
    );
  }

  return (
    <div className="rounded-xl border p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold">
            {pitch.name}
          </h3>

          {pitch.playerGroup ? (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" />

              <span>
                {pitch.playerGroup}

                {isLoadingPlayerCount &&
                  " · Loading..."}

                {playerCount !== null &&
                  ` · ${playerCount} ${
                    playerCount === 1
                      ? "player"
                      : "players"
                  }`}
              </span>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 shrink-0" />

              <span>
                No player group assigned
              </span>
            </div>
          )}

          <p className="mt-1 text-sm text-muted-foreground">
            Coach:{" "}
            {pitch.coachName ??
              "No coach assigned"}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              setIsEditing(true)
            }
            aria-label="Edit pitch"
          >
            <Pencil className="h-4 w-4" />
          </Button>

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
      </div>

      <div className="mt-5 space-y-3">
        {pitch.activityBlocks.map(
          (block) => (
            <ActivityBlockCard
              key={block.id}
              block={block}
              onAddActivity={(
                activity
              ) =>
                onAddActivity(
                  block.id,
                  activity
                )
              }
              onDeleteActivity={(
                activityId
              ) =>
                onDeleteActivity(
                  block.id,
                  activityId
                )
              }
              onDeleteActivityBlock={() =>
                onDeleteActivityBlock(
                  block.id
                )
              }
              onSaveActivity={(
                activity
              ) =>
                onSaveActivity(
                  block.id,
                  activity
                )
              }
              onSaveActivityBlock={
                onSaveActivityBlock
              }
            />
          )
        )}
      </div>

      <AddActivityBlockForm
        nextOrder={
          pitch.activityBlocks.length +
          1
        }
        onAddActivityBlock={
          onAddActivityBlock
        }
      />
    </div>
  );
}