"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { TrainingStory } from "../types/training-story";

interface EditTrainingStoryFormProps {
  story: TrainingStory;
  onSaveTrainingStory: (story: TrainingStory) => void;
  onCancel: () => void;
}

function objectivesToText(objectives: string[]) {
  return objectives.join("\n");
}

export function EditTrainingStoryForm({
  story,
  onSaveTrainingStory,
  onCancel,
}: EditTrainingStoryFormProps) {
  const [title, setTitle] = useState(story.title);
  const [description, setDescription] = useState(story.description);
  const [ageGroup, setAgeGroup] = useState(story.ageGroup);
  const [durationMinutes, setDurationMinutes] = useState(
    String(story.durationMinutes)
  );
  const [theme, setTheme] = useState(story.theme ?? "");
  const [objectivesText, setObjectivesText] = useState(
    objectivesToText(story.objectives)
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updatedStory: TrainingStory = {
      ...story,
      title,
      description,
      ageGroup,
      durationMinutes: Number(durationMinutes),
      theme: theme.trim() || undefined,
      objectives: objectivesText
        .split("\n")
        .map((objective) => objective.trim())
        .filter(Boolean),
      updatedAt: new Date().toISOString(),
    };

    onSaveTrainingStory(updatedStory);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">Edit Training Story</h2>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="edit-story-title">
            Title
          </label>

          <Input
            id="edit-story-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="edit-story-age-group">
            Age group
          </label>

          <Input
            id="edit-story-age-group"
            value={ageGroup}
            onChange={(event) => setAgeGroup(event.target.value)}
            required
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <label className="text-sm font-medium" htmlFor="edit-story-description">
          Description
        </label>

        <Input
          id="edit-story-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="edit-story-duration">
            Duration minutes
          </label>

          <Input
            id="edit-story-duration"
            type="number"
            min="1"
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="edit-story-theme">
            Theme
          </label>

          <Input
            id="edit-story-theme"
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            placeholder="Passing"
          />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <label className="text-sm font-medium" htmlFor="edit-story-objectives">
          Objectives
        </label>

        <textarea
          id="edit-story-objectives"
          value={objectivesText}
          onChange={(event) => setObjectivesText(event.target.value)}
          className="min-h-32 w-full rounded-md border bg-background px-3 py-2 text-sm"
        />

        <p className="text-xs text-muted-foreground">
          One objective per line.
        </p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button type="submit">Save Training Story</Button>

        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}