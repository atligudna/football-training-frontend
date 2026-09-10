"use client";

import { useMemo, useState } from "react";

import { trainingStories } from "../data/training-stories";
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
  const [stories] = useState<TrainingStory[]>(getInitialTrainingStories);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("updated-desc");

  const filteredStories = useMemo(() => {
    const normalizedSearchText = searchText.trim().toLowerCase();

    const matchingStories = stories.filter((story) => {
      const matchesStatus =
        statusFilter === "all" || story.status === statusFilter;

      const searchableText = [
        story.title,
        story.description,
        story.ageGroup,
        story.theme ?? "",
        story.status,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearchText.length === 0 ||
        searchableText.includes(normalizedSearchText);

      return matchesStatus && matchesSearch;
    });

    return sortTrainingStories(matchingStories, sortOption);
  }, [searchText, statusFilter, sortOption, stories]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-xl border p-4 md:grid-cols-[1fr_220px_220px]">
        <div className="space-y-2">
          <label htmlFor="training-story-search" className="text-sm font-medium">
            Search
          </label>

          <input
            id="training-story-search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search title, theme, age group..."
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

        {(searchText || statusFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearchText("");
              setStatusFilter("all");
            }}
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
            Try changing your search text or status filter.
          </p>
        </div>
      ) : (
        <TrainingStoryList stories={filteredStories} />
      )}
    </div>
  );
}