import type { Drill } from "../types/drill";

const STORAGE_KEY = "football-planner-drills";

export function getStoredDrills(): Drill[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as Drill[];
  } catch {
    return [];
  }
}

export function getAllDrills(baseDrills: Drill[]): Drill[] {
  const storedDrills = getStoredDrills();
  const storedIds = new Set(storedDrills.map((drill) => drill.id));

  const baseDrillsNotInStorage = baseDrills.filter(
    (drill) => !storedIds.has(drill.id)
  );

  return [...storedDrills, ...baseDrillsNotInStorage];
}

export function saveDrill(drill: Drill) {
  const drills = getStoredDrills();

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([drill, ...drills])
  );
}