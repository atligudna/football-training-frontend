export type AttendanceStatus =
  | "unknown"
  | "attending"
  | "absent"
  | "injured";

export interface TrainingAttendancePlayer {
  playerId: string;
  firstName: string;
  lastName: string;
  birthYear?: number;
  position?: string;
  active: boolean;
  groupIds: string[];
  groupNames: string[];
  status: AttendanceStatus;
  notes?: string;
  updatedAt?: string;
}

export interface UpdateAttendancePayload {
  status: AttendanceStatus;
  notes?: string | null;
}

export interface BulkAttendanceItem {
  playerId: number;
  status: AttendanceStatus;
  notes?: string | null;
}

export interface BulkAttendancePayload {
  attendance: BulkAttendanceItem[];
}