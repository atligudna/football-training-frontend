"use client";

import { FormEvent, useState } from "react";
import { parseEquipmentText } from "../utils/equipment-parser";
import { Button } from "@/components/ui/button";

import type { Activity, ActivityType } from "../types/training-story";

const activityTypes: ActivityType[] = [
    "drill",
    "station",
    "game",
    "break",
    "reflection",
];

interface AddActivityFormProps {
    onAddActivity: (activity: Activity) => void;
}

export function AddActivityForm({ onAddActivity }: AddActivityFormProps) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState<ActivityType>("drill");
    const [description, setDescription] = useState("");
    const [durationMinutes, setDurationMinutes] = useState("10");
    const [coachingPointsText, setCoachingPointsText] = useState("");
    const [playerFocusText, setPlayerFocusText] = useState("");
    const [equipmentText, setEquipmentText] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const equipment = parseEquipmentText(equipmentText);
        const activity: Activity = {
            id: crypto.randomUUID(),
            title,
            type,
            description,
            durationMinutes: Number(durationMinutes),
            coachingPoints: coachingPointsText
                .split("\n")
                .map((point) => point.trim())
                .filter(Boolean)
                .map((text) => ({
                    id: crypto.randomUUID(),
                    text,
                })),
            playerFocus: playerFocusText
                .split("\n")
                .map((focus) => focus.trim())
                .filter(Boolean)
                .map((text) => ({
                    id: crypto.randomUUID(),
                    text,
                })),
            equipment,
        };


        onAddActivity(activity);

        setTitle("");
        setType("drill");
        setDescription("");
        setDurationMinutes("10");
        setCoachingPointsText("");
        setPlayerFocusText("");
        setEquipmentText("");
    }

    return (
        <form onSubmit={handleSubmit} className="mt-4 rounded-lg border p-4">
            <h5 className="font-medium">Add Activity</h5>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="activity-title">
                        Title
                    </label>

                    <input
                        id="activity-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Triangle Passing"
                        required
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="activity-type">
                        Type
                    </label>

                    <select
                        id="activity-type"
                        value={type}
                        onChange={(event) => setType(event.target.value as ActivityType)}
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    >
                        {activityTypes.map((activityType) => (
                            <option key={activityType} value={activityType}>
                                {activityType}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium"
                        htmlFor="activity-duration"
                    >
                        Duration
                    </label>

                    <input
                        id="activity-duration"
                        type="number"
                        min="1"
                        value={durationMinutes}
                        onChange={(event) => setDurationMinutes(event.target.value)}
                        required
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        className="text-sm font-medium"
                        htmlFor="activity-description"
                    >
                        Description
                    </label>

                    <input
                        id="activity-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Players pass and rotate in triangles."
                        required
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                    />
                </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium"
                        htmlFor="activity-coaching-points"
                    >
                        Coaching points
                    </label>

                    <textarea
                        id="activity-coaching-points"
                        value={coachingPointsText}
                        onChange={(event) => setCoachingPointsText(event.target.value)}
                        placeholder={"Open body\nPass to far foot\nMove after passing"}
                        className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />

                    <p className="text-xs text-muted-foreground">
                        One coaching point per line.
                    </p>
                </div>

                <div className="space-y-2">
                    <label
                        className="text-sm font-medium"
                        htmlFor="activity-player-focus"
                    >
                        Player focus
                    </label>

                    <textarea
                        id="activity-player-focus"
                        value={playerFocusText}
                        onChange={(event) => setPlayerFocusText(event.target.value)}
                        placeholder={"Scan before receiving\nFirst touch forward"}
                        className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />

                    <p className="text-xs text-muted-foreground">
                        One player focus item per line.
                    </p>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <label
                    className="text-sm font-medium"
                    htmlFor="activity-equipment"
                >
                    Equipment
                </label>

                <textarea
                    id="activity-equipment"
                    value={equipmentText}
                    onChange={(event) => setEquipmentText(event.target.value)}
                    placeholder={"Balls: 8\nCones: 12\nBibs: 10"}
                    className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
                />

                <p className="text-xs text-muted-foreground">
                    One item per line. Use format: name: quantity.
                </p>
            </div>

            <div className="mt-4">
                <Button type="submit">Add Activity</Button>
            </div>
        </form>
    );
}