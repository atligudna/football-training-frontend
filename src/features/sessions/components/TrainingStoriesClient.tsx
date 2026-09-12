"use client";

import { useEffect, useMemo, useState } from "react";

import { authStorage } from "@/features/auth/utils/authStorage";

import { trainingStories } from "../data/training-stories";
import { trainingStoryService } from "../services/training-story.service";
import { getAllTrainingStories } from "../utils/training-story-storage";
import { TrainingStoryList } from "./TrainingStoryList";

import type {
  TrainingStory,
  TrainingStoryStatus,
} from "../types/training-story";

type StatusFilter = TrainingStoryStatus | "all";

type SortOption =
  | "updated-desc"
  | "created-desc"
  | "title-asc"
  | "duration-asc"
  | "duration-desc";

const statusOptions: StatusFilter[] = [
  "all",
  "draft",
  "planned",
  "active",
  "completed",
  "archived",
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "updated-desc", label: "Newest updated" },
  { value: "created-desc", label: "Newest created" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "duration-asc", label: "Shortest duration" },
  { value: "duration-desc", label: "Longest duration" },
];

function getInitialTrainingStories(): TrainingStory[] {
  return getAllTrainingStories(trainingStories);
}

function mergeBackendAndLocalStories(
  backendStories: TrainingStory[],
  localStories: TrainingStory[]
): TrainingStory[] {
  const backendIds = new Set(backendStories.map((story) => story.id));

  const localOnlyStories = localStories.filter(
    (story) => !backendIds.has(story.id)
  );

  return [...backendStories, ...localOnlyStories];
}

function sortTrainingStories(
  stories: TrainingStory[],
  sortOption: SortOption
): TrainingStory[] {
  return [...stories].sort((a, b) => {
    if (sortOption === "updated-desc") {
      return (
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    if (sortOption === "created-desc") {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

export function TrainingStoriesClient() {
  const [stories, setStories] = useState<TrainingStory[]>(
    getInitialTrainingStories
  );

  const [isLoadingBackendStories, setIsLoadingBackendStories] = useState(() =>
    Boolean(authStorage.getToken())
  );

  const [backendError, setBackendError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("updated-desc");

  useEffect(() => {
    let isActive = true;

    const token = authStorage.getToken();

    if (!token) return;

    trainingStoryService
      .getTrainingStories(token)
      .then((backendStories) => {
        if (!isActive) return;

        setStories((currentStories) =>
          mergeBackendAndLocalStories(backendStories, currentStories)
        );

        setBackendError(null);
      })
      .catch(() => {
        if (!isActive) return;

        setBackendError(
          "Could not load training stories from backend. Showing local stories."
        );
      })
      .finally(() => {
        if (!isActive) return;

        setIsLoadingBackendStories(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const availableTags = useMemo(() => {
    const tags = stories.flatMap((story) => story.tags ?? []);
    return Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b));
  }, [stories]);

  const filteredStories = useMemo(() => {
    const normalizedSearchText = searchText.trim().toLowerCase();

    const matchingStories = stories.filter((story) => {
      const matchesStatus =
        statusFilter === "all" || story.status === statusFilter;

      const matchesTag =
        tagFilter === "all" || Boolean(story.tags?.includes(tagFilter));

      const searchableText = [
        story.title,
        story.description,
        story.ageGroup,
        story.theme ?? "",
        story.status,
        story.tags?.join(" ") ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearchText.length === 0 ||
        searchableText.includes(normalizedSearchText);

      return matchesStatus && matchesTag && matchesSearch;
    });

    return sortTrainingStories(matchingStories, sortOption);
  }, [searchText, statusFilter, tagFilter, sortOption, stories]);

  function clearFilters() {
    setSearchText("");
    setStatusFilter("all");
    setTagFilter("all");
  }

  const hasActiveFilters =
    searchText.trim().length > 0 ||
    statusFilter !== "all" ||
    tagFilter !== "all";

  return (
    <div className="space-y-6">
      {isLoadingBackendStories && (
        <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Loading training stories from backend...
        </div>
      )}

      {backendError && (
        <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {backendError}
        </div>
      )}

      <div className="grid gap-4 rounded-xl border p-4 lg:grid-cols-[1fr_180px_180px_220px]">
        <div className="space-y-2">
          <label htmlFor="training-story-search" className="text-sm font-medium">
            Search
          </label>

          <input
            id="training-story-search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search title, theme, tag, age group..."
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="training-story-status" className="text-sm font-medium">
            Status
          </label>

          <select
            id="training-story-status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm capitalize"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="training-story-tag" className="text-sm font-medium">
            Tag
          </label>

          <select
            id="training-story-tag"
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
            disabled={availableTags.length === 0}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="all">
              {availableTags.length === 0 ? "No tags yet" : "All tags"}
            </option>

            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="training-story-sort" className="text-sm font-medium">
            Sort
          </label>

          <select
            id="training-story-sort"
            value={sortOption}
            onChange={(event) =>
              setSortOption(event.target.value as SortOption)
            }
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredStories.length} of {stories.length} training stories.
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

      {filteredStories.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold">No training stories found</h2>
          <p className="mt-2 text-muted-foreground">
            Try changing your search text, status filter or tag filter.
          </p>
        </div>
      ) : (
        <TrainingStoryList stories={filteredStories} />
      )}
    </div>
  );
}