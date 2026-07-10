import NextTrainingCard from "@/features/dashboard/components/NextTrainingCard";
import QuickActionsCard from "@/features/dashboard/components/QuickActionsCard";
import TrainingOverviewCard from "@/features/dashboard/components/TrainingOverviewCard";
import UpcomingSessionsCard from "@/features/dashboard/components/UpcomingSessionsCard";
import CoachNotesCard from "@/features/dashboard/components/CoachNotesCard";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Overview of your upcoming activities.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          <NextTrainingCard />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <QuickActionsCard />
        </div>

        <div className="col-span-12">
          <TrainingOverviewCard />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <UpcomingSessionsCard />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <CoachNotesCard />
        </div>
      </div>
    </div>
  );
}