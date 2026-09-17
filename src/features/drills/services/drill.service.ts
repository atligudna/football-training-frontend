import { api } from "@/lib/api";

import type { ApiResponse } from "@/features/auth/types/auth";
import type { Drill } from "../types/drill";

export type CreateDrillPayload = Omit<
  Drill,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateDrillPayload = Partial<CreateDrillPayload>;

export const drillService = {
  async getDrills(token: string): Promise<Drill[]> {
    const response = await api.get<ApiResponse<Drill[]>>("/drills", token);

    return response.data;
  },

  async getDrill(id: string, token: string): Promise<Drill> {
    const response = await api.get<ApiResponse<Drill>>(`/drills/${id}`, token);

    return response.data;
  },

  async createDrill(
    drill: CreateDrillPayload,
    token: string
  ): Promise<Drill> {
    const response = await api.post<ApiResponse<Drill>>(
      "/drills",
      drill,
      token
    );

    return response.data;
  },

  async updateDrill(
    id: string,
    drill: UpdateDrillPayload,
    token: string
  ): Promise<Drill> {
    const response = await api.put<ApiResponse<Drill>>(
      `/drills/${id}`,
      drill,
      token
    );

    return response.data;
  },

  async deleteDrill(id: string, token: string): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(`/drills/${id}`, token);
  },

  async getDeletedDrills(token: string): Promise<Drill[]> {
    const response = await api.get<ApiResponse<Drill[]>>(
      "/drills/history",
      token
    );

    return response.data;
  },

  async restoreDrill(
    id: string,
    token: string
  ): Promise<Drill> {
    const response = await api.post<ApiResponse<Drill>>(
      `/drills/${id}/restore`,
      {},
      token
    );

    return response.data;
  },
};