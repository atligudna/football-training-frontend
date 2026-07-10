import { Card } from "@/components/ui/card";

export default function UpcomingSessionsCard() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold">
        Upcoming Sessions
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Coming soon...
      </p>
    </Card>
  );
}