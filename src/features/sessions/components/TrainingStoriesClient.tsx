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

const statusOptions: StatusFilter[] = [
  "all",
  "draft",
  "planned",
  "active",
  "completed",
  "archived",
];

function getInitialTrainingStories(): TrainingStory[] {
  return getAllTrainingStories(trainingStories);
}

export function TrainingStoriesClient() {
  const [stories] = useState<TrainingStory[]>(getInitialTrainingStories);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredStories = useMemo(() => {
    const normalizedSearchText = searchText.trim().toLowerCase();

    return stories.filter((story) => {
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
  }, [searchText, statusFilter, stories]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-xl border p-4 md:grid-cols-[1fr_220px]">
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
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredStories.length} of {stories.length} training stories.
      </p>

      <TrainingStoryList stories={filteredStories} />
    </div>
  );
}