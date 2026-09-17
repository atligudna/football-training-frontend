"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ChevronDown,
  ChevronUp,
  History,
  LayoutTemplate,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authStorage } from "@/features/auth/utils/authStorage";

import { drills as baseDrills } from "../data/drills";
import { drillService } from "../services/drill.service";
import {
  deleteDrill,
  getAllDrills,
  replaceStoredDrills,
  saveDrill,
  updateDrill,
} from "../utils/drill-storage";
import { EditDrillForm } from "./EditDrillForm";

import type { ActivityType } from "@/features/sessions";
import type { Drill } from "../types/drill";
import type { CreateDrillPayload } from "../services/drill.service";

const drillTypes: ActivityType[] = [
  "drill",
  "station",
  "game",
  "break",
  "reflection",
];

type DrillTypeFilter = ActivityType | "all";

type DrillSortOption =
  | "updated-desc"
  | "created-desc"
  | "title-asc"
  | "duration-asc"
  | "duration-desc";

const drillSortOptions: {
  value: DrillSortOption;
  label: string;
}[] = [
  { value: "updated-desc", label: "Newest updated" },
  { value: "created-desc", label: "Newest created" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "duration-asc", label: "Shortest duration" },
  { value: "duration-desc", label: "Longest duration" },
];

function sortDrills(
  drills: Drill[],
  sortOption: DrillSortOption
): Drill[] {
  return [...drills].sort((a, b) => {
    if (sortOption === "updated-desc") {
      return (
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
      );
    }

    if (sortOption === "created-desc") {
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    }

    if (sortOption === "title-asc") {
      return a.title.localeCompare(b.title);
    }

    if (sortOption === "duration-asc") {
      return a.durationMinutes - b.durationMinutes;
    }

    if (sortOption === "duration-desc") {
      return b.durationMinutes - a.durationMinutes;
    }

    return 0;
  });
}

function getLocalFallbackDrills(): Drill[] {
  return getAllDrills(baseDrills);
}

function textToLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseEquipmentText(text: string) {
  return textToLines(text).map((line) => {
    const [namePart, quantityPart] = line.includes(":")
      ? line.split(":")
      : line.split(",");

    const quantity = Number(quantityPart?.trim() || 1);

    return {
      id: crypto.randomUUID(),
      name: namePart.trim(),
      quantity:
        Number.isFinite(quantity) && quantity > 0
          ? quantity
          : 1,
    };
  });
}

