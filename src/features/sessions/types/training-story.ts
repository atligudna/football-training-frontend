export type TrainingStoryStatus =
  | "draft"
  | "planned"
  | "active"
  | "completed"
  | "archived";

export type PitchName =
  | "Pitch A"
  | "Pitch B"
  | "Pitch C"
  | "Pitch D";

export type ActivityBlockType =
  | "warmup"
  | "technical"
  | "tactical"
  | "physical"
  | "goalkeeping"
  | "station"
  | "game"
  | "cooldown";

export type ActivityType =
  | "drill"
  | "station"
  | "game"
  | "break"
  | "reflection";

export interface CoachingPoint {
  id: string;
  text: string;
}

export interface PlayerFocus {
  id: string;
  text: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  description: string;
  durationMinutes: number;
  coachingPoints: CoachingPoint[];
  playerFocus: PlayerFocus[];
  equipment: EquipmentItem[];
  notes?: string;
}

export interface ActivityBlock {
  id: string;
  title: string;
  type: ActivityBlockType;
  order: number;
  durationMinutes: number;
  activities: Activity[];
}

export interface Pitch {
  id: string;
  name: PitchName;
  coachName?: string;
  playerGroup?: string;
  order: number;
  activityBlocks: ActivityBlock[];
}

export interface TrainingStory {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  durationMinutes: number;
  theme?: string;
  objectives: string[];
  status: TrainingStoryStatus;
  pitches: Pitch[];
  createdAt: string;
  updatedAt: string;
}