"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authStorage } from "@/features/auth/utils/authStorage";

import {
  playerService,
  type CreatePlayerPayload,
} from "../services/player.service";

import type { Player } from "../types/player";

type PlayerFilter = "all" | "active" | "inactive";

type PlayerSortOption =
  | "name-asc"
  | "name-desc"
  | "youngest"
  | "oldest";

const sortOptions: {
  value: PlayerSortOption;
  label: string;
}[] = [
  {
    value: "name-asc",
    label: "Name A-Z",
  },
  {
    value: "name-desc",
    label: "Name Z-A",
  },
  {
    value: "youngest",
    label: "Youngest first",
  },
  {
    value: "oldest",
    label: "Oldest first",
  },
];

function sortPlayers(
  players: Player[],
  sortOption: PlayerSortOption
) {
  return [...players].sort((a, b) => {
    if (sortOption === "name-asc") {
      return `${a.lastName} ${a.firstName}`.localeCompare(
        `${b.lastName} ${b.firstName}`
      );
    }

    if (sortOption === "name-desc") {
      return `${b.lastName} ${b.firstName}`.localeCompare(
        `${a.lastName} ${a.firstName}`
      );
    }

    if (sortOption === "youngest") {
      return (
        (b.birthYear ?? 0) -
        (a.birthYear ?? 0)
      );
    }

    if (sortOption === "oldest") {
      return (
        (a.birthYear ?? 9999) -
        (b.birthYear ?? 9999)
      );
    }

    return 0;
  });
}

