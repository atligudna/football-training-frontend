"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Activity,
    CalendarCheck,
    ClipboardCheck,
    Play,
    Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { trainingStories } from "../data/training-stories";
import { getAllTrainingStories } from "../utils/training-story-storage";

import type { TrainingStory } from "../types/training-story";

function getInitialTrainingStories(): TrainingStory[] {
    return getAllTrainingStories(trainingStories);
}

function getAverageRating(stories: TrainingStory[]) {
    const reviews = stories
        .map((story) => story.review)
        .filter(
            (review): review is NonNullable<TrainingStory["review"]> =>
                review !== undefined
        );

    if (reviews.length === 0) return null;

    const total = reviews.reduce(
        (sum, review) => sum + review.overallRating,
        0
    );

    return total / reviews.length;
}

function formatDate(dateString: string) {
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
    }).format(new Date(dateString));
}

export function TrainingDashboardClient() {
    const [stories] = useState<TrainingStory[]>(getInitialTrainingStories);

    const dashboardData = useMemo(() => {
        const plannedStories = stories.filter(
            (story) => story.status === "planned"
        );

        const activeStories = stories.filter(
            (story) => story.status === "active"
        );

        const completedStories = stories
            .filter((story) => story.status === "completed" || Boolean(story.review))
            .sort((a, b) => {
                const aDate = a.review?.completedAt ?? a.updatedAt;
                const bDate = b.review?.completedAt ?? b.updatedAt;

                return new Date(bDate).getTime() - new Date(aDate).getTime();
            });

        return {
            plannedStories,
            activeStories,
            completedStories,
            averageRating: getAverageRating(completedStories),
        };
    }, [stories]);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-2 text-muted-foreground">
                    Overview of your training plans, active sessions and completed
                    trainings.
                </p>
            </header>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-5">
                    <div className="flex items-center gap-3">
                        <CalendarCheck className="h-5 w-5" />
                        <p className="text-sm font-medium text-muted-foreground">
                            Planned
                        </p>
                    </div>

                    <p className="mt-3 text-3xl font-bold">
                        {dashboardData.plannedStories.length}
                    </p>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center gap-3">
                        <Play className="h-5 w-5" />
                        <p className="text-sm font-medium text-muted-foreground">
                            Active
                        </p>
                    </div>

                    <p className="mt-3 text-3xl font-bold">
                        {dashboardData.activeStories.length}
                    </p>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center gap-3">
                        <ClipboardCheck className="h-5 w-5" />
                        <p className="text-sm font-medium text-muted-foreground">
                            Completed
                        </p>
                    </div>

                    <p className="mt-3 text-3xl font-bold">
                        {dashboardData.completedStories.length}
                    </p>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center gap-3">
                        <Star className="h-5 w-5" />
                        <p className="text-sm font-medium text-muted-foreground">
                            Avg. rating
                        </p>
                    </div>

                    <p className="mt-3 text-3xl font-bold">
                        {dashboardData.averageRating === null
                            ? "-"
                            : dashboardData.averageRating.toFixed(1)}
                    </p>
                </Card>
            </div>

            <section className="grid gap-6 lg:grid-cols-2">
                <Card className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold">Active trainings</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Continue sessions that have already been started.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        {dashboardData.activeStories.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No active trainings.
                            </p>
                        ) : (
                            dashboardData.activeStories.slice(0, 3).map((story) => (
                                <div
                                    key={story.id}
                                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">{story.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {story.durationMinutes} min · {story.ageGroup}
                                        </p>
                                    </div>

                                    <Link href={`/sessions/${story.id}/run`}>
                                        <Button size="sm">
                                            <Activity className="h-4 w-4" />
                                            Continue
                                        </Button>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold">Recent completed</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Latest reviewed or completed trainings.
                            </p>
                        </div>

                        <Link href="/sessions/history">
                            <Button variant="secondary" size="sm">
                                View history
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-5 space-y-3">
                        {dashboardData.completedStories.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No completed trainings yet.
                            </p>
                        ) : (
                            dashboardData.completedStories.slice(0, 4).map((story) => (
                                <Link
                                    key={story.id}
                                    href={`/sessions/${story.id}`}
                                    className="block rounded-lg border p-3 transition hover:bg-muted"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">{story.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(story.review?.completedAt ?? story.updatedAt)}
                                            </p>
                                        </div>

                                        <p className="text-sm font-medium">
                                            {story.review ? `${story.review.overallRating}/5` : "-"}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </Card>
            </section>
        </div>
    );
}