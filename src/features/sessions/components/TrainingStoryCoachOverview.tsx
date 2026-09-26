import {
  Map as MapIcon,
  UserRound,
} from "lucide-react";

import type {
  Pitch,
  TrainingStory,
} from "../types/training-story";

interface TrainingStoryCoachOverviewProps {
  story: TrainingStory;
}

interface CoachPitchGroup {
  key: string;
  coachName: string;
  pitches: Pitch[];
  isLegacy: boolean;
}

function getCoachGroups(
  story: TrainingStory
): CoachPitchGroup[] {
  const groups =
    new Map<string, CoachPitchGroup>();

  for (const pitch of story.pitches) {
    if (!pitch.coachName?.trim()) {
      continue;
    }

    const key = pitch.coachId
      ? `id:${pitch.coachId}`
      : `legacy:${pitch.coachName
          .trim()
          .toLowerCase()}`;

    const existing = groups.get(key);

    if (existing) {
      existing.pitches.push(pitch);
      continue;
    }

    groups.set(key, {
      key,
      coachName: pitch.coachName,
      pitches: [pitch],
      isLegacy: !pitch.coachId,
    });
  }

  return [...groups.values()].sort(
    (a, b) =>
      a.coachName.localeCompare(
        b.coachName
      )
  );
}

export function TrainingStoryCoachOverview({
  story,
}: TrainingStoryCoachOverviewProps) {
  const coachGroups =
    getCoachGroups(story);

  if (coachGroups.length === 0) {
    return (
      <section className="rounded-xl border border-dashed p-6">
        <div className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-muted-foreground" />

          <h2 className="text-xl font-semibold">
            Coaches
          </h2>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          No coaches are assigned to
          pitches yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border p-6">
      <div>
        <div className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-muted-foreground" />

          <h2 className="text-xl font-semibold">
            Coaches
          </h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Coach assignments across this
          training story.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {coachGroups.map((group) => (
          <div
            key={group.key}
            className="rounded-lg border p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">
                {group.coachName}
              </h3>

              {group.isLegacy && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Old value
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2">
              {group.pitches.map(
                (pitch) => (
                  <div
                    key={pitch.id}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <MapIcon className="h-4 w-4 shrink-0" />

                    <span>
                      {pitch.name}

                      {pitch.playerGroup
                        ? ` · ${pitch.playerGroup}`
                        : ""}
                    </span>
                  </div>
                )
              )}
            </div>

            <p className="mt-4 text-sm font-medium">
              {group.pitches.length}{" "}
              {group.pitches.length === 1
                ? "pitch"
                : "pitches"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