export function PlayersClient() {
  const [players, setPlayers] = useState<Player[]>([]);

  const [isLoading, setIsLoading] = useState(() =>
    Boolean(authStorage.getToken())
  );

  const [error, setError] = useState<string | null>(() =>
    authStorage.getToken()
      ? null
      : "You need to be logged in to view players."
  );

  const [isNewPlayerOpen, setIsNewPlayerOpen] =
    useState(false);

  const [editingPlayerId, setEditingPlayerId] =
    useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const [deletingPlayerId, setDeletingPlayerId] =
    useState<string | null>(null);

  const [searchText, setSearchText] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<PlayerFilter>("all");

  const [sortOption, setSortOption] =
    useState<PlayerSortOption>("name-asc");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [position, setPosition] = useState("");
  const [notes, setNotes] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    let isActive = true;

    const token = authStorage.getToken();

    if (!token) return;

    playerService
      .getPlayers(token)
      .then((backendPlayers) => {
        if (!isActive) return;

        setPlayers(backendPlayers);
        setError(null);
      })
      .catch(() => {
        if (!isActive) return;

        setError("Could not load players from backend.");
      })
      .finally(() => {
        if (!isActive) return;

        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const filteredPlayers = useMemo(() => {
    const normalizedSearch =
      searchText.trim().toLowerCase();

    const matchingPlayers = players.filter((player) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && player.active) ||
        (statusFilter === "inactive" && !player.active);

      const searchableText = [
        player.firstName,
        player.lastName,
        player.position ?? "",
        player.birthYear?.toString() ?? "",
        player.notes ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableText.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });

    return sortPlayers(
      matchingPlayers,
      sortOption
    );
  }, [
    players,
    searchText,
    statusFilter,
    sortOption,
  ]);

  function resetForm() {
    setFirstName("");
    setLastName("");
    setBirthYear("");
    setPosition("");
    setNotes("");
    setActive(true);
    setEditingPlayerId(null);
  }

  function openNewPlayer() {
    resetForm();
    setIsNewPlayerOpen(true);
  }

  function handleCancelForm() {
    resetForm();
    setIsNewPlayerOpen(false);
  }

  function handleEditPlayer(player: Player) {
    setEditingPlayerId(player.id);

    setFirstName(player.firstName);
    setLastName(player.lastName);

    setBirthYear(
      player.birthYear?.toString() ?? ""
    );

    setPosition(player.position ?? "");
    setNotes(player.notes ?? "");
    setActive(player.active);

    setIsNewPlayerOpen(true);
  }

  async function handleSavePlayer(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = authStorage.getToken();

    if (!token) {
      setError("You need to be logged in.");
      return;
    }

    const payload: CreatePlayerPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),

      birthYear:
        birthYear.trim().length > 0
          ? Number(birthYear)
          : undefined,

      position:
        position.trim() || undefined,

      notes:
        notes.trim() || undefined,

      active,
    };

    setIsSaving(true);
    setError(null);

    try {
      if (editingPlayerId) {
        const updatedPlayer =
          await playerService.updatePlayer(
            editingPlayerId,
            payload,
            token
          );

        setPlayers((current) =>
          current.map((player) =>
            player.id === updatedPlayer.id
              ? updatedPlayer
              : player
          )
        );
      } else {
        const createdPlayer =
          await playerService.createPlayer(
            payload,
            token
          );

        setPlayers((current) => [
          createdPlayer,
          ...current,
        ]);
      }

      resetForm();
      setIsNewPlayerOpen(false);
    } catch {
      setError(
        editingPlayerId
          ? "Could not update player."
          : "Could not create player."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeletePlayer(player: Player) {
    const confirmed = window.confirm(
      `Delete ${player.firstName} ${player.lastName}?`
    );

    if (!confirmed) return;

    const token = authStorage.getToken();

    if (!token) {
      setError("You need to be logged in.");
      return;
    }

    setDeletingPlayerId(player.id);
    setError(null);

    try {
      await playerService.deletePlayer(
        player.id,
        token
      );

      setPlayers((current) =>
        current.filter(
          (item) => item.id !== player.id
        )
      );
    } catch {
      setError("Could not delete player.");
    } finally {
      setDeletingPlayerId(null);
    }
  }

  function clearFilters() {
    setSearchText("");
    setStatusFilter("all");
  }

  const hasActiveFilters =
    searchText.trim().length > 0 ||
    statusFilter !== "all";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Squad
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your players and training squad.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            if (isNewPlayerOpen) {
              handleCancelForm();
            } else {
              openNewPlayer();
            }
          }}
        >
          <Plus className="h-4 w-4" />
          New Player
        </Button>
      </header>

      {isLoading && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Loading players...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isNewPlayerOpen && (
        <Card className="p-6">
          <form
            onSubmit={handleSavePlayer}
            className="space-y-5"
          >
            <div>
              <h2 className="text-xl font-semibold">
                {editingPlayerId
                  ? "Edit Player"
                  : "New Player"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {editingPlayerId
                  ? "Update player information."
                  : "Add a new player to your squad."}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="player-first-name"
                  className="text-sm font-medium"
                >
                  First name
                </label>

                <input
                  id="player-first-name"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value)
                  }
                  required
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="Jón"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="player-last-name"
                  className="text-sm font-medium"
                >
                  Last name
                </label>

                <input
                  id="player-last-name"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(event.target.value)
                  }
                  required
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="Jónsson"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="player-birth-year"
                  className="text-sm font-medium"
                >
                  Birth year
                </label>

                <input
                  id="player-birth-year"
                  type="number"
                  min={1900}
                  max={2100}
                  value={birthYear}
                  onChange={(event) =>
                    setBirthYear(event.target.value)
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="2014"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="player-position"
                  className="text-sm font-medium"
                >
                  Position
                </label>

                <input
                  id="player-position"
                  value={position}
                  onChange={(event) =>
                    setPosition(event.target.value)
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="Midfielder"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="player-notes"
                className="text-sm font-medium"
              >
                Notes
              </label>

              <textarea
                id="player-notes"
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={3}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Optional notes..."
              />
            </div>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={active}
                onChange={(event) =>
                  setActive(event.target.checked)
                }
              />

              Active player
            </label>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelForm}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : editingPlayerId
                  ? "Save changes"
                  : "Add player"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 rounded-xl border p-4 lg:grid-cols-[1fr_180px_220px]">
        <div className="space-y-2">
          <label
            htmlFor="player-search"
            className="text-sm font-medium"
          >
            Search
          </label>

          <input
            id="player-search"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Search name, position, birth year..."
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="player-status"
            className="text-sm font-medium"
          >
            Status
          </label>

          <select
            id="player-status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as PlayerFilter
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">All</option>
            <option value="active">
              Active
            </option>
            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="player-sort"
            className="text-sm font-medium"
          >
            Sort
          </label>

          <select
            id="player-sort"
            value={sortOption}
            onChange={(event) =>
              setSortOption(
                event.target
                  .value as PlayerSortOption
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPlayers.length} of{" "}
          {players.length} players.
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {!isLoading &&
      filteredPlayers.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold">
            No players found
          </h2>

          <p className="mt-2 text-muted-foreground">
            Add a player or change your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredPlayers.map((player) => (
            <Card
              key={player.id}
              className="p-6"
            >
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold">
                      {player.firstName}{" "}
                      {player.lastName}
                    </h2>

                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                      {player.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {player.birthYear
                      ? `Born ${player.birthYear}`
                      : "Birth year not set"}

                    {" · "}

                    {player.position ??
                      "No position"}
                  </p>

                  {player.notes && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {player.notes}
                    </p>
                  )}
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleEditPlayer(player)
                    }
                    aria-label={`Edit ${player.firstName} ${player.lastName}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleDeletePlayer(player)
                    }
                    disabled={
                      deletingPlayerId === player.id
                    }
                    aria-label={`Delete ${player.firstName} ${player.lastName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}