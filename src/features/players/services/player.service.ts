import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types/auth";

import type { Player } from "../types/player";

export type CreatePlayerPayload = {
  firstName: string;
  lastName: string;
  birthYear?: number;
  position?: string;
  notes?: string;
  active?: boolean;
};

export type UpdatePlayerPayload =
  Partial<CreatePlayerPayload>;

export const playerService = {
  async getPlayers(token: string): Promise<Player[]> {
    const response = await api.get<ApiResponse<Player[]>>(
      "/players",
      token
    );

    return response.data;
  },

  async getPlayer(
    id: string,
    token: string
  ): Promise<Player> {
    const response = await api.get<ApiResponse<Player>>(
      `/players/${id}`,
      token
    );

    return response.data;
  },

  async createPlayer(
    player: CreatePlayerPayload,
    token: string
  ): Promise<Player> {
    const response = await api.post<ApiResponse<Player>>(
      "/players",
      player,
      token
    );

    return response.data;
  },

  async updatePlayer(
    id: string,
    player: UpdatePlayerPayload,
    token: string
  ): Promise<Player> {
    const response = await api.put<ApiResponse<Player>>(
      `/players/${id}`,
      player,
      token
    );

    return response.data;
  },

  async deletePlayer(
    id: string,
    token: string
  ): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(
      `/players/${id}`,
      token
    );
  },
};