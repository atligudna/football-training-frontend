import type { TrainingStory } from "../types/training-story";

export const trainingStoryTemplates: TrainingStory[] = [
  {
    id: "template-u12-passing-support",
    title: "U12 Passing and Support",
    description: "A simple session focused on passing, movement and support angles.",
    ageGroup: "U12",
    durationMinutes: 75,
    theme: "Passing",
    objectives: [
      "Improve first touch before passing.",
      "Create better support angles.",
      "Move after passing.",
    ],
    status: "draft",
    pitches: [
      {
        id: "template-pitch-a",
        name: "Pitch A",
        coachName: "Coach",
        playerGroup: "Main group",
        order: 1,
        activityBlocks: [
          {
            id: "template-block-warmup",
            title: "Warmup",
            type: "warmup",
            order: 1,
            durationMinutes: 15,
            activities: [
              {
                id: "template-activity-rondo",
                title: "4v1 Rondo",
                type: "drill",
                description: "Players keep possession in a square with one defender in the middle.",
                durationMinutes: 15,
                coachingPoints: [
                  { id: "cp-1", text: "Open body shape before receiving." },
                  { id: "cp-2", text: "Pass with correct weight." },
                ],
                playerFocus: [
                  { id: "pf-1", text: "Scan before receiving." },
                ],
                equipment: [
                  { id: "eq-1", name: "Balls", quantity: 6 },
                  { id: "eq-2", name: "Cones", quantity: 12 },
                ],
              },
            ],
          },
          {
            id: "template-block-technical",
            title: "Passing pattern",
            type: "technical",
            order: 2,
            durationMinutes: 25,
            activities: [
              {
                id: "template-activity-pattern",
                title: "Pass and Move Pattern",
                type: "drill",
                description: "Players pass through stations and move to the next cone after each pass.",
                durationMinutes: 25,
                coachingPoints: [
                  { id: "cp-3", text: "First touch should prepare the next pass." },
                  { id: "cp-4", text: "Move immediately after passing." },
                ],
                playerFocus: [
                  { id: "pf-2", text: "Quality before speed." },
                ],
                equipment: [
                  { id: "eq-3", name: "Balls", quantity: 8 },
                  { id: "eq-4", name: "Cones", quantity: 16 },
                ],
              },
            ],
          },
          {
            id: "template-block-game",
            title: "Small-sided game",
            type: "game",
            order: 3,
            durationMinutes: 35,
            activities: [
              {
                id: "template-activity-game",
                title: "5v5 Three-Pass Rule",
                type: "game",
                description: "Teams must complete three passes before scoring.",
                durationMinutes: 35,
                coachingPoints: [
                  { id: "cp-5", text: "Create width and depth." },
                  { id: "cp-6", text: "Support the player on the ball." },
                ],
                playerFocus: [
                  { id: "pf-3", text: "Find space before asking for the ball." },
                ],
                equipment: [
                  { id: "eq-5", name: "Balls", quantity: 4 },
                  { id: "eq-6", name: "Bibs", quantity: 10 },
                  { id: "eq-7", name: "Goals", quantity: 2 },
                ],
              },
            ],
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "template-u12-finishing",
    title: "U12 Finishing",
    description: "A finishing session with repetition, decision-making and game realism.",
    ageGroup: "U12",
    durationMinutes: 75,
    theme: "Finishing",
    objectives: [
      "Improve shooting technique.",
      "Finish quickly after first touch.",
      "Make better decisions near goal.",
    ],
    status: "draft",
    pitches: [
      {
        id: "template-finishing-pitch-a",
        name: "Pitch A",
        coachName: "Coach",
        playerGroup: "Main group",
        order: 1,
        activityBlocks: [
          {
            id: "template-finishing-block-1",
            title: "Finishing technique",
            type: "technical",
            order: 1,
            durationMinutes: 25,
            activities: [
              {
                id: "template-finishing-activity-1",
                title: "First Touch and Finish",
                type: "drill",
                description: "Players receive a pass, take one touch and finish on goal.",
                durationMinutes: 25,
                coachingPoints: [
                  { id: "fcp-1", text: "First touch out of feet." },
                  { id: "fcp-2", text: "Head steady when striking." },
                ],
                playerFocus: [
                  { id: "fpf-1", text: "Hit the target before adding power." },
                ],
                equipment: [
                  { id: "feq-1", name: "Balls", quantity: 10 },
                  { id: "feq-2", name: "Cones", quantity: 8 },
                  { id: "feq-3", name: "Goals", quantity: 2 },
                ],
              },
            ],
          },
          {
            id: "template-finishing-block-2",
            title: "Game realistic finishing",
            type: "game",
            order: 2,
            durationMinutes: 50,
            activities: [
              {
                id: "template-finishing-activity-2",
                title: "3v2 to Goal",
                type: "game",
                description: "Attackers try to create a quick finish against two defenders.",
                durationMinutes: 50,
                coachingPoints: [
                  { id: "fcp-3", text: "Attack with speed." },
                  { id: "fcp-4", text: "Choose pass or shot early." },
                ],
                playerFocus: [
                  { id: "fpf-2", text: "Be brave near goal." },
                ],
                equipment: [
                  { id: "feq-4", name: "Balls", quantity: 8 },
                  { id: "feq-5", name: "Bibs", quantity: 8 },
                  { id: "feq-6", name: "Goals", quantity: 2 },
                ],
              },
            ],
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];