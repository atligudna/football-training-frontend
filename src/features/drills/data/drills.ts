import type { Drill } from "../types/drill";

const now = new Date().toISOString();

export const drills: Drill[] = [
  {
    id: "drill-1",
    title: "4v1 Rondo",
    type: "drill",
    description:
      "Four players keep possession against one defender inside a square.",
    durationMinutes: 12,
    ageGroup: "U12",
    tags: ["passing", "first touch", "scanning"],
    coachingPoints: [
      { id: "cp-1", text: "Open body shape before receiving." },
      { id: "cp-2", text: "Move after passing." },
      { id: "cp-3", text: "Pass with correct weight." },
    ],
    equipment: [
      { id: "eq-1", name: "Balls", quantity: 4 },
      { id: "eq-2", name: "Cones", quantity: 8 },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "drill-2",
    title: "1v1 to Goal",
    type: "game",
    description:
      "Attacker tries to beat the defender and finish on goal.",
    durationMinutes: 15,
    ageGroup: "U12",
    tags: ["1v1", "finishing", "attacking"],
    coachingPoints: [
      { id: "cp-4", text: "Attack at speed." },
      { id: "cp-5", text: "Use disguise before changing direction." },
      { id: "cp-6", text: "Finish quickly after beating the defender." },
    ],
    equipment: [
      { id: "eq-3", name: "Balls", quantity: 8 },
      { id: "eq-4", name: "Cones", quantity: 10 },
      { id: "eq-5", name: "Goals", quantity: 2 },
    ],
    createdAt: now,
    updatedAt: now,
  },
];