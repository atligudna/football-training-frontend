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

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  authStorage,
} from "@/features/auth/utils/authStorage";

import {
  attendanceService,
} from "../services/attendance.service";

import type {
  AttendanceStatus,
  TrainingAttendancePlayer,
} from "../types/attendance";

interface TrainingAttendanceProps {
  storyId: string;
  onAttendanceChange?: (
    players: TrainingAttendancePlayer[]
  ) => void;
}interface TrainingAttendanceProps {
  storyId: string;
  onAttendanceChange?: (
    players: TrainingAttendancePlayer[]
  ) => void;
}

type AttendanceFilter =
  | "all"
  | AttendanceStatus;

const attendanceOptions: {
  value: AttendanceStatus;
  label: string;
}[] = [
    {
      value: "attending",
      label: "Attending",
    },
    {
      value: "absent",
      label: "Absent",
    },
    {
      value: "injured",
      label: "Injured",
    },
    {
      value: "unknown",
      label: "Unknown",
    },
  ];

const filterOptions: {
  value: AttendanceFilter;
  label: string;
}[] = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "attending",
      label: "Attending",
    },
    {
      value: "absent",
      label: "Absent",
    },
    {
      value: "injured",
      label: "Injured",
    },
    {
      value: "unknown",
      label: "Unknown",
    },
  ];

function getStatusIcon(
  status: AttendanceStatus
) {
  if (status === "attending") {
    return (
      <UserCheck className="h-4 w-4" />
    );
  }

  if (status === "absent") {
    return (
      <UserMinus className="h-4 w-4" />
    );
  }

  if (status === "injured") {
    return (
      <HeartPulse className="h-4 w-4" />
    );
  }

  return (
    <CircleHelp className="h-4 w-4" />
  );
}

function createSummary(
  players: TrainingAttendancePlayer[]
) {
  return {
    total: players.length,

    attending: players.filter(
      (player) =>
        player.status === "attending"
    ).length,

    absent: players.filter(
      (player) =>
        player.status === "absent"
    ).length,

    injured: players.filter(
      (player) =>
        player.status === "injured"
    ).length,

    unknown: players.filter(
      (player) =>
        player.status === "unknown"
    ).length,
  };
}

