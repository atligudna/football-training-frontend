import Link from "next/link";
import { ClipboardCheck, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { TrainingStory } from "../types/training-story";

interface TrainingReviewCardProps {
  story: TrainingStory;
}

function formatCompletedAt(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export function TrainingReviewCard({ story }: TrainingReviewCardProps) {
  const review = story.review;

  if (!review) {
    return (
      <section className="rounded-xl border border-dashed p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Training review</h2>
            <p className="mt-2 text-muted-foreground">
              No review has been added for this training story yet.
            </p>
          </div>

          <Link href={`/sessions/${story.id}/review`}>
            <Button type="button" variant="secondary">
              Add review
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Training review</h2>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Completed: {formatCompletedAt(review.completedAt)}
          </p>
        </div>

        <Link href={`/sessions/${story.id}/review`}>
          <Button type="button" variant="secondary">
            Edit review
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Rating:
        </span>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-5 w-5 ${
                index < review.overallRating
                  ? "fill-current"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>

        <span className="text-sm text-muted-foreground">
          {review.overallRating}/5
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-muted p-4">
          <h3 className="font-semibold">What went well?</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {review.wentWell || "No notes added."}
          </p>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <h3 className="font-semibold">Improve next time</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {review.improveNextTime || "No notes added."}
          </p>
        </div>
      </div>

      {review.notes && (
        <div className="mt-4 rounded-lg bg-muted p-4">
          <h3 className="font-semibold">Notes</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {review.notes}
          </p>
        </div>
      )}
    </section>
  );
}