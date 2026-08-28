import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CreateTrainingStoryForm } from "@/features/sessions";

export default function NewTrainingStoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/sessions">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4" />
            Back to Training Stories
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          New Training Story
        </h1>

        <p className="mt-2 text-muted-foreground">
          Create a new football training session.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <CreateTrainingStoryForm />
      </div>
    </div>
  );
}