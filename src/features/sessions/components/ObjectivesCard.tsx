import type { TrainingStory } from "../types/training-story";

interface ObjectivesCardProps {
  story: TrainingStory;
}

export function ObjectivesCard({ story }: ObjectivesCardProps) {
  return (
    <section className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">Objectives</h2>

      {story.objectives.length === 0 ? (
        <p className="mt-4 text-muted-foreground">
          No objectives added yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-2 text-muted-foreground">
          {story.objectives.map((objective) => (
            <li key={objective}>✓ {objective}</li>
          ))}
        </ul>
      )}
    </section>
  );
}