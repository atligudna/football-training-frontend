import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NextTrainingCard() {
  return (
    <Card className="p-6">
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Next Training
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Today · 18:00–19:30
          </h2>

          <p className="text-muted-foreground">
            FH U12 • Kaplakriki 3
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Duration</span>
            <span className="font-medium">90 min</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Players</span>
            <span className="font-medium">22</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Status</span>
            <span className="font-medium text-green-600">
              Ready
            </span>
          </div>
        </div>

        <Button className="w-full">
          Open Training
        </Button>
      </div>
    </Card>
  );
}