export function TrainingAttendance({
  storyId,
  onAttendanceChange,
}: TrainingAttendanceProps) {
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
      : "You need to be logged in to view attendance."
  );

  const [
    savingPlayerId,
    setSavingPlayerId,
  ] = useState<string | null>(null);

  const [
    isSavingAll,
    setIsSavingAll,
  ] = useState(false);

  const [
    filter,
    setFilter,
  ] =
    useState<AttendanceFilter>("all");

  const [
    groupFilter,
    setGroupFilter,
  ] = useState("all");

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
        (backendPlayers) => {
          if (!isActive) return;

          setPlayers(
            backendPlayers
          );

          onAttendanceChange?.(
            backendPlayers
          );

          setError(null);
        }
      )
      .catch(() => {
        if (!isActive) return;

        setError(
          "Could not load attendance."
        );
      })
      .finally(() => {
        if (!isActive) return;

        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [storyId, onAttendanceChange]);

  const groupOptions =
    useMemo(() => {
      const groups = new Map<
        string,
        string
      >();

      for (const player of players) {
        player.groupIds.forEach(
          (groupId, index) => {
            const groupName =
              player.groupNames[
              index
              ] ??
              `Group ${groupId}`;

            if (
              !groups.has(
                groupId
              )
            ) {
              groups.set(
                groupId,
                groupName
              );
            }
          }
        );
      }

      return Array.from(
        groups.entries()
      )
        .map(
          ([id, name]) => ({
            id,
            name,
          })
        )
        .sort((a, b) =>
          a.name.localeCompare(
            b.name
          )
        );
    }, [players]);

  const overallSummary =
    useMemo(
      () =>
        createSummary(players),
      [players]
    );

  const groupPlayers =
    useMemo(() => {
      if (
        groupFilter === "all"
      ) {
        return players;
      }

      return players.filter(
        (player) =>
          player.groupIds.includes(
            groupFilter
          )
      );
    }, [
      players,
      groupFilter,
    ]);

  const groupSummary =
    useMemo(
      () =>
        createSummary(
          groupPlayers
        ),
      [groupPlayers]
    );

  const filteredPlayers =
    useMemo(() => {
      if (filter === "all") {
        return groupPlayers;
      }

      return groupPlayers.filter(
        (player) =>
          player.status === filter
      );
    }, [
      groupPlayers,
      filter,
    ]);

  const selectedGroupName =
    useMemo(() => {
      if (
        groupFilter === "all"
      ) {
        return "All groups";
      }

      return (
        groupOptions.find(
          (group) =>
            group.id ===
            groupFilter
        )?.name ??
        "Selected group"
      );
    }, [
      groupFilter,
      groupOptions,
    ]);

  async function handleStatusChange(
    player: TrainingAttendancePlayer,
    status: AttendanceStatus
  ) {
    if (
      player.status === status ||
      savingPlayerId ===
      player.playerId ||
      isSavingAll
    ) {
      return;
    }

    const token =
      authStorage.getToken();

    if (!token) {
      setError(
        "You need to be logged in."
      );
      return;
    }

    setSavingPlayerId(
      player.playerId
    );

    setError(null);

    try {
      const updatedPlayer =
        await attendanceService.updateAttendance(
          storyId,
          player.playerId,
          {
            status,
            notes:
              player.notes ??
              null,
          },
          token
        );

      const updatedPlayers =
        players.map(
          (currentPlayer) =>
            currentPlayer.playerId ===
              updatedPlayer.playerId
              ? updatedPlayer
              : currentPlayer
        );

      setPlayers(
        updatedPlayers
      );
    

      onAttendanceChange?.(
        updatedPlayers
      );
    } catch {
      setError(
        `Could not update attendance for ${player.firstName} ${player.lastName}.`
      );
    } finally {
      setSavingPlayerId(null);
    }
  }

  async function handleMarkAllAttending() {
    if (
      groupPlayers.length ===
      0 ||
      isSavingAll
    ) {
      return;
    }

    const token =
      authStorage.getToken();

    if (!token) {
      setError(
        "You need to be logged in."
      );
      return;
    }

    setIsSavingAll(true);
    setError(null);

    try {
      const updatedPlayers =
        await attendanceService.updateMany(
          storyId,
          {
            attendance:
              groupPlayers.map(
                (player) => ({
                  playerId:
                    Number(
                      player.playerId
                    ),
                  status:
                    "attending",
                  notes:
                    player.notes ??
                    null,
                })
              ),
          },
          token
        );

      setPlayers(
        updatedPlayers
      );
    } catch {
      setError(
        "Could not mark players as attending."
      );
    } finally {
      setIsSavingAll(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />

            <h2 className="text-xl font-semibold">
              Attendance
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Set player availability
            for this training
            session.
          </p>
        </div>

        {!isLoading &&
          players.length >
          0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm text-muted-foreground">
                {
                  groupSummary.attending
                }{" "}
                /{" "}
                {
                  groupSummary.total
                }{" "}
                attending
              </div>

              <Button
                type="button"
                onClick={
                  handleMarkAllAttending
                }
                disabled={
                  isSavingAll ||
                  groupPlayers.length ===
                  0 ||
                  groupSummary.attending ===
                  groupSummary.total
                }
              >
                <UserCheck className="h-4 w-4" />

                {isSavingAll
                  ? "Saving..."
                  : groupFilter ===
                    "all"
                    ? "Mark all attending"
                    : "Mark group attending"}
              </Button>
            </div>
          )}
      </div>

      {!isLoading &&
        players.length >
        0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">
                Players
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {
                  overallSummary.total
                }
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground">
                Attending
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {
                  overallSummary.attending
                }
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground">
                Absent
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {
                  overallSummary.absent
                }
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground">
                Injured
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {
                  overallSummary.injured
                }
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-xs text-muted-foreground">
                Unknown
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {
                  overallSummary.unknown
                }
              </p>
            </Card>
          </div>
        )}

      {!isLoading &&
        players.length >
        0 && (
          <Card className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <label
                  htmlFor="attendance-group-filter"
                  className="text-sm font-medium"
                >
                  Group
                </label>

                <select
                  id="attendance-group-filter"
                  value={
                    groupFilter
                  }
                  onChange={(
                    event
                  ) => {
                    setGroupFilter(
                      event.target
                        .value
                    );

                    setFilter(
                      "all"
                    );
                  }}
                  className="h-10 min-w-56 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="all">
                    All groups
                  </option>

                  {groupOptions.map(
                    (group) => (
                      <option
                        key={
                          group.id
                        }
                        value={
                          group.id
                        }
                      >
                        {
                          group.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <p className="text-sm font-medium">
                  {
                    selectedGroupName
                  }
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {
                    groupSummary.total
                  }{" "}
                  {groupSummary.total ===
                    1
                    ? "player"
                    : "players"}
                  {" · "}
                  {
                    groupSummary.attending
                  }{" "}
                  attending
                </p>
              </div>
            </div>
          </Card>
        )}

      {!isLoading &&
        groupPlayers.length >
        0 && (
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(
              (option) => (
                <Button
                  key={
                    option.value
                  }
                  type="button"
                  size="sm"
                  variant={
                    filter ===
                      option.value
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setFilter(
                      option.value
                    )
                  }
                >
                  {
                    option.label
                  }

                  {option.value ===
                    "all" &&
                    ` (${groupSummary.total})`}

                  {option.value ===
                    "attending" &&
                    ` (${groupSummary.attending})`}

                  {option.value ===
                    "absent" &&
                    ` (${groupSummary.absent})`}

                  {option.value ===
                    "injured" &&
                    ` (${groupSummary.injured})`}

                  {option.value ===
                    "unknown" &&
                    ` (${groupSummary.unknown})`}
                </Button>
              )
            )}
          </div>
        )}

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">
            Loading
            attendance...
          </p>
        </Card>
      ) : players.length ===
        0 ? (
        <Card className="p-6">
          <p className="font-medium">
            No players
            available
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a group with
            players to a pitch in
            this Training Story.
          </p>
        </Card>
      ) : groupPlayers.length ===
        0 ? (
        <Card className="p-6">
          <p className="font-medium">
            No players in this
            group
          </p>
        </Card>
      ) : filteredPlayers.length ===
        0 ? (
        <Card className="p-6">
          <p className="font-medium">
            No players in this
            filter
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose another
            attendance status.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPlayers.map(
            (player) => {
              const isSaving =
                savingPlayerId ===
                player.playerId ||
                isSavingAll;

              return (
                <Card
                  key={
                    player.playerId
                  }
                  className="p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">
                          {
                            player.firstName
                          }{" "}
                          {
                            player.lastName
                          }
                        </p>

                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                          {
                            player.status
                          }
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {player.groupNames
                          .length >
                          0
                          ? player.groupNames.join(
                            " · "
                          )
                          : "No group"}
                      </p>

                      {(player.position ||
                        player.birthYear) && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {[
                              player.position,
                              player.birthYear
                                ? `Born ${player.birthYear}`
                                : undefined,
                            ]
                              .filter(
                                Boolean
                              )
                              .join(
                                " · "
                              )}
                          </p>
                        )}

                      {player.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {
                            player.notes
                          }
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {attendanceOptions.map(
                        (
                          option
                        ) => (
                          <Button
                            key={
                              option.value
                            }
                            type="button"
                            size="sm"
                            variant={
                              player.status ===
                                option.value
                                ? "default"
                                : "outline"
                            }
                            disabled={
                              isSaving
                            }
                            onClick={() =>
                              handleStatusChange(
                                player,
                                option.value
                              )
                            }
                          >
                            {getStatusIcon(
                              option.value
                            )}

                            {
                              option.label
                            }
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </Card>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}