"use client";

import { useEffect, useState } from "react";
import { UserRound, Users } from "lucide-react";

import { authStorage } from "@/features/auth/utils/authStorage";
import { groupService } from "@/features/players/services/group.service";

interface RunPitchInfoProps {
  playerGroup?: string;
  groupId?: string;
  coachName?: string;
}

interface LoadedPlayerCount {
  groupId: string;
  count: number;
}

export function RunPitchInfo({
  playerGroup,
  groupId,
  coachName,
}: RunPitchInfoProps) {
  const [
    loadedPlayerCount,
    setLoadedPlayerCount,
  ] = useState<LoadedPlayerCount | null>(
    null
  );

  const [failedGroupId, setFailedGroupId] =
    useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

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
  }, [groupId]);

  const playerCount =
    groupId &&
    loadedPlayerCount?.groupId === groupId
      ? loadedPlayerCount.count
      : null;

  const playerCountFailed =
    Boolean(groupId) &&
    failedGroupId === groupId;

  const isLoadingPlayerCount =
    Boolean(groupId) &&
    playerCount === null &&
    !playerCountFailed;

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />

        <span>
          {playerGroup ??
            "No player group assigned"}

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

      <div className="flex items-center gap-2">
        <UserRound className="h-4 w-4" />

        <span>
          Coach:{" "}
          {coachName ??
            "No coach assigned"}
        </span>
      </div>
    </div>
  );
}