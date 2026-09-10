interface RunProgress {
  currentActivityIndex: number;
  secondsRemaining: number;
}

function getRunProgressKey(storyId: string) {
  return `football-planner-run-progress-${storyId}`;
}

export function getRunProgress(storyId: string): RunProgress | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(getRunProgressKey(storyId));

  if (!raw) return null;

  try {
    return JSON.parse(raw) as RunProgress;
  } catch {
    return null;
  }
}

export function saveRunProgress(storyId: string, progress: RunProgress) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    getRunProgressKey(storyId),
    JSON.stringify(progress)
  );
}

export function clearRunProgress(storyId: string) {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(getRunProgressKey(storyId));
}