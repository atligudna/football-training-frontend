"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const objectives = objectivesText
      .split("\n")
      .map((objective) => objective.trim())
      .filter(Boolean);

    const story: TrainingStory = {
      id: crypto.randomUUID(),
      title,
      description,
      ageGroup,
      durationMinutes: Number(durationMinutes),
      theme,
      tags: parseTagsText(tagsText),
      objectives,
      status: "draft",
      pitches: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveTrainingStory(story);

    router.push("/sessions");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
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
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="training-story-tags" className="text-sm font-medium">
            Tags
          </label>

          <input
            id="training-story-tags"
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            placeholder="passing, finishing, 1v1"
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
          className="min-h-32 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-xs text-muted-foreground">
          Put each objective on a new line.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">Create Training Story</Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/sessions")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}