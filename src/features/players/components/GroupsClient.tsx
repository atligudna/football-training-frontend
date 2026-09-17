"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Trash2,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authStorage } from "@/features/auth/utils/authStorage";

import { playerService } from "../services/player.service";
import {
  groupService,
  type CreateGroupPayload,
} from "../services/group.service";

import type { Player } from "../types/player";
import type { PlayerGroup } from "../types/group";

export function GroupsClient() {
  const [groups, setGroups] = useState<PlayerGroup[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const [groupPlayers, setGroupPlayers] = useState<
    Record<string, Player[]>
  >({});

  const [isLoading, setIsLoading] = useState(() =>
    Boolean(authStorage.getToken())
  );

  const [error, setError] = useState<string | null>(() =>
    authStorage.getToken()
      ? null
      : "You need to be logged in to view groups."
  );

  const [searchText, setSearchText] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingGroupId, setEditingGroupId] =
    useState<string | null>(null);

  const [expandedGroupId, setExpandedGroupId] =
    useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const [deletingGroupId, setDeletingGroupId] =
    useState<string | null>(null);

  const [
    loadingGroupPlayersId,
    setLoadingGroupPlayersId,
  ] = useState<string | null>(null);

  const [
    updatingMembershipKey,
    setUpdatingMembershipKey,
  ] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [description, setDescription] =
    useState("");

  useEffect(() => {
    let isActive = true;

    const token = authStorage.getToken();

    if (!token) return;

    Promise.all([
      groupService.getGroups(token),
      playerService.getPlayers(token),
    ])
      .then(([backendGroups, backendPlayers]) => {
        if (!isActive) return;

        setGroups(backendGroups);
        setPlayers(backendPlayers);
        setError(null);
      })
      .catch(() => {
        if (!isActive) return;

        setError(
          "Could not load groups and players from backend."
        );
      })
      .finally(() => {
        if (!isActive) return;

        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const filteredGroups = useMemo(() => {
    const search =
      searchText.trim().toLowerCase();

    if (!search) {
      return groups;
    }

    return groups.filter((group) => {
      const searchableText = [
        group.name,
        group.ageGroup ?? "",
        group.description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    });
  }, [groups, searchText]);

  function resetForm() {
    setName("");
    setAgeGroup("");
    setDescription("");
    setEditingGroupId(null);
  }

  function handleNewGroup() {
    if (isFormOpen && !editingGroupId) {
      resetForm();
      setIsFormOpen(false);
      return;
    }

    resetForm();
    setIsFormOpen(true);
  }

  function handleEditGroup(group: PlayerGroup) {
    setName(group.name);
    setAgeGroup(group.ageGroup ?? "");
    setDescription(group.description ?? "");
    setEditingGroupId(group.id);
    setIsFormOpen(true);
  }

  function handleCancelForm() {
    resetForm();
    setIsFormOpen(false);
  }

  async function handleSaveGroup(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = authStorage.getToken();

    if (!token) {
      setError("You need to be logged in.");
      return;
    }

    const payload: CreateGroupPayload = {
      name: name.trim(),
      ageGroup: ageGroup.trim() || undefined,
      description:
        description.trim() || undefined,
    };

    setIsSaving(true);
    setError(null);

    try {
      if (editingGroupId) {
        const updatedGroup =
          await groupService.updateGroup(
            editingGroupId,
            payload,
            token
          );

        setGroups((current) =>
          current.map((group) =>
            group.id === updatedGroup.id
              ? updatedGroup
              : group
          )
        );
      } else {
        const createdGroup =
          await groupService.createGroup(
            payload,
            token
          );

        setGroups((current) => [
          createdGroup,
          ...current,
        ]);
      }

      resetForm();
      setIsFormOpen(false);
    } catch {
      setError(
        editingGroupId
          ? "Could not update group."
          : "Could not create group."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteGroup(
    group: PlayerGroup
  ) {
    const confirmed = window.confirm(
      `Delete group "${group.name}"?`
    );

    if (!confirmed) return;

    const token = authStorage.getToken();

    if (!token) {
      setError("You need to be logged in.");
      return;
    }

    setDeletingGroupId(group.id);
    setError(null);

    try {
      await groupService.deleteGroup(
        group.id,
        token
      );

      setGroups((current) =>
        current.filter(
          (item) => item.id !== group.id
        )
      );

      setGroupPlayers((current) => {
        const next = { ...current };
        delete next[group.id];
        return next;
      });

      if (expandedGroupId === group.id) {
        setExpandedGroupId(null);
      }
    } catch {
      setError("Could not delete group.");
    } finally {
      setDeletingGroupId(null);
    }
  }

  async function handleToggleGroup(
    group: PlayerGroup
  ) {
    if (expandedGroupId === group.id) {
      setExpandedGroupId(null);
      return;
    }

    setExpandedGroupId(group.id);

    if (groupPlayers[group.id]) {
      return;
    }

    const token = authStorage.getToken();

    if (!token) return;

    setLoadingGroupPlayersId(group.id);

    try {
      const members =
        await groupService.getGroupPlayers(
          group.id,
          token
        );

      setGroupPlayers((current) => ({
        ...current,
        [group.id]: members,
      }));
    } catch {
      setError(
        `Could not load players for ${group.name}.`
      );
    } finally {
      setLoadingGroupPlayersId(null);
    }
  }

  async function handleMembershipChange(
    group: PlayerGroup,
    player: Player,
    isMember: boolean
  ) {
    const token = authStorage.getToken();

    if (!token) return;

    const membershipKey =
      `${group.id}-${player.id}`;

    setUpdatingMembershipKey(membershipKey);
    setError(null);

    try {
      if (isMember) {
        await groupService.removePlayerFromGroup(
          group.id,
          player.id,
          token
        );

        setGroupPlayers((current) => ({
          ...current,
          [group.id]: (
            current[group.id] ?? []
          ).filter(
            (member) =>
              member.id !== player.id
          ),
        }));
      } else {
        await groupService.addPlayerToGroup(
          group.id,
          player.id,
          token
        );

        setGroupPlayers((current) => ({
          ...current,
          [group.id]: [
            ...(current[group.id] ?? []).filter(
              (member) =>
                member.id !== player.id
            ),
            player,
          ],
        }));
      }
    } catch {
      setError(
        "Could not update group membership."
      );
    } finally {
      setUpdatingMembershipKey(null);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Groups
          </h1>

          <p className="mt-2 text-muted-foreground">
            Create training groups and assign players.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleNewGroup}
        >
          <Plus className="h-4 w-4" />
          New Group
        </Button>
      </header>

      {isLoading && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Loading groups...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isFormOpen && (
        <Card className="p-6">
          <form
            onSubmit={handleSaveGroup}
            className="space-y-5"
          >
            <div>
              <h2 className="text-xl font-semibold">
                {editingGroupId
                  ? "Edit Group"
                  : "New Group"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {editingGroupId
                  ? "Update group information."
                  : "Create a group and then assign players."}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="group-name"
                  className="text-sm font-medium"
                >
                  Name
                </label>

                <input
                  id="group-name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="U12 A"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="group-age"
                  className="text-sm font-medium"
                >
                  Age group
                </label>

                <input
                  id="group-age"
                  value={ageGroup}
                  onChange={(event) =>
                    setAgeGroup(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="U12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="group-description"
                className="text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="group-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={3}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Main U12 training group..."
              />
            </div>

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
                  : editingGroupId
                  ? "Save changes"
                  : "Add group"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="rounded-xl border p-4">
        <div className="space-y-2">
          <label
            htmlFor="group-search"
            className="text-sm font-medium"
          >
            Search
          </label>

          <input
            id="group-search"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            placeholder="Search group name, age group..."
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredGroups.length} of{" "}
        {groups.length} groups.
      </p>

      {!isLoading &&
      filteredGroups.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <UsersRound className="mx-auto h-8 w-8 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold">
            No groups found
          </h2>

          <p className="mt-2 text-muted-foreground">
            Create your first training group.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((group) => {
            const members =
              groupPlayers[group.id] ?? [];

            const memberIds = new Set(
              members.map(
                (member) => member.id
              )
            );

            const isExpanded =
              expandedGroupId === group.id;

            return (
              <Card
                key={group.id}
                className="p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {group.ageGroup ??
                        "No age group"}
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      {group.name}
                    </h2>

                    {group.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {group.description}
                      </p>
                    )}

                    {groupPlayers[group.id] && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        {members.length}{" "}
                        {members.length === 1
                          ? "player"
                          : "players"}
                      </p>
                    )}
                  </div>

                  <div className="ml-auto flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleEditGroup(group)
                      }
                      aria-label={`Edit ${group.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteGroup(group)
                      }
                      disabled={
                        deletingGroupId ===
                        group.id
                      }
                      aria-label={`Delete ${group.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-5 border-t pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      handleToggleGroup(group)
                    }
                  >
                    <UsersRound className="h-4 w-4" />
                    Manage players

                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {isExpanded && (
                  <div className="mt-5 border-t pt-5">
                    {loadingGroupPlayersId ===
                    group.id ? (
                      <p className="text-sm text-muted-foreground">
                        Loading group players...
                      </p>
                    ) : players.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No players available.
                      </p>
                    ) : (
                      <div className="grid gap-2 md:grid-cols-2">
                        {players.map((player) => {
                          const isMember =
                            memberIds.has(
                              player.id
                            );

                          const membershipKey =
                            `${group.id}-${player.id}`;

                          return (
                            <label
                              key={player.id}
                              className="flex cursor-pointer items-center gap-3 rounded-lg border p-3"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  isMember
                                }
                                disabled={
                                  updatingMembershipKey ===
                                  membershipKey
                                }
                                onChange={() =>
                                  handleMembershipChange(
                                    group,
                                    player,
                                    isMember
                                  )
                                }
                              />

                              <div>
                                <p className="text-sm font-medium">
                                  {
                                    player.firstName
                                  }{" "}
                                  {
                                    player.lastName
                                  }
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {player.birthYear ??
                                    "No birth year"}

                                  {" · "}

                                  {player.position ??
                                    "No position"}

                                  {!player.active &&
                                    " · Inactive"}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
