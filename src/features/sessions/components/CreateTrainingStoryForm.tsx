"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authStorage } from "@/features/auth/utils/authStorage";

import { trainingStoryService } from "../services/training-story.service";
import { saveTrainingStory } from "../utils/training-story-storage";
import { parseTagsText } from "../utils/tags-parser";
import type { TrainingStory } from "../types/training-story";

export function CreateTrainingStoryForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("90");
  const [theme, setTheme] = useState("");
  const [objectivesText, setObjectivesText] = useState("");
  const [tagsText, setTagsText] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = authStorage.getToken();

    if (!token) {
      setCreateError("You need to be logged in to create a backend training story.");
      return;
    }

    const now = new Date().toISOString();

    const objectives = objectivesText
      .split("\n")
      .map((objective) => objective.trim())
      .filter(Boolean);

    const story: TrainingStory = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      ageGroup: ageGroup.trim(),
      durationMinutes: Number(durationMinutes),
      theme: theme.trim() || undefined,
      tags: parseTagsText(tagsText),
      objectives,
      status: "draft",
      pitches: [],
      createdAt: now,
      updatedAt: now,
    };

    setIsCreating(true);
    setCreateError(null);

    try {
      const savedStory = await trainingStoryService.createFullTrainingStory(
        story,
        token
      );

      saveTrainingStory(savedStory);

      router.push(`/sessions/${savedStory.id}`);
    } catch {
      setCreateError(
        "Could not create this training story in backend. Check that backend is running and try again."
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {createError && (
        <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {createError}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="title">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Monday Training"
            required
            disabled={isCreating}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="ageGroup">
            Age group
          </label>
          <Input
            id="ageGroup"
            value={ageGroup}
            onChange={(event) => setAgeGroup(event.target.value)}
            placeholder="U11"
            required
            disabled={isCreating}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="description">
          Description
        </label>
        <Input
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Passing and possession"
          required
          disabled={isCreating}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="durationMinutes">
            Duration minutes
          </label>
          <Input
            id="durationMinutes"
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
            disabled={isCreating}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="theme">
            Theme
          </label>
          <Input
            id="theme"
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            placeholder="Passing"
            disabled={isCreating}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="training-story-tags" className="text-sm font-medium">
            Tags
          </label>

          <input
            id="training-story-tags"
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="passing, finishing, 1v1"
            disabled={isCreating}
          />

          <p className="text-xs text-muted-foreground">
            Separate tags with commas.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="objectives">
          Objectives
        </label>
        <textarea
          id="objectives"
          value={objectivesText}
          onChange={(event) => setObjectivesText(event.target.value)}
          placeholder={"Open your body\nPass to the far foot\nMove after passing"}
          className="min-h-32 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isCreating}
        />
        <p className="text-xs text-muted-foreground">
          Put each objective on a new line.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Training Story"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/sessions")}
          disabled={isCreating}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}