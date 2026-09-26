import Link from "next/link";

import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { getTrainingStoryWarnings } from "../utils/training-story-validation";

import type { TrainingStory } from "../types/training-story";

interface RunTrainingReadinessProps {
  story: TrainingStory;
}

export function RunTrainingReadiness({
  story,
}: RunTrainingReadinessProps) {
  const warnings =
    getTrainingStoryWarnings(story);

  if (warnings.length === 0) {
    return (
      <section className="rounded-xl border p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">
              Ready to train
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Groups, coaches and pitch setup
              are ready.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            Check setup before training
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            You can continue, but these items
            may need attention.
          </p>

          <ul className="mt-3 space-y-1.5">
            {warnings.map(
              (warning) => (
                <li
                  key={warning.id}
                  className="text-sm"
                >
                  • {warning.message}
                </li>
              )
            )}
          </ul>

          <div className="mt-4">
            <Link
              href={`/sessions/${story.id}`}
            >
              <Button
                type="button"
                variant="secondary"
              >
                Back to plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}