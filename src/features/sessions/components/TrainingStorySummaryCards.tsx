"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Clock,
  Dumbbell,
  Layers,
  ListChecks,
  Map,
  Users,
  UsersRound,
} from "lucide-react";

import { authStorage } from "@/features/auth/utils/authStorage";
import { groupService } from "@/features/players/services/group.service";

import { getTrainingStorySummary } from "../utils/training-story-summary";

import type { TrainingStory } from "../types/training-story";

interface TrainingStorySummaryCardsProps {
  story: TrainingStory;
}

interface LoadedPlayerSummary {
  groupKey: string;
  playerCount: number;
}

export function TrainingStorySummaryCards({
  story,
}: TrainingStorySummaryCardsProps) {
  const summary =
    getTrainingStorySummary(story);

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

  const groupKeys = useMemo(() => {
    return new Set(
      story.pitches
        .map((pitch) => {
          if (pitch.groupId) {
            return `id:${pitch.groupId}`;
          }

          if (pitch.playerGroup) {
            return `legacy:${pitch.playerGroup
              .trim()
              .toLowerCase()}`;
          }

          return null;
        })
        .filter(
          (value): value is string =>
            Boolean(value)
        )
    );
  }, [story.pitches]);

  const hasLegacyGroups =
    story.pitches.some(
      (pitch) =>
        Boolean(pitch.playerGroup) &&
        !pitch.groupId
    );

  const groupKey = groupIds.join("|");

  const [
    loadedPlayerSummary,
    setLoadedPlayerSummary,
  ] = useState<LoadedPlayerSummary | null>(
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
      groupIds.map((groupId) =>
        groupService.getGroupPlayers(
          groupId,
          token
        )
      )
    )
      .then((groupPlayers) => {
        if (!isActive) return;

        const uniquePlayerIds =
          new Set<string>();

        for (const players of groupPlayers) {
          for (const player of players) {
            uniquePlayerIds.add(
              player.id
            );
          }
        }

        setLoadedPlayerSummary({
          groupKey,
          playerCount:
            uniquePlayerIds.size,
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

  const linkedPlayerCount =
    loadedPlayerSummary?.groupKey ===
    groupKey
      ? loadedPlayerSummary.playerCount
      : null;

  const isLoadingPlayers =
    groupIds.length > 0 &&
    linkedPlayerCount === null &&
    failedGroupKey !== groupKey;

  let playerCountValue:
    | string
    | number = 0;

  if (isLoadingPlayers) {
    playerCountValue = "...";
  } else if (
    failedGroupKey === groupKey &&
    groupIds.length > 0
  ) {
    playerCountValue = "—";
  } else if (hasLegacyGroups) {
    playerCountValue =
      linkedPlayerCount !== null
        ? `${linkedPlayerCount}+`
        : "—";
  } else {
    playerCountValue =
      linkedPlayerCount ?? 0;
  }

  const cards = [
    {
      label: "Players",
      value: playerCountValue,
      icon: Users,
    },
    {
      label: "Groups",
      value: groupKeys.size,
      icon: UsersRound,
    },
    {
      label: "Pitches",
      value: summary.pitchCount,
      icon: Map,
    },
    {
      label: "Duration",
      value: `${summary.totalDurationMinutes} min`,
      icon: Clock,
    },
    {
      label: "Blocks",
      value:
        summary.activityBlockCount,
      icon: Layers,
    },
    {
      label: "Activities",
      value: summary.activityCount,
      icon: ListChecks,
    },
    {
      label: "Equipment",
      value: summary.equipmentCount,
      icon: Dumbbell,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-xl border p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {card.label}
              </p>

              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-semibold">
              {card.value}
            </p>
          </div>
        );
      })}
    </section>
  );
}