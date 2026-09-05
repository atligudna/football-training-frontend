import { TrainingStoryDetailClient } from "@/features/sessions";

interface TrainingStoryDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TrainingStoryDetailPage({
  params,
}: TrainingStoryDetailPageProps) {
  const { id } = await params;

  return <TrainingStoryDetailClient key={id} id={id} />;
}