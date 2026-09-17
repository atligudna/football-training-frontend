"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authStorage } from "@/features/auth/utils/authStorage";

import { drillService } from "../services/drill.service";
import {
    replaceStoredDrills,
    saveDrill,
} from "../utils/drill-storage";

import type { Drill } from "../types/drill";

export function DrillHistoryClient() {
    const [drills, setDrills] = useState<Drill[]>([]);

    const [isLoading, setIsLoading] = useState(() =>
        Boolean(authStorage.getToken())
    );

    const [restoringDrillId, setRestoringDrillId] =
        useState<string | null>(null);

    const [error, setError] = useState<string | null>(() =>
        authStorage.getToken()
            ? null
            : "You need to be logged in to view drill history."
    );

    useEffect(() => {
        let isActive = true;

        const token = authStorage.getToken();

        if (!token) return;

        drillService
            .getDeletedDrills(token)
            .then((deletedDrills) => {
                if (!isActive) return;

                setDrills(deletedDrills);
                setError(null);
            })
            .catch(() => {
                if (!isActive) return;

                setError("Could not load drill history.");
            })
            .finally(() => {
                if (!isActive) return;

                setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, []);

    async function handleRestoreDrill(drill: Drill) {
        const token = authStorage.getToken();

        if (!token) return;

        setRestoringDrillId(drill.id);
        setError(null);

        try {
            const restoredDrill =
                await drillService.restoreDrill(drill.id, token);

            saveDrill(restoredDrill);

            setDrills((current) =>
                current.filter((item) => item.id !== drill.id)
            );

            const activeDrills = await drillService.getDrills(token);

            replaceStoredDrills(activeDrills);
        } catch {
            setError("Could not restore drill.");
        } finally {
            setRestoringDrillId(null);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <Link href="/drills">
                    <Button type="button" variant="ghost">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Drill Bank
                    </Button>
                </Link>
            </div>

            <header>
                <h1 className="text-3xl font-bold tracking-tight">
                    Drill History
                </h1>

                <p className="mt-2 text-muted-foreground">
                    View deleted drills and restore them to your Drill Bank.
                </p>
            </header>

            {isLoading && (
                <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                    Loading drill history...
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {!isLoading && drills.length === 0 ? (
                <div className="rounded-xl border border-dashed p-10 text-center">
                    <h2 className="text-xl font-semibold">
                        No deleted drills
                    </h2>

                    <p className="mt-2 text-muted-foreground">
                        Deleted drills will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {drills.map((drill) => (
                        <Card key={drill.id} className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {drill.ageGroup ?? "No age group"} ·{" "}
                                        {drill.type} · {drill.durationMinutes} min
                                    </p>

                                    <h2 className="mt-1 text-xl font-semibold">
                                        {drill.title}
                                    </h2>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {drill.description}
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => handleRestoreDrill(drill)}
                                    disabled={restoringDrillId === drill.id}
                                >
                                    <RotateCcw className="h-4 w-4" />

                                    {restoringDrillId === drill.id
                                        ? "Restoring..."
                                        : "Restore"}
                                </Button>
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

                            <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">
                                Last updated:{" "}
                                {new Date(drill.updatedAt).toLocaleString()}
                            </p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}