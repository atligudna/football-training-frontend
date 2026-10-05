import { api } from "@/lib/api";

import type {
  ApiResponse,
} from "@/features/auth/types/auth";

import type {
  BulkAttendancePayload,
  TrainingAttendancePlayer,
  UpdateAttendancePayload,
} from "../types/attendance";

export const attendanceService = {
  async getAttendance(
    storyId: string,
    token: string
  ): Promise<TrainingAttendancePlayer[]> {
    const response = await api.get<
      ApiResponse<TrainingAttendancePlayer[]>
    >(
      `/training-stories/${storyId}/attendance`,
      token
    );

    return response.data;
  },

  async updateAttendance(
    storyId: string,
    playerId: string,
    payload: UpdateAttendancePayload,
    token: string
  ): Promise<TrainingAttendancePlayer> {
    const response = await api.put<
      ApiResponse<TrainingAttendancePlayer>
    >(
      `/training-stories/${storyId}/attendance/${playerId}`,
      payload,
      token
    );

    return response.data;
  },

  async updateMany(
    storyId: string,
    payload: BulkAttendancePayload,
    token: string
  ): Promise<TrainingAttendancePlayer[]> {
    const response = await api.put<
      ApiResponse<TrainingAttendancePlayer[]>
    >(
      `/training-stories/${storyId}/attendance`,
      payload,
      token
    );

    return response.data;
  },
};