export interface Coach {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}