import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types/auth";

import type { Coach } from "../types/coach";

export type CreateCoachPayload = {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  active?: boolean;
};

export type UpdateCoachPayload =
  Partial<CreateCoachPayload>;

export const coachService = {
  async getCoaches(
    token: string
  ): Promise<Coach[]> {
    const response =
      await api.get<ApiResponse<Coach[]>>(
        "/coaches",
        token
      );

    return response.data;
  },

  async getCoach(
    id: string,
    token: string
  ): Promise<Coach> {
    const response =
      await api.get<ApiResponse<Coach>>(
        `/coaches/${id}`,
        token
      );

    return response.data;
  },

  async createCoach(
    coach: CreateCoachPayload,
    token: string
  ): Promise<Coach> {
    const response =
      await api.post<ApiResponse<Coach>>(
        "/coaches",
        coach,
        token
      );

    return response.data;
  },

  async updateCoach(
    id: string,
    coach: UpdateCoachPayload,
    token: string
  ): Promise<Coach> {
    const response =
      await api.put<ApiResponse<Coach>>(
        `/coaches/${id}`,
        coach,
        token
      );

    return response.data;
  },

  async deleteCoach(
    id: string,
    token: string
  ): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(
      `/coaches/${id}`,
      token
    );
  },
};