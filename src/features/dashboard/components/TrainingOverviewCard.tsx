import { Card } from "@/components/ui/card";

import type { TrainingBlock } from "../../sessions/types/trainingBlock";

const trainingBlocks: TrainingBlock[] = [
  {
    id: 1,
    start: "18:00",
    title: "Warm-up",
    duration: 10,
  },
  {
    id: 2,
    start: "18:10",
    title: "Passing & Receiving",
    duration: 15,
  },
  {
    id: 3,
    start: "18:25",
    title: "Possession",
    duration: 20,
  },
  {
    id: 4,
    start: "18:45",
    title: "Small-sided Game",
    duration: 30,
  },
  {
    id: 5,
    start: "19:15",
    title: "Finishing",
    duration: 15,
  },
  {
    id: 6,
    start: "19:30",
    title: "Cool Down",
    duration: 10,
  },
];

export default function TrainingOverviewCard() {
  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Training Overview
      </h2>

      <div className="space-y-3">
        {trainingBlocks.map((block) => (
          <div
            key={block.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-4">
              <span className="w-16 text-sm font-medium text-muted-foreground">
                {block.start}
              </span>

              <span className="font-medium">
                {block.title}
              </span>
            </div>

            <span className="text-sm text-muted-foreground">
              {block.duration} min
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}