export interface RunNote {
  id: string;
  activityId: string;
  activityTitle: string;
  text: string;
  createdAt: string;
}

export interface RunProgress {
  currentActivityIndex: number;
  secondsRemaining: number;
  notes: RunNote[];
}

function getRunProgressKey(storyId: string) {
  return `football-planner-run-progress-${storyId}`;
}

export function getRunProgress(storyId: string): RunProgress | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(getRunProgressKey(storyId));

  if (!raw) return null;

  try {
    const progress = JSON.parse(raw) as Partial<RunProgress>;

    return {
      currentActivityIndex: progress.currentActivityIndex ?? 0,
      secondsRemaining: progress.secondsRemaining ?? 0,
      notes: progress.notes ?? [],
    };
  } catch {
    return null;
  }
}

export function saveRunProgress(
  storyId: string,
  progress: Partial<RunProgress>
) {
  if (typeof window === "undefined") return;

  const currentProgress = getRunProgress(storyId);

  window.localStorage.setItem(
    getRunProgressKey(storyId),
    JSON.stringify({
      ...currentProgress,
      ...progress,
    })
  );
}

export function clearRunProgress(storyId: string) {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(getRunProgressKey(storyId));
}