export function DrillBankClient() {
  const [drills, setDrills] = useState<Drill[]>(() => {
    const token = authStorage.getToken();

    return token ? [] : getLocalFallbackDrills();
  });

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<DrillTypeFilter>("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [sortOption, setSortOption] =
    useState<DrillSortOption>("updated-desc");

  const [expandedDrillIds, setExpandedDrillIds] =
    useState<string[]>([]);

  const [isAddDrillOpen, setIsAddDrillOpen] =
    useState(false);

  const [isLoadingBackendDrills, setIsLoadingBackendDrills] =
    useState(() => Boolean(authStorage.getToken()));

  const [backendError, setBackendError] =
    useState<string | null>(null);

  const [isSavingBackendDrill, setIsSavingBackendDrill] =
    useState(false);

  const [deletingDrillId, setDeletingDrillId] =
    useState<string | null>(null);

  const [editingDrillId, setEditingDrillId] =
    useState<string | null>(null);

  const [isUpdatingBackendDrill, setIsUpdatingBackendDrill] =
    useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] =
    useState<ActivityType>("drill");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] =
    useState(10);
  const [ageGroup, setAgeGroup] = useState("U12");
  const [tagsText, setTagsText] = useState("");
  const [coachingPointsText, setCoachingPointsText] =
    useState("");
  const [equipmentText, setEquipmentText] = useState("");

  useEffect(() => {
    let isActive = true;

    const token = authStorage.getToken();

    if (!token) return;

    drillService
      .getDrills(token)
      .then((backendDrills) => {
        if (!isActive) return;

        setDrills(backendDrills);
        replaceStoredDrills(backendDrills);
        setBackendError(null);
      })
      .catch(() => {
        if (!isActive) return;

        setDrills(getLocalFallbackDrills());
        setBackendError(
          "Could not load drills from backend. Showing local fallback drills."
        );
      })
      .finally(() => {
        if (!isActive) return;

        setIsLoadingBackendDrills(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const availableTags = useMemo(() => {
    const tags = drills.flatMap((drill) => drill.tags);

    return Array.from(new Set(tags)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [drills]);

  const filteredDrills = useMemo(() => {
    const normalizedSearch =
      searchText.trim().toLowerCase();

    const matchingDrills = drills.filter((drill) => {
      const matchesType =
        typeFilter === "all" ||
        drill.type === typeFilter;

      const matchesTag =
        tagFilter === "all" ||
        drill.tags.includes(tagFilter);

      const searchableText = [
        drill.title,
        drill.description,
        drill.ageGroup ?? "",
        drill.type,
        drill.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableText.includes(normalizedSearch);

      return matchesType && matchesTag && matchesSearch;
    });

    return sortDrills(matchingDrills, sortOption);
  }, [
    drills,
    searchText,
    typeFilter,
    tagFilter,
    sortOption,
  ]);

  function resetForm() {
    setTitle("");
    setType("drill");
    setDescription("");
    setDurationMinutes(10);
    setAgeGroup("U12");
    setTagsText("");
    setCoachingPointsText("");
    setEquipmentText("");
  }

  function clearFilters() {
    setSearchText("");
    setTypeFilter("all");
    setTagFilter("all");
  }

  const hasActiveFilters =
    searchText.trim().length > 0 ||
    typeFilter !== "all" ||
    tagFilter !== "all";

  function isDrillExpanded(drillId: string) {
    return expandedDrillIds.includes(drillId);
  }

  function toggleDrillExpanded(drillId: string) {
    setExpandedDrillIds((current) =>
      current.includes(drillId)
        ? current.filter((id) => id !== drillId)
        : [...current, drillId]
    );
  }

  function shouldCollapseDrill(drill: Drill) {
    return (
      drill.description.length > 160 ||
      drill.coachingPoints.length > 3 ||
      drill.equipment.length > 3 ||
      drill.tags.length > 4
    );
  }

  async function handleAddDrill(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const safeDurationMinutes =
      Number.isFinite(durationMinutes) &&
      durationMinutes > 0
        ? durationMinutes
        : 1;

    const drillPayload: CreateDrillPayload = {
      title: title.trim(),
      type,
      description: description.trim(),
      durationMinutes: safeDurationMinutes,
      ageGroup: ageGroup.trim() || undefined,
      tags: tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      coachingPoints: textToLines(
        coachingPointsText
      ).map((text) => ({
        id: crypto.randomUUID(),
        text,
      })),
      equipment: parseEquipmentText(equipmentText),
    };

    const token = authStorage.getToken();

    if (!token) {
      const now = new Date().toISOString();

      const localDrill: Drill = {
        ...drillPayload,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };

      saveDrill(localDrill);

      setDrills((current) => [
        localDrill,
        ...current,
      ]);

      resetForm();
      setIsAddDrillOpen(false);
      return;
    }

    setIsSavingBackendDrill(true);
    setBackendError(null);

    try {
      const savedDrill =
        await drillService.createDrill(
          drillPayload,
          token
        );

      saveDrill(savedDrill);

      setDrills((current) => [
        savedDrill,
        ...current.filter(
          (drill) => drill.id !== savedDrill.id
        ),
      ]);

      resetForm();
      setIsAddDrillOpen(false);
    } catch {
      setBackendError(
        "Could not save drill to backend."
      );
    } finally {
      setIsSavingBackendDrill(false);
    }
  }

  function handleCancelAddDrill() {
    resetForm();
    setIsAddDrillOpen(false);
  }

  async function handleDeleteDrill(drill: Drill) {
    const confirmed = window.confirm(
      `Delete "${drill.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const token = authStorage.getToken();

    if (!token) {
      deleteDrill(drill.id);

      setDrills((current) =>
        current.filter(
          (item) => item.id !== drill.id
        )
      );

      setExpandedDrillIds((current) =>
        current.filter(
          (drillId) => drillId !== drill.id
        )
      );

      return;
    }

    setDeletingDrillId(drill.id);
    setBackendError(null);

    try {
      await drillService.deleteDrill(
        drill.id,
        token
      );

      deleteDrill(drill.id);

      setDrills((current) =>
        current.filter(
          (item) => item.id !== drill.id
        )
      );

      setExpandedDrillIds((current) =>
        current.filter(
          (drillId) => drillId !== drill.id
        )
      );
    } catch {
      setBackendError(
        "Could not delete drill from backend."
      );
    } finally {
      setDeletingDrillId(null);
    }
  }

  async function handleSaveEditedDrill(
    updatedDrill: Drill
  ) {
    const token = authStorage.getToken();

    if (!token) {
      updateDrill(updatedDrill);

      setDrills((current) =>
        current.map((drill) =>
          drill.id === updatedDrill.id
            ? updatedDrill
            : drill
        )
      );

      setEditingDrillId(null);
      return;
    }

    setIsUpdatingBackendDrill(true);
    setBackendError(null);

    try {
      const savedDrill =
        await drillService.updateDrill(
          updatedDrill.id,
          {
            title: updatedDrill.title,
            type: updatedDrill.type,
            description:
              updatedDrill.description,
            durationMinutes:
              updatedDrill.durationMinutes,
            ageGroup: updatedDrill.ageGroup,
            tags: updatedDrill.tags,
            coachingPoints:
              updatedDrill.coachingPoints,
            equipment: updatedDrill.equipment,
          },
          token
        );

      updateDrill(savedDrill);

      setDrills((current) =>
        current.map((drill) =>
          drill.id === savedDrill.id
            ? savedDrill
            : drill
        )
      );

      setEditingDrillId(null);
    } catch {
      setBackendError(
        "Could not update drill in backend."
      );
    } finally {
      setIsUpdatingBackendDrill(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Drill Bank
          </h1>

          <p className="mt-2 text-muted-foreground">
            Store reusable football drills for future
            training stories.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/drills/history">
            <Button
              type="button"
              variant="secondary"
            >
              <History className="h-4 w-4" />
              View History
            </Button>
          </Link>

          <Link href="/drills/templates">
            <Button
              type="button"
              variant="secondary"
            >
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </Button>
          </Link>

          <Button
            type="button"
            onClick={() =>
              setIsAddDrillOpen(
                (current) => !current
              )
            }
            aria-expanded={isAddDrillOpen}
          >
            <Plus className="h-4 w-4" />
            New Drill
          </Button>
        </div>
      </header>

      {isLoadingBackendDrills && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Loading drills from backend...
        </div>
      )}

      {backendError && (
        <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {backendError}
        </div>
      )}

      {isSavingBackendDrill && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Saving drill to backend...
        </div>
      )}

      {isAddDrillOpen && (
        <section className="rounded-xl border">
          <form
            onSubmit={handleAddDrill}
            className="space-y-5 p-6"
          >
            <div>
              <h2 className="text-xl font-semibold">
                New Drill
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a reusable drill for your
                training bank.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="drill-title"
                  className="text-sm font-medium"
                >
                  Title
                </label>

                <input
                  id="drill-title"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  required
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="4v1 Rondo"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="drill-type"
                  className="text-sm font-medium"
                >
                  Type
                </label>

                <select
                  id="drill-type"
                  value={type}
                  onChange={(event) =>
                    setType(
                      event.target
                        .value as ActivityType
                    )
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  {drillTypes.map((drillType) => (
                    <option
                      key={drillType}
                      value={drillType}
                    >
                      {drillType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="drill-duration"
                  className="text-sm font-medium"
                >
                  Duration
                </label>

                <input
                  id="drill-duration"
                  type="number"
                  min={1}
                  value={durationMinutes}
                  onChange={(event) =>
                    setDurationMinutes(
                      Number(event.target.value)
                    )
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="drill-age-group"
                  className="text-sm font-medium"
                >
                  Age group
                </label>

                <input
                  id="drill-age-group"
                  value={ageGroup}
                  onChange={(event) =>
                    setAgeGroup(event.target.value)
                  }
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  placeholder="U12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="drill-description"
                className="text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="drill-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={3}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Describe setup and rules..."
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="drill-tags"
                className="text-sm font-medium"
              >
                Tags
              </label>

              <input
                id="drill-tags"
                value={tagsText}
                onChange={(event) =>
                  setTagsText(event.target.value)
                }
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                placeholder="passing, first touch, scanning"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="drill-coaching-points"
                  className="text-sm font-medium"
                >
                  Coaching points
                </label>

                <textarea
                  id="drill-coaching-points"
                  value={coachingPointsText}
                  onChange={(event) =>
                    setCoachingPointsText(
                      event.target.value
                    )
                  }
                  rows={4}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder={
                    "Open body shape\nMove after passing"
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="drill-equipment"
                  className="text-sm font-medium"
                >
                  Equipment
                </label>

                <textarea
                  id="drill-equipment"
                  value={equipmentText}
                  onChange={(event) =>
                    setEquipmentText(
                      event.target.value
                    )
                  }
                  rows={4}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  placeholder={
                    "Balls: 8\nCones: 12"
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelAddDrill}
                disabled={isSavingBackendDrill}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSavingBackendDrill}
              >
                <Plus className="h-4 w-4" />
                {isSavingBackendDrill
                  ? "Saving..."
                  : "Add drill"}
              </Button>
            </div>
          </form>
        </section>
      )}

      <div className="grid gap-4 rounded-xl border p-4 lg:grid-cols-[1fr_180px_180px_220px]">
        <div className="space-y-2">
          <label
            htmlFor="drill-search"
            className="text-sm font-medium"
          >
            Search
          </label>

          <input
            id="drill-search"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Search title, tag, age group..."
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="drill-type-filter"
            className="text-sm font-medium"
          >
            Type
          </label>

          <select
            id="drill-type-filter"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target
                  .value as DrillTypeFilter
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm capitalize"
          >
            <option value="all">All</option>

            {drillTypes.map((drillType) => (
              <option
                key={drillType}
                value={drillType}
              >
                {drillType}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="drill-tag-filter"
            className="text-sm font-medium"
          >
            Tag
          </label>

          <select
            id="drill-tag-filter"
            value={tagFilter}
            onChange={(event) =>
              setTagFilter(event.target.value)
            }
            disabled={availableTags.length === 0}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="all">
              {availableTags.length === 0
                ? "No tags yet"
                : "All tags"}
            </option>

            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="drill-sort"
            className="text-sm font-medium"
          >
            Sort
          </label>

          <select
            id="drill-sort"
            value={sortOption}
            onChange={(event) =>
              setSortOption(
                event.target
                  .value as DrillSortOption
              )
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {drillSortOptions.map((option) => (
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
          Showing {filteredDrills.length} of{" "}
          {drills.length} drills.
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

      {filteredDrills.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold">
            No drills found
          </h2>

          <p className="mt-2 text-muted-foreground">
            Try changing your search text, type or
            tag filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredDrills.map((drill) => {
            const isExpanded =
              isDrillExpanded(drill.id);

            const isCollapsible =
              shouldCollapseDrill(drill);

            const shouldShowFullContent =
              !isCollapsible || isExpanded;

            if (editingDrillId === drill.id) {
              return (
                <Card
                  key={drill.id}
                  className="p-6"
                >
                  <EditDrillForm
                    drill={drill}
                    onSave={handleSaveEditedDrill}
                    onCancel={() =>
                      setEditingDrillId(null)
                    }
                    isSaving={
                      isUpdatingBackendDrill
                    }
                  />
                </Card>
              );
            }

            return (
              <Card
                key={drill.id}
                className="p-6"
              >
                <div className="flex w-full items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {drill.ageGroup ??
                        "No age group"}{" "}
                      · {drill.type} ·{" "}
                      {drill.durationMinutes} min
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      {drill.title}
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {drill.description}
                    </p>
                  </div>

                  <div className="ml-auto flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setEditingDrillId(
                          drill.id
                        )
                      }
                      aria-label={`Edit ${drill.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteDrill(drill)
                      }
                      disabled={
                        deletingDrillId === drill.id
                      }
                      aria-label={`Delete ${drill.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {drill.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {drill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {shouldShowFullContent &&
                  drill.coachingPoints.length >
                    0 && (
                    <div className="mt-5 border-t pt-4">
                      <p className="mb-2 text-sm font-medium">
                        Coaching points
                      </p>

                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {drill.coachingPoints.map(
                          (point) => (
                            <li key={point.id}>
                              ✓ {point.text}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {shouldShowFullContent &&
                  drill.equipment.length > 0 && (
                    <div className="mt-5 border-t pt-4">
                      <p className="mb-2 text-sm font-medium">
                        Equipment
                      </p>

                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {drill.equipment.map(
                          (item) => (
                            <li key={item.id}>
                              {item.name}:{" "}
                              {item.quantity}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {isCollapsible && (
                  <div className="mt-5 border-t pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        toggleDrillExpanded(
                          drill.id
                        )
                      }
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Show more
                        </>
                      )}
                    </Button>
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