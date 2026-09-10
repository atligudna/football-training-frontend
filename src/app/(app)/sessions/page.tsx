import { ClipboardCheck, Plus, LayoutTemplate } from "lucide-react"; import Link from "next/link";

import { Button } from "@/components/ui/button";
import { TrainingStoriesClient } from "@/features/sessions";

export default function SessionsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Training Stories
          </h1>

          <p className="mt-2 text-muted-foreground">
            Plan and organize your football sessions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/sessions/history">
            <Button variant="secondary">
              <ClipboardCheck className="h-4 w-4" />
              View History
            </Button>
          </Link>

          <Link href="/sessions/templates">
            <Button variant="secondary">
              <LayoutTemplate className="h-4 w-4" />
              Templates
            </Button>
          </Link>
          <Link href="/sessions/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Training Story
            </Button>
          </Link>


        </div>
      </div>

      <TrainingStoriesClient />
    </div>
  );
}