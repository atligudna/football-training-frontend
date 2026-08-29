import { Clock, Dumbbell, Layers, ListChecks, Map } from "lucide-react";

import { getTrainingStorySummary } from "../utils/training-story-summary";

import type { TrainingStory } from "../types/training-story";

interface TrainingStorySummaryCardsProps {
  story: TrainingStory;
}

export function TrainingStorySummaryCards({
  story,
}: TrainingStorySummaryCardsProps) {
  const summary = getTrainingStorySummary(story);

  const cards = [
    {
      label: "Duration",
      value: `${summary.totalDurationMinutes} min`,
      icon: Clock,
    },
    {
      label: "Pitches",
      value: summary.pitchCount,
      icon: Map,
    },
    {
      label: "Blocks",
      value: summary.activityBlockCount,
      icon: Layers,
    },
    {
      label: "Activities",
      value: summary.activityCount,
      icon: ListChecks,
    },
    {
      label: "Equipment",
      value: summary.equipmentCount,
      icon: Dumbbell,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.label} className="rounded-xl border p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </div>
        );
      })}
    </section>
  );
}