export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  birthYear?: number;
  position?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}