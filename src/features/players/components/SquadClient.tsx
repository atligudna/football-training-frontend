"use client";

import { useState } from "react";

import { CoachesClient } from "@/features/coaches/components/CoachesClient";

import { GroupsClient } from "./GroupsClient";
import { PlayersClient } from "./PlayersClient";

type SquadTab =
  | "players"
  | "groups"
  | "coaches";

export function SquadClient() {
  const [activeTab, setActiveTab] =
    useState<SquadTab>("players");

  return (
    <div className="space-y-6">
      <div className="flex w-fit rounded-lg border p-1">
        <button
          type="button"
          onClick={() =>
            setActiveTab("players")
          }
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            activeTab === "players"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Players
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("groups")
          }
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            activeTab === "groups"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Groups
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("coaches")
          }
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            activeTab === "coaches"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Coaches
        </button>
      </div>

      {activeTab === "players" && (
        <PlayersClient />
      )}

      {activeTab === "groups" && (
        <GroupsClient />
      )}

      {activeTab === "coaches" && (
        <CoachesClient />
      )}
    </div>
  );
}