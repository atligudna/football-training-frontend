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

  const nextDrills = [
    drill,
    ...drills.filter((storedDrill) => storedDrill.id !== drill.id),
  ];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDrills));
}

export function updateDrill(updatedDrill: Drill) {
  const drills = getStoredDrills();

  const exists = drills.some((drill) => drill.id === updatedDrill.id);

  const nextDrills = exists
    ? drills.map((drill) =>
      drill.id === updatedDrill.id ? updatedDrill : drill
    )
    : [updatedDrill, ...drills];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDrills));
}

export function deleteDrill(drillId: string) {
  const drills = getStoredDrills();

  const nextDrills = drills.filter((drill) => drill.id !== drillId);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDrills));
}

export function replaceStoredDrills(drills: Drill[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drills));
}