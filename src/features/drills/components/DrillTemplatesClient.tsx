"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authStorage } from "@/features/auth/utils/authStorage";

import { drills as drillTemplates } from "../data/drills";
import { drillService } from "../services/drill.service";
import { saveDrill } from "../utils/drill-storage";

import type { Drill } from "../types/drill";
import type { CreateDrillPayload } from "../services/drill.service";

export function DrillTemplatesClient() {
  const router = useRouter();

  const [creatingTemplateId, setCreatingTemplateId] =
    useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  async function handleUseTemplate(template: Drill) {
    const payload: CreateDrillPayload = {
      title: `${template.title} Copy`,
      type: template.type,
      description: template.description,
      durationMinutes: template.durationMinutes,
      ageGroup: template.ageGroup,
      tags: [...template.tags],
      coachingPoints: template.coachingPoints.map((point) => ({
        id: crypto.randomUUID(),
        text: point.text,
      })),
      equipment: template.equipment.map((item) => ({
        id: crypto.randomUUID(),
        name: item.name,
        quantity: item.quantity,
      })),
    };

    const token = authStorage.getToken();

    setCreatingTemplateId(template.id);
    setError(null);

    try {
      if (!token) {
        const now = new Date().toISOString();

        const localDrill: Drill = {
          ...payload,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };

        saveDrill(localDrill);
        router.push("/drills");
        return;
      }

      const savedDrill = await drillService.createDrill(
        payload,
        token
      );

      saveDrill(savedDrill);

      router.push("/drills");
    } catch {
      setError("Could not create drill from template.");
    } finally {
      setCreatingTemplateId(null);
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
          Drill Templates
        </h1>

        <p className="mt-2 text-muted-foreground">
          Start from a reusable drill template and customize it
          in your Drill Bank.
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {drillTemplates.map((template) => (
          <Card key={template.id} className="p-6">
            <p className="text-sm font-medium text-muted-foreground">
              {template.ageGroup ?? "No age group"} ·{" "}
              {template.type} · {template.durationMinutes} min
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              {template.title}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {template.description}
            </p>

            {template.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {template.coachingPoints.length > 0 && (
              <div className="mt-5 border-t pt-4">
                <p className="mb-2 text-sm font-medium">
                  Coaching points
                </p>

                <ul className="space-y-1 text-sm text-muted-foreground">
                  {template.coachingPoints.map((point) => (
                    <li key={point.id}>✓ {point.text}</li>
                  ))}
                </ul>
              </div>
            )}

            {template.equipment.length > 0 && (
              <div className="mt-5 border-t pt-4">
                <p className="mb-2 text-sm font-medium">
                  Equipment
                </p>

                <ul className="space-y-1 text-sm text-muted-foreground">
                  {template.equipment.map((item) => (
                    <li key={item.id}>
                      {item.name}: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <Button
                type="button"
                onClick={() => handleUseTemplate(template)}
                disabled={creatingTemplateId === template.id}
              >
                <Copy className="h-4 w-4" />

                {creatingTemplateId === template.id
                  ? "Creating..."
                  : "Use template"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}