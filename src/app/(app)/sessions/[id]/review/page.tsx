import { TrainingStoryReviewClient } from "@/features/sessions";

interface TrainingStoryReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrainingStoryReviewPage({
  params,
}: TrainingStoryReviewPageProps) {
  const { id } = await params;

  return <TrainingStoryReviewClient key={id} id={id} />;
}