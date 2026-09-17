import { api } from "@/lib/api";
import type { ApiResponse } from "@/features/auth/types/auth";

import type { Player } from "../types/player";
import type { PlayerGroup } from "../types/group";

export type CreateGroupPayload = {
  name: string;
  ageGroup?: string;
  description?: string;
};

export type UpdateGroupPayload =
  Partial<CreateGroupPayload>;

export type GroupPlayerResult = {
  groupId: string;
  playerId: string;
  alreadyMember: boolean;
};

export const groupService = {
  async getGroups(
    token: string
  ): Promise<PlayerGroup[]> {
    const response = await api.get<
      ApiResponse<PlayerGroup[]>
    >("/groups", token);

    return response.data;
  },

  async createGroup(
    group: CreateGroupPayload,
    token: string
  ): Promise<PlayerGroup> {
    const response = await api.post<
      ApiResponse<PlayerGroup>
    >("/groups", group, token);

    return response.data;
  },

  async updateGroup(
    id: string,
    group: UpdateGroupPayload,
    token: string
  ): Promise<PlayerGroup> {
    const response = await api.put<
      ApiResponse<PlayerGroup>
    >(`/groups/${id}`, group, token);

    return response.data;
  },

  async deleteGroup(
    id: string,
    token: string
  ): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(
      `/groups/${id}`,
      token
    );
  },

  async getGroupPlayers(
    groupId: string,
    token: string
  ): Promise<Player[]> {
    const response = await api.get<
      ApiResponse<Player[]>
    >(`/groups/${groupId}/players`, token);

    return response.data;
  },

  async addPlayerToGroup(
    groupId: string,
    playerId: string,
    token: string
  ): Promise<GroupPlayerResult> {
    const response = await api.post<
      ApiResponse<GroupPlayerResult>
    >(
      `/groups/${groupId}/players/${playerId}`,
      {},
      token
    );

    return response.data;
  },

  async removePlayerFromGroup(
    groupId: string,
    playerId: string,
    token: string
  ): Promise<ApiResponse<null>> {
    return api.delete<ApiResponse<null>>(
      `/groups/${groupId}/players/${playerId}`,
      token
    );
  },
};