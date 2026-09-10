import { RunTrainingStoryClient } from "@/features/sessions";

interface RunTrainingStoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function RunTrainingStoryPage({
  params,
}: RunTrainingStoryPageProps) {
  const { id } = await params;

  return <RunTrainingStoryClient key={id} id={id} />;
}