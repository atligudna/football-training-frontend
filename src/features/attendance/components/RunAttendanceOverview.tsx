"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CircleHelp,
  HeartPulse,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import {
  authStorage,
} from "@/features/auth/utils/authStorage";

import type {
  Pitch,
} from "@/features/sessions/types/training-story";

import {
  attendanceService,
} from "../services/attendance.service";

import type {
  TrainingAttendancePlayer,
} from "../types/attendance";

interface RunAttendanceOverviewProps {
  storyId: string;
  pitches: Pitch[];
}

export function RunAttendanceOverview({
  storyId,
  pitches,
}: RunAttendanceOverviewProps) {
  const [
    players,
    setPlayers,
  ] = useState<
    TrainingAttendancePlayer[]
  >([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(() =>
    Boolean(authStorage.getToken())
  );

  const [
    error,
    setError,
  ] = useState<string | null>(() =>
    authStorage.getToken()
      ? null
      : "Attendance unavailable."
  );

  useEffect(() => {
    let isActive = true;

    const token =
      authStorage.getToken();

    if (!token) {
      return;
    }

    attendanceService
      .getAttendance(
        storyId,
        token
      )
      .then(
        (attendancePlayers) => {
          if (!isActive) {
            return;
          }

          setPlayers(
            attendancePlayers
          );

          setError(null);
        }
      )
      .catch(() => {
        if (!isActive) {
          return;
        }

        setError(
          "Could not load attendance."
        );
      })
      .finally(() => {
        if (!isActive) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [storyId]);

  const summary = useMemo(
    () => ({
      total: players.length,

      attending:
        players.filter(
          (player) =>
            player.status ===
            "attending"
        ).length,

      absent:
        players.filter(
          (player) =>
            player.status ===
            "absent"
        ).length,

      injured:
        players.filter(
          (player) =>
            player.status ===
            "injured"
        ).length,

      unknown:
        players.filter(
          (player) =>
            player.status ===
            "unknown"
        ).length,
    }),
    [players]
  );

  if (isLoading) {
    return (
      <Card className="p-5">
        <p className="text-sm text-muted-foreground">
          Loading attendance...
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-5">
        <p className="text-sm text-muted-foreground">
          {error}
        </p>
      </Card>
    );
  }

  return (
    <section className="space-y-4 rounded-xl border p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />

            <h2 className="text-lg font-semibold">
              Attendance
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Player availability for
            this session.
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-semibold">
            {summary.attending}
            {" / "}
            {summary.total}
          </p>

          <p className="text-xs text-muted-foreground">
            attending
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
          <UserCheck className="h-4 w-4" />

          <div>
            <p className="text-lg font-semibold">
              {summary.attending}
            </p>

            <p className="text-xs text-muted-foreground">
              Attending
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
          <UserMinus className="h-4 w-4" />

          <div>
            <p className="text-lg font-semibold">
              {summary.absent}
            </p>

            <p className="text-xs text-muted-foreground">
              Absent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
          <HeartPulse className="h-4 w-4" />

          <div>
            <p className="text-lg font-semibold">
              {summary.injured}
            </p>

            <p className="text-xs text-muted-foreground">
              Injured
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
          <CircleHelp className="h-4 w-4" />

          <div>
            <p className="text-lg font-semibold">
              {summary.unknown}
            </p>

            <p className="text-xs text-muted-foreground">
              Unknown
            </p>
          </div>
        </div>
      </div>

      {pitches.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <p className="text-sm font-medium">
            By pitch
          </p>

          {pitches
            .slice()
            .sort(
              (a, b) =>
                a.order - b.order
            )
            .map((pitch) => {
              if (!pitch.groupId) {
                return (
                  <div
                    key={pitch.id}
                    className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {pitch.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        No group assigned
                      </p>
                    </div>

                    <span className="text-sm text-muted-foreground">
                      —
                    </span>
                  </div>
                );
              }

              const pitchPlayers =
                players.filter(
                  (player) =>
                    player.groupIds.includes(
                      pitch.groupId!
                    )
                );

              const attending =
                pitchPlayers.filter(
                  (player) =>
                    player.status ===
                    "attending"
                ).length;

              const absent =
                pitchPlayers.filter(
                  (player) =>
                    player.status ===
                    "absent"
                ).length;

              const injured =
                pitchPlayers.filter(
                  (player) =>
                    player.status ===
                    "injured"
                ).length;

              const unknown =
                pitchPlayers.filter(
                  (player) =>
                    player.status ===
                    "unknown"
                ).length;

              return (
                <div
                  key={pitch.id}
                  className="flex flex-col gap-2 rounded-lg bg-muted/50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {pitch.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {pitch.playerGroup ??
                        "Player group"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    <span className="font-medium">
                      {attending}
                      {" / "}
                      {pitchPlayers.length}
                      {" attending"}
                    </span>

                    {absent > 0 && (
                      <span className="text-muted-foreground">
                        {absent} absent
                      </span>
                    )}

                    {injured > 0 && (
                      <span className="text-muted-foreground">
                        {injured} injured
                      </span>
                    )}

                    {unknown > 0 && (
                      <span className="text-muted-foreground">
                        {unknown} unknown
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
}