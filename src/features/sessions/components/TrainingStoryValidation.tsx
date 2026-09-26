import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { getTrainingStoryWarnings } from "../utils/training-story-validation";

import type { TrainingStory } from "../types/training-story";

interface TrainingStoryValidationProps {
  story: TrainingStory;
}

export function TrainingStoryValidation({
  story,
}: TrainingStoryValidationProps) {
  const warnings =
    getTrainingStoryWarnings(story);

  if (warnings.length === 0) {
    return (
      <section className="rounded-xl border p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <h2 className="font-semibold">
              Training setup ready
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              All pitches have a player group,
              coach and activity setup.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">
            Training setup checks
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {warnings.length}{" "}
            {warnings.length === 1
              ? "item needs"
              : "items need"}{" "}
            attention.
          </p>

          <ul className="mt-4 space-y-2">
            {warnings.map(
              (warning) => (
                <li
                  key={warning.id}
                  className="flex gap-2 text-sm"
                >
                  <span aria-hidden="true">
                    •
                  </span>

                  <span>
                    {warning.message}
                  </span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}