import type {
  ActivityType,
  CoachingPoint,
  EquipmentItem,
} from "@/features/sessions";

export interface Drill {
  id: string;
  title: string;
  type: ActivityType;
  description: string;
  durationMinutes: number;
  ageGroup?: string;
  tags: string[];
  coachingPoints: CoachingPoint[];
  equipment: EquipmentItem[];
  createdAt: string;
  updatedAt: string;
}