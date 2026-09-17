"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ChevronDown, ChevronUp, Plus, Search, Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authStorage } from "@/features/auth/utils/authStorage";

import { drills as baseDrills } from "../data/drills";
import { drillService } from "../services/drill.service";
import { getAllDrills, saveDrill, updateDrill } from "../utils/drill-storage";
import { EditDrillForm } from "./EditDrillForm";

import type { ActivityType } from "@/features/sessions";
import type { Drill } from "../types/drill";
import type { CreateDrillPayload } from "../services/drill.service";

const drillTypes: ActivityType[] = [
    "drill",
    "station",
    "game",
    "break",
    "reflection",
];

function getLocalFallbackDrills(): Drill[] {
    return getAllDrills(baseDrills);
}

function textToLines(text: string) {
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}

function parseEquipmentText(text: string) {
    return textToLines(text).map((line) => {
        const [namePart, quantityPart] = line.includes(":")
            ? line.split(":")
            : line.split(",");

        const quantity = Number(quantityPart?.trim() || 1);

        return {
            id: crypto.randomUUID(),
            name: namePart.trim(),
            quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        };
    });
}

export function DrillBankClient() {
    const [drills, setDrills] = useState<Drill[]>(() => {
        const token = authStorage.getToken();

        return token ? [] : getLocalFallbackDrills();
    });

    const [searchText, setSearchText] = useState("");
    const [expandedDrillIds, setExpandedDrillIds] = useState<string[]>([]);
    const [isAddDrillOpen, setIsAddDrillOpen] = useState(false);

    const [isLoadingBackendDrills, setIsLoadingBackendDrills] = useState(() =>
        Boolean(authStorage.getToken())
    );
    const [backendError, setBackendError] = useState<string | null>(null);
    const [isSavingBackendDrill, setIsSavingBackendDrill] = useState(false);
    const [deletingDrillId, setDeletingDrillId] = useState<string | null>(null);
    const [editingDrillId, setEditingDrillId] = useState<string | null>(null);
    const [isUpdatingBackendDrill, setIsUpdatingBackendDrill] = useState(false);

    const [title, setTitle] = useState("");
    const [type, setType] = useState<ActivityType>("drill");
    const [description, setDescription] = useState("");
    const [durationMinutes, setDurationMinutes] = useState(10);
    const [ageGroup, setAgeGroup] = useState("U12");
    const [tagsText, setTagsText] = useState("");
    const [coachingPointsText, setCoachingPointsText] = useState("");
    const [equipmentText, setEquipmentText] = useState("");

    useEffect(() => {
        let isActive = true;

        const token = authStorage.getToken();

        if (!token) return;

        drillService
            .getDrills(token)
            .then((backendDrills) => {
                if (!isActive) return;

                setDrills(backendDrills);
                setBackendError(null);
            })
            .catch(() => {
                if (!isActive) return;

                setDrills(getLocalFallbackDrills());
                setBackendError(
                    "Could not load drills from backend. Showing local fallback drills."
                );
            })
            .finally(() => {
                if (!isActive) return;

                setIsLoadingBackendDrills(false);
            });

        return () => {
            isActive = false;
        };
    }, []);

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

    function resetForm() {
        setTitle("");
        setType("drill");
        setDescription("");
        setDurationMinutes(10);
        setAgeGroup("U12");
        setTagsText("");
        setCoachingPointsText("");
        setEquipmentText("");
    }

    function isDrillExpanded(drillId: string) {
        return expandedDrillIds.includes(drillId);
    }

    function toggleDrillExpanded(drillId: string) {
        setExpandedDrillIds((current) =>
            current.includes(drillId)
                ? current.filter((id) => id !== drillId)
                : [...current, drillId]
        );
    }

    function shouldCollapseDrill(drill: Drill) {
        return (
            drill.description.length > 160 ||
            drill.coachingPoints.length > 3 ||
            drill.equipment.length > 3 ||
            drill.tags.length > 4
        );
    }

    async function handleAddDrill(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const safeDurationMinutes =
            Number.isFinite(durationMinutes) && durationMinutes > 0
                ? durationMinutes
                : 1;

        const drillPayload: CreateDrillPayload = {
            title: title.trim(),
            type,
            description: description.trim(),
            durationMinutes: safeDurationMinutes,
            ageGroup: ageGroup.trim() || undefined,
            tags: tagsText
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            coachingPoints: textToLines(coachingPointsText).map((text) => ({
                id: crypto.randomUUID(),
                text,
            })),
            equipment: parseEquipmentText(equipmentText),
        };

        const token = authStorage.getToken();

        if (!token) {
            const now = new Date().toISOString();

            const localDrill: Drill = {
                ...drillPayload,
                id: crypto.randomUUID(),
                createdAt: now,
                updatedAt: now,
            };

            saveDrill(localDrill);
            setDrills((current) => [localDrill, ...current]);
            resetForm();
            setIsAddDrillOpen(false);
            return;
        }

        setIsSavingBackendDrill(true);
        setBackendError(null);

        try {
            const savedDrill = await drillService.createDrill(drillPayload, token);

            saveDrill(savedDrill);
            setDrills((current) => [
                savedDrill,
                ...current.filter((drill) => drill.id !== savedDrill.id),
            ]);

            resetForm();
            setIsAddDrillOpen(false);
        } catch {
            setBackendError("Could not save drill to backend.");
        } finally {
            setIsSavingBackendDrill(false);
        }
    }

    function handleCancelAddDrill() {
        resetForm();
        setIsAddDrillOpen(false);
    }

    async function handleDeleteDrill(drill: Drill) {
        const confirmed = window.confirm(
            `Delete "${drill.title}"? This cannot be undone.`
        );

        if (!confirmed) return;

        const token = authStorage.getToken();

        if (!token) {
            setDrills((current) => current.filter((item) => item.id !== drill.id));
            setExpandedDrillIds((current) =>
                current.filter((drillId) => drillId !== drill.id)
            );
            return;
        }

        setDeletingDrillId(drill.id);
        setBackendError(null);

        try {
            await drillService.deleteDrill(drill.id, token);

            setDrills((current) => current.filter((item) => item.id !== drill.id));
            setExpandedDrillIds((current) =>
                current.filter((drillId) => drillId !== drill.id)
            );
        } catch {
            setBackendError("Could not delete drill from backend.");
        } finally {
            setDeletingDrillId(null);
        }
    }

    async function handleSaveEditedDrill(updatedDrill: Drill) {
        const token = authStorage.getToken();

        if (!token) {
            updateDrill(updatedDrill);

            setDrills((current) =>
                current.map((drill) =>
                    drill.id === updatedDrill.id ? updatedDrill : drill
                )
            );

            setEditingDrillId(null);
            return;
        }

        setIsUpdatingBackendDrill(true);
        setBackendError(null);

        try {
            const savedDrill = await drillService.updateDrill(
                updatedDrill.id,
                {
                    title: updatedDrill.title,
                    type: updatedDrill.type,
                    description: updatedDrill.description,
                    durationMinutes: updatedDrill.durationMinutes,
                    ageGroup: updatedDrill.ageGroup,
                    tags: updatedDrill.tags,
                    coachingPoints: updatedDrill.coachingPoints,
                    equipment: updatedDrill.equipment,
                },
                token
            );

            updateDrill(savedDrill);

            setDrills((current) =>
                current.map((drill) =>
                    drill.id === savedDrill.id ? savedDrill : drill
                )
            );

            setEditingDrillId(null);
        } catch {
            setBackendError("Could not update drill in backend.");
        } finally {
            setIsUpdatingBackendDrill(false);
        }
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Drill Bank</h1>
                <p className="mt-2 text-muted-foreground">
                    Store reusable football drills for future training stories.
                </p>
            </header>

            {isLoadingBackendDrills && (
                <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                    Loading drills from backend...
                </div>
            )}

            {backendError && (
                <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
                    {backendError}
                </div>
            )}

            {isSavingBackendDrill && (
                <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                    Saving drill to backend...
                </div>
            )}

            <section className="rounded-xl border">
                <button
                    type="button"
                    onClick={() => setIsAddDrillOpen((current) => !current)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-muted/40"
                >
                    <div>
                        <h2 className="text-xl font-semibold">Add drill</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create a reusable drill for your training bank.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium">
                        <Plus className="h-4 w-4" />
                        <span>{isAddDrillOpen ? "Close" : "Open"}</span>
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${isAddDrillOpen ? "rotate-180" : ""
                                }`}
                        />
                    </div>
                </button>

                {isAddDrillOpen && (
                    <form onSubmit={handleAddDrill} className="space-y-5 border-t p-6">
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
                                    onChange={(event) =>
                                        setType(event.target.value as ActivityType)
                                    }
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
                                <label
                                    htmlFor="drill-duration"
                                    className="text-sm font-medium"
                                >
                                    Duration
                                </label>
                                <input
                                    id="drill-duration"
                                    type="number"
                                    min={1}
                                    value={durationMinutes}
                                    onChange={(event) =>
                                        setDurationMinutes(Number(event.target.value))
                                    }
                                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="drill-age-group"
                                    className="text-sm font-medium"
                                >
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
                            <label
                                htmlFor="drill-description"
                                className="text-sm font-medium"
                            >
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
                                <label
                                    htmlFor="drill-coaching-points"
                                    className="text-sm font-medium"
                                >
                                    Coaching points
                                </label>
                                <textarea
                                    id="drill-coaching-points"
                                    value={coachingPointsText}
                                    onChange={(event) =>
                                        setCoachingPointsText(event.target.value)
                                    }
                                    rows={4}
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    placeholder={"Open body shape\nMove after passing"}
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="drill-equipment"
                                    className="text-sm font-medium"
                                >
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

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancelAddDrill}
                                disabled={isSavingBackendDrill}
                            >
                                Cancel
                            </Button>

                            <Button type="submit" disabled={isSavingBackendDrill}>
                                <Plus className="h-4 w-4" />
                                {isSavingBackendDrill ? "Saving..." : "Add drill"}
                            </Button>
                        </div>
                    </form>
                )}
            </section>

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
                    {filteredDrills.map((drill) => {
                        const isExpanded = isDrillExpanded(drill.id);
                        const isCollapsible = shouldCollapseDrill(drill);
                        const shouldShowFullContent = !isCollapsible || isExpanded;
                        if (editingDrillId === drill.id) {
                            return (
                                <Card key={drill.id} className="p-6">
                                    <EditDrillForm
                                        drill={drill}
                                        onSave={handleSaveEditedDrill}
                                        onCancel={() => setEditingDrillId(null)}
                                        isSaving={isUpdatingBackendDrill}
                                    />
                                </Card>
                            );
                        }
                        return (
                            <Card key={drill.id} className="p-6">
                                <div className="flex w-full items-start gap-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {drill.ageGroup ?? "No age group"} · {drill.type} ·{" "}
                                            {drill.durationMinutes} min
                                        </p>

                                        <h2 className="mt-1 text-xl font-semibold">
                                            {drill.title}
                                        </h2>

                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {drill.description}
                                        </p>
                                    </div>

                                    <div className="ml-auto flex shrink-0 items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditingDrillId(drill.id)}
                                            aria-label={`Edit ${drill.title}`}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteDrill(drill)}
                                            disabled={deletingDrillId === drill.id}
                                            aria-label={`Delete ${drill.title}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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

                                {shouldShowFullContent &&
                                    drill.coachingPoints.length > 0 && (
                                        <div className="mt-5 border-t pt-4">
                                            <p className="mb-2 text-sm font-medium">
                                                Coaching points
                                            </p>
                                            <ul className="space-y-1 text-sm text-muted-foreground">
                                                {drill.coachingPoints.map((point) => (
                                                    <li key={point.id}>✓ {point.text}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                {shouldShowFullContent && drill.equipment.length > 0 && (
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

                                {isCollapsible && (
                                    <div className="mt-5 border-t pt-4">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => toggleDrillExpanded(drill.id)}
                                        >
                                            {isExpanded ? (
                                                <>
                                                    <ChevronUp className="h-4 w-4" />
                                                    Show less
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="h-4 w-4" />
                                                    Show more
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}