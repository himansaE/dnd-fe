import { useStoryStore } from "@/stores/storyStore";
import { Navigate } from "react-router";
import { useStoryStart } from "@/lib/hooks/useStartStory";
import { LoadingScene } from "../loading/loading";
import { useEffect } from "react";
import { PlayScene } from "./PlayScene";

export const PlayScenePage = () => {
  const selectedStory = useStoryStore((state) => state.selectedStory);
  const setStoryStartData = useStoryStore((state) => state.setStoryStartData);
  // const currentScene = useStoryStore((state) => state.currentScene);
  // const characters = useStoryStore((state) => state.characters);

  const { data: storyStartData, isLoading: isStoryStartLoading } =
    useStoryStart({
      hidden_description: selectedStory?.hidden_description,
      title: selectedStory?.title,
      plot: selectedStory?.plot,
    });

  useEffect(() => {
    if (!storyStartData) return;

    setStoryStartData(storyStartData);
  }, [storyStartData, setStoryStartData]);

  if (!selectedStory) return <Navigate to="/story/start" />;

  if (isStoryStartLoading || !storyStartData) return <LoadingScene />;

  return <PlayScene story={storyStartData.startScene} />;
};
