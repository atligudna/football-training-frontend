"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { FormEvent } from "react";

import {
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authStorage } from "@/features/auth/utils/authStorage";

import {
  coachService,
  type CreateCoachPayload,
} from "../services/coach.service";

import type { Coach } from "../types/coach";

type CoachFilter =
  | "all"
  | "active"
  | "inactive";

type CoachSortOption =
  | "name-asc"
  | "name-desc";

const sortOptions: {
  value: CoachSortOption;
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
];

function sortCoaches(
  coaches: Coach[],
  sortOption: CoachSortOption
) {
  return [...coaches].sort((a, b) => {
    if (sortOption === "name-asc") {
      return a.name.localeCompare(b.name);
    }

    if (sortOption === "name-desc") {
      return b.name.localeCompare(a.name);
    }

    return 0;
  });
}

export function CoachesClient() {
  const [coaches, setCoaches] =
    useState<Coach[]>([]);

  const [isLoading, setIsLoading] =
    useState(() =>
      Boolean(authStorage.getToken())
    );

  const [error, setError] =
    useState<string | null>(() =>
      authStorage.getToken()
        ? null
        : "You need to be logged in to view coaches."
    );

  const [
    isCoachFormOpen,
    setIsCoachFormOpen,
  ] = useState(false);

  const [
    editingCoachId,
    setEditingCoachId,
  ] = useState<string | null>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  const [
    deletingCoachId,
    setDeletingCoachId,
  ] = useState<string | null>(null);

  const [searchText, setSearchText] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<CoachFilter>("all");

  const [
    sortOption,
    setSortOption,
  ] =
    useState<CoachSortOption>("name-asc");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [active, setActive] =
    useState(true);

  useEffect(() => {
    let isActive = true;

    const token =
      authStorage.getToken();

    if (!token) return;

    coachService
      .getCoaches(token)
      .then((backendCoaches) => {
        if (!isActive) return;

        setCoaches(backendCoaches);
        setError(null);
      })
      .catch(() => {
        if (!isActive) return;

        setError(
          "Could not load coaches from backend."
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

  const filteredCoaches =
    useMemo(() => {
      const normalizedSearch =
        searchText
          .trim()
          .toLowerCase();

      const matchingCoaches =
        coaches.filter((coach) => {
          const matchesStatus =
            statusFilter === "all" ||
            (statusFilter ===
              "active" &&
              coach.active) ||
            (statusFilter ===
              "inactive" &&
              !coach.active);

          const searchableText = [
            coach.name,
            coach.email ?? "",
            coach.phone ?? "",
            coach.notes ?? "",
          ]
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            normalizedSearch.length === 0 ||
            searchableText.includes(
              normalizedSearch
            );

          return (
            matchesStatus &&
            matchesSearch
          );
        });

      return sortCoaches(
        matchingCoaches,
        sortOption
      );
    }, [
      coaches,
      searchText,
      statusFilter,
      sortOption,
    ]);

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setActive(true);
    setEditingCoachId(null);
  }

  function openNewCoach() {
    resetForm();
    setIsCoachFormOpen(true);
  }

  function handleCancelForm() {
    resetForm();
    setIsCoachFormOpen(false);
  }

  function handleEditCoach(
    coach: Coach
  ) {
    setEditingCoachId(coach.id);

    setName(coach.name);
    setEmail(coach.email ?? "");
    setPhone(coach.phone ?? "");
    setNotes(coach.notes ?? "");
    setActive(coach.active);

    setIsCoachFormOpen(true);
  }

  async function handleSaveCoach(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token =
      authStorage.getToken();

    if (!token) {
      setError(
        "You need to be logged in."
      );
      return;
    }

    const payload:
      CreateCoachPayload = {
      name: name.trim(),

      email:
        email.trim() || undefined,

      phone:
        phone.trim() || undefined,

      notes:
        notes.trim() || undefined,

      active,
    };

    setIsSaving(true);
    setError(null);

    try {
      if (editingCoachId) {
        const updatedCoach =
          await coachService.updateCoach(
            editingCoachId,
            payload,
            token
          );

        setCoaches((current) =>
          current.map((coach) =>
            coach.id ===
            updatedCoach.id
              ? updatedCoach
              : coach
          )
        );
      } else {
        const createdCoach =
          await coachService.createCoach(
            payload,
            token
          );

        setCoaches((current) => [
          createdCoach,
          ...current,
        ]);
      }

      resetForm();
      setIsCoachFormOpen(false);
    } catch {
      setError(
        editingCoachId
          ? "Could not update coach."
          : "Could not create coach."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteCoach(
    coach: Coach
  ) {
    const confirmed =
      window.confirm(
        `Delete ${coach.name}?`
      );

    if (!confirmed) return;

    const token =
      authStorage.getToken();

    if (!token) {
      setError(
        "You need to be logged in."
      );
      return;
    }

    setDeletingCoachId(coach.id);
    setError(null);

    try {
      await coachService.deleteCoach(
        coach.id,
        token
      );

      setCoaches((current) =>
        current.filter(
          (item) =>
            item.id !== coach.id
        )
      );
    } catch {
      setError(
        "Could not delete coach."
      );
    } finally {
      setDeletingCoachId(null);
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
            Coaches
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage coaches available for
            training sessions.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            if (isCoachFormOpen) {
              handleCancelForm();
            } else {
              openNewCoach();
            }
          }}
        >
          <Plus className="h-4 w-4" />
          New Coach
        </Button>
      </header>

      {isLoading && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Loading coaches...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isCoachFormOpen && (
        <Card className="p-6">
          <form
            onSubmit={handleSaveCoach}
            className="space-y-5"
          >
            <div>
              <h2 className="text-xl font-semibold">
                {editingCoachId
                  ? "Edit Coach"
                  : "New Coach"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {editingCoachId
                  ? "Update coach information."
                  : "Add a coach to your squad."}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="coach-name"
                  className="text-sm font-medium"
                >
                  Name
                </label>

                <input
                  id="coach-name"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  required
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="Atli Guðnason"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="coach-email"
                  className="text-sm font-medium"
                >
                  Email
                </label>

                <input
                  id="coach-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="coach@example.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="coach-phone"
                  className="text-sm font-medium"
                >
                  Phone
                </label>

                <input
                  id="coach-phone"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="555-1234"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="coach-notes"
                className="text-sm font-medium"
              >
                Notes
              </label>

              <textarea
                id="coach-notes"
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value
                  )
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
                  setActive(
                    event.target.checked
                  )
                }
              />

              Active coach
            </label>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={
                  handleCancelForm
                }
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  isSaving ||
                  !name.trim()
                }
              >
                {isSaving
                  ? "Saving..."
                  : editingCoachId
                  ? "Save changes"
                  : "Add coach"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 rounded-xl border p-4 lg:grid-cols-[1fr_180px_220px]">
        <div className="space-y-2">
          <label
            htmlFor="coach-search"
            className="text-sm font-medium"
          >
            Search
          </label>

          <input
            id="coach-search"
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
            placeholder="Search name, email, phone..."
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="coach-status"
            className="text-sm font-medium"
          >
            Status
          </label>

          <select
            id="coach-status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target
                  .value as CoachFilter
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="all">
              All
            </option>

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
            htmlFor="coach-sort"
            className="text-sm font-medium"
          >
            Sort
          </label>

          <select
            id="coach-sort"
            value={sortOption}
            onChange={(event) =>
              setSortOption(
                event.target
                  .value as CoachSortOption
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {sortOptions.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          {filteredCoaches.length} of{" "}
          {coaches.length} coaches.
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
      filteredCoaches.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <UserRound className="mx-auto h-8 w-8 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-semibold">
            No coaches found
          </h2>

          <p className="mt-2 text-muted-foreground">
            Add a coach or change your
            filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredCoaches.map(
            (coach) => (
              <Card
                key={coach.id}
                className="p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">
                        {coach.name}
                      </h2>

                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                        {coach.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>
                        {coach.email ??
                          "No email"}
                      </p>

                      <p>
                        {coach.phone ??
                          "No phone"}
                      </p>
                    </div>

                    {coach.notes && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        {coach.notes}
                      </p>
                    )}
                  </div>

                  <div className="ml-auto flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleEditCoach(
                          coach
                        )
                      }
                      aria-label={`Edit ${coach.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteCoach(
                          coach
                        )
                      }
                      disabled={
                        deletingCoachId ===
                        coach.id
                      }
                      aria-label={`Delete ${coach.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}