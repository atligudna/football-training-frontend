"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Map,
  UserRound,
  Users,
} from "lucide-react";

import { authStorage } from "@/features/auth/utils/authStorage";
import { groupService } from "@/features/players/services/group.service";

import type { TrainingStory } from "../types/training-story";

interface RunPitchOverviewProps {
  story: TrainingStory;
}

interface LoadedGroupCounts {
  groupKey: string;
  counts: Record<string, number>;
}

export function RunPitchOverview({
  story,
}: RunPitchOverviewProps) {
  const groupIds = useMemo(() => {
    return [
      ...new Set(
        story.pitches
          .map((pitch) => pitch.groupId)
          .filter(
            (groupId): groupId is string =>
              Boolean(groupId)
          )
      ),
    ].sort();
  }, [story.pitches]);

  const groupKey = groupIds.join("|");

  const [
    loadedGroupCounts,
    setLoadedGroupCounts,
  ] = useState<LoadedGroupCounts | null>(
    null
  );

  const [
    failedGroupKey,
    setFailedGroupKey,
  ] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    if (groupIds.length === 0) {
      return;
    }

    const token = authStorage.getToken();

    if (!token) {
      return;
    }

    Promise.all(
      groupIds.map(async (groupId) => {
        const players =
          await groupService.getGroupPlayers(
            groupId,
            token
          );

        return {
          groupId,
          count: players.length,
        };
      })
    )
      .then((results) => {
        if (!isActive) return;

        const counts: Record<
          string,
          number
        > = {};

        for (const result of results) {
          counts[result.groupId] =
            result.count;
        }

        setLoadedGroupCounts({
          groupKey,
          counts,
        });

        setFailedGroupKey(null);
      })
      .catch(() => {
        if (!isActive) return;

        setFailedGroupKey(groupKey);
      });

    return () => {
      isActive = false;
    };
  }, [groupIds, groupKey]);

  const counts =
    loadedGroupCounts?.groupKey ===
    groupKey
      ? loadedGroupCounts.counts
      : null;

  const isLoading =
    groupIds.length > 0 &&
    counts === null &&
    failedGroupKey !== groupKey;

  if (story.pitches.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border p-4 sm:p-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Pitch setup
        </p>

        <h2 className="mt-1 text-xl font-semibold">
          Groups and coaches
        </h2>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {story.pitches.map((pitch) => {
          const playerCount =
            pitch.groupId && counts
              ? counts[pitch.groupId]
              : undefined;

          return (
            <div
              key={pitch.id}
              className="rounded-lg border p-4"
            >
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-muted-foreground" />

                <h3 className="font-semibold">
                  {pitch.name}
                </h3>
              </div>

              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 shrink-0" />

                  <span>
                    {pitch.playerGroup ??
                      "No player group assigned"}

                    {pitch.groupId &&
                      isLoading &&
                      " · Loading..."}

                    {pitch.groupId &&
                      playerCount !==
                        undefined &&
                      ` · ${playerCount} ${
                        playerCount === 1
                          ? "player"
                          : "players"
                      }`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 shrink-0" />

                  <span>
                    Coach:{" "}
                    {pitch.coachName ??
                      "No coach assigned"}
                  </span>
                </div>

                <p>
                  {pitch.activityBlocks.length}{" "}
                  {pitch.activityBlocks.length ===
                  1
                    ? "block"
                    : "blocks"}
                  {" · "}
                  {pitch.activityBlocks.reduce(
                    (total, block) =>
                      total +
                      block.activities.length,
                    0
                  )}{" "}
                  activities
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {failedGroupKey === groupKey &&
        groupIds.length > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Player counts could not be loaded.
            Group and coach information is
            still available.
          </p>
        )}
    </section>
  );
}