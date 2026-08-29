"use client";

import { useState } from "react";

import { trainingStories } from "../data/training-stories";
import { getAllTrainingStories } from "../utils/training-story-storage";
import { TrainingStoryList } from "./TrainingStoryList";

import type { TrainingStory } from "../types/training-story";

function getInitialTrainingStories(): TrainingStory[] {
  return getAllTrainingStories(trainingStories);
}

export function TrainingStoriesClient() {
  const [stories] = useState<TrainingStory[]>(getInitialTrainingStories);

  return <TrainingStoryList stories={stories} />;
}