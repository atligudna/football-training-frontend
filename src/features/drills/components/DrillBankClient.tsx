"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { drills as baseDrills } from "../data/drills";
import { getAllDrills, saveDrill } from "../utils/drill-storage";

import type { ActivityType } from "@/features/sessions";
import type { Drill } from "../types/drill";

const drillTypes: ActivityType[] = [
  "drill",
  "station",
  "game",
  "break",
  "reflection",
];

function getInitialDrills(): Drill[] {
  return getAllDrills(baseDrills);
}

function textToLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function DrillBankClient() {
  const [drills, setDrills] = useState<Drill[]>(getInitialDrills);
  const [searchText, setSearchText] = useState("");

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ActivityType>("drill");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [ageGroup, setAgeGroup] = useState("U12");
  const [tagsText, setTagsText] = useState("");
  const [coachingPointsText, setCoachingPointsText] = useState("");
  const [equipmentText, setEquipmentText] = useState("");

  const filteredDrills = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) return drills;

    return drills.filter((drill) => {
      const searchableText = [
        drill.title,
        drill.description,
        drill.ageGroup ?? "",
        drill.type,
        drill.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [drills, searchText]);

  function handleAddDrill(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const now = new Date().toISOString();

    const drill: Drill = {
      id: crypto.randomUUID(),
      title: title.trim(),
      type,
      description: description.trim(),
      durationMinutes,
      ageGroup: ageGroup.trim(),
      tags: tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      coachingPoints: textToLines(coachingPointsText).map((text) => ({
        id: crypto.randomUUID(),
        text,
      })),
      equipment: textToLines(equipmentText).map((line) => {
        const [namePart, quantityPart] = line.includes(":")
          ? line.split(":")
          : line.split(",");

        const quantity = Number(quantityPart?.trim() || 1);

        return {
          id: crypto.randomUUID(),
          name: namePart.trim(),
          quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        };
      }),
      createdAt: now,
      updatedAt: now,
    };

    saveDrill(drill);
    setDrills((current) => [drill, ...current]);

    setTitle("");
    setType("drill");
    setDescription("");
    setDurationMinutes(10);
    setAgeGroup("U12");
    setTagsText("");
    setCoachingPointsText("");
    setEquipmentText("");
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Drill Bank</h1>
        <p className="mt-2 text-muted-foreground">
          Store reusable football drills for future training stories.
        </p>
      </header>

      <form onSubmit={handleAddDrill} className="space-y-5 rounded-xl border p-6">
        <div>
          <h2 className="text-xl font-semibold">Add drill</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a reusable drill for your training bank.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="drill-title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="drill-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              placeholder="4v1 Rondo"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="drill-type" className="text-sm font-medium">
              Type
            </label>
            <select
              id="drill-type"
              value={type}
              onChange={(event) => setType(event.target.value as ActivityType)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              {drillTypes.map((drillType) => (
                <option key={drillType} value={drillType}>
                  {drillType}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="drill-duration" className="text-sm font-medium">
              Duration
            </label>
            <input
              id="drill-duration"
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(Number(event.target.value))}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="drill-age-group" className="text-sm font-medium">
              Age group
            </label>
            <input
              id="drill-age-group"
              value={ageGroup}
              onChange={(event) => setAgeGroup(event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              placeholder="U12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="drill-description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="drill-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Describe setup and rules..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="drill-tags" className="text-sm font-medium">
            Tags
          </label>
          <input
            id="drill-tags"
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            placeholder="passing, first touch, scanning"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="drill-coaching-points" className="text-sm font-medium">
              Coaching points
            </label>
            <textarea
              id="drill-coaching-points"
              value={coachingPointsText}
              onChange={(event) => setCoachingPointsText(event.target.value)}
              rows={4}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder={"Open body shape\nMove after passing"}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="drill-equipment" className="text-sm font-medium">
              Equipment
            </label>
            <textarea
              id="drill-equipment"
              value={equipmentText}
              onChange={(event) => setEquipmentText(event.target.value)}
              rows={4}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder={"Balls: 8\nCones: 12"}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            <Plus className="h-4 w-4" />
            Add drill
          </Button>
        </div>
      </form>

      <section className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl border p-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className="h-10 flex-1 bg-transparent text-sm outline-none"
            placeholder="Search drills by title, tag, age group..."
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filteredDrills.length} of {drills.length} drills.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          {filteredDrills.map((drill) => (
            <Card key={drill.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {drill.ageGroup} · {drill.type} · {drill.durationMinutes} min
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">{drill.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {drill.description}
                  </p>
                </div>
              </div>

              {drill.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {drill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {drill.coachingPoints.length > 0 && (
                <div className="mt-5 border-t pt-4">
                  <p className="mb-2 text-sm font-medium">Coaching points</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {drill.coachingPoints.map((point) => (
                      <li key={point.id}>✓ {point.text}</li>
                    ))}
                  </ul>
                </div>
              )}

              {drill.equipment.length > 0 && (
                <div className="mt-5 border-t pt-4">
                  <p className="mb-2 text-sm font-medium">Equipment</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {drill.equipment.map((item) => (
                      <li key={item.id}>
                        {item.name}: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}