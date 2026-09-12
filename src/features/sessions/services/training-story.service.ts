import { api } from "@/lib/api";

import type { ApiResponse } from "@/features/auth/types/auth";
import type { TrainingStory } from "../types/training-story";

interface BackendTrainingStoryRow {
  id: string;
  owner_email: string;
  title: string;
  description: string;
  age_group: string;
  duration_minutes: number;
  theme: string | null;
  tags: string[];
  objectives: string[];
  status: TrainingStory["status"];
  created_at: string;
  updated_at: string;
}

function mapBackendRowToTrainingStory(
  row: BackendTrainingStoryRow
): TrainingStory {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    ageGroup: row.age_group,
    durationMinutes: row.duration_minutes,
    theme: row.theme ?? undefined,
    tags: row.tags ?? [],
    objectives: row.objectives ?? [],
    status: row.status,
    pitches: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const trainingStoryService = {
  async getTrainingStories(token: string): Promise<TrainingStory[]> {
    const response = await api.get<ApiResponse<BackendTrainingStoryRow[]>>(
      "/training-stories",
      token
    );

    return response.data.map(mapBackendRowToTrainingStory);
  },

  async getFullTrainingStory(
    id: string,
    token: string
  ): Promise<TrainingStory> {
    const response = await api.get<ApiResponse<TrainingStory>>(
      `/training-stories/${id}/full`,
      token
    );

    return response.data;
  },

  async createFullTrainingStory(
    story: TrainingStory,
    token: string
  ): Promise<TrainingStory> {
    const response = await api.post<ApiResponse<TrainingStory>>(
      "/training-stories/full",
      story,
      token
    );

    return response.data;
  },

  async updateFullTrainingStory(
    id: string,
    story: TrainingStory,
    token: string
  ): Promise<TrainingStory> {
    const response = await api.put<ApiResponse<TrainingStory>>(
      `/training-stories/${id}/full`,
      story,
      token
    );

    return response.data;
  },

  async deleteTrainingStory(
    id: string,
    token: string
  ): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(`/training-stories/${id}`, token);
  },
};