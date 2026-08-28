import type { TrainingStory } from "../types/training-story";

export const trainingStories: TrainingStory[] = [
  {
    id: "1",
    title: "Monday Training",
    description: "Passing and possession",
    ageGroup: "U11",
    durationMinutes: 90,
    theme: "Passing",
    objectives: [
      "Open your body",
      "Pass to the far foot",
      "Move after passing",
    ],
    status: "planned",
    pitches: [
      {
        id: "pitch-1",
        name: "Pitch A",
        coachName: "Atli",
        playerGroup: "Group 1",
        order: 1,
        activityBlocks: [
          {
            id: "block-1",
            title: "Warm-up",
            type: "warmup",
            order: 1,
            durationMinutes: 15,
            activities: [
              {
                id: "activity-1",
                title: "Dynamic Warm-up",
                type: "drill",
                description: "Players move through basic dynamic movements.",
                durationMinutes: 15,
                coachingPoints: [
                  { id: "cp-1", text: "Good body posture" },
                  { id: "cp-2", text: "Controlled movements" },
                ],
                playerFocus: [
                  { id: "pf-1", text: "Prepare body and mind" },
                ],
                equipment: [
                  { id: "eq-1", name: "Cones", quantity: 12 },
                ],
              },
            ],
          },
          {
            id: "block-2",
            title: "Passing",
            type: "technical",
            order: 2,
            durationMinutes: 25,
            activities: [
              {
                id: "activity-2",
                title: "Triangle Passing",
                type: "drill",
                description: "Players pass and rotate in triangles.",
                durationMinutes: 25,
                coachingPoints: [
                  { id: "cp-3", text: "Open your body before receiving" },
                  { id: "cp-4", text: "Pass to the far foot" },
                  { id: "cp-5", text: "Move after passing" },
                ],
                playerFocus: [
                  { id: "pf-2", text: "Receive with purpose" },
                ],
                equipment: [
                  { id: "eq-2", name: "Balls", quantity: 8 },
                  { id: "eq-3", name: "Cones", quantity: 16 },
                ],
              },
            ],
          },
        ],
      },
    ],
    createdAt: "2026-08-28",
    updatedAt: "2026-08-28",
  },
  {
    id: "2",
    title: "Finishing Session",
    description: "Shooting under pressure",
    ageGroup: "U13",
    durationMinutes: 75,
    theme: "Finishing",
    objectives: [
      "Finish quickly",
      "Hit the target",
    ],
    status: "draft",
    pitches: [],
    createdAt: "2026-08-28",
    updatedAt: "2026-08-28",
  },
  {
    id: "3",
    title: "High Press",
    description: "Winning the ball high",
    ageGroup: "U15",
    durationMinutes: 90,
    theme: "Pressing",
    objectives: [
      "Press together",
      "Win the first duel",
      "Transition quickly",
    ],
    status: "completed",
    pitches: [],
    createdAt: "2026-08-20",
    updatedAt: "2026-08-24",
  },
];