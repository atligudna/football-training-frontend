"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Layers, Plus, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authStorage } from "@/features/auth/utils/authStorage";

import { trainingStoryTemplates } from "../data/training-story-templates";
import { trainingStoryService } from "../services/training-story.service";
import { createTrainingStoryFromTemplate } from "../utils/create-training-story-from-template";
import { saveTrainingStory } from "../utils/training-story-storage";

export function TrainingStoryTemplatesClient() {
  const router = useRouter();

  const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(
    null
  );
  const [backendError, setBackendError] = useState<string | null>(null);

  async function handleCreateFromTemplate(templateId: string) {
    if (creatingTemplateId) return;

    const token = authStorage.getToken();

    if (!token) {
      setBackendError("You need to be logged in to create from a template.");
      return;
    }

    const template = trainingStoryTemplates.find((item) => item.id === templateId);

    if (!template) return;

    const story = createTrainingStoryFromTemplate(template);

    setCreatingTemplateId(templateId);
    setBackendError(null);

    try {
      const savedStory = await trainingStoryService.createFullTrainingStory(
        story,
        token
      );

      saveTrainingStory(savedStory);
      router.push(`/sessions/${savedStory.id}`);
    } catch {
      setBackendError(
        "Could not create this template training story in backend. No training story was created."
      );
    } finally {
      setCreatingTemplateId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/sessions">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4" />
            Back to Training Stories
          </Button>
        </Link>
      </div>

      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Training Story Templates
        </h1>
        <p className="mt-2 text-muted-foreground">
          Start from a ready-made training structure and adjust it to your group.
        </p>
      </header>

      {backendError && (
        <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {backendError}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {trainingStoryTemplates.map((template) => {
          const pitchCount = template.pitches.length;
          const blockCount = template.pitches.reduce(
            (total, pitch) => total + pitch.activityBlocks.length,
            0
          );
          const isCreatingThisTemplate = creatingTemplateId === template.id;

          return (
            <Card key={template.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {template.ageGroup} · {template.theme}
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    {template.title}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  Template
                </span>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{template.durationMinutes} min</span>
                </div>

                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>{pitchCount} pitch</span>
                </div>

                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>{blockCount} blocks</span>
                </div>
              </div>

              <div className="mt-5 border-t pt-4">
                <p className="mb-2 text-sm font-medium">Objectives</p>

                <ul className="space-y-1 text-sm text-muted-foreground">
                  {template.objectives.map((objective) => (
                    <li key={objective}>✓ {objective}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex justify-end border-t pt-4">
                <Button
                  type="button"
                  onClick={() => handleCreateFromTemplate(template.id)}
                  disabled={creatingTemplateId !== null}
                >
                  <Plus className="h-4 w-4" />
                  {isCreatingThisTemplate
                    ? "Creating..."
                    : "Create from template"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}