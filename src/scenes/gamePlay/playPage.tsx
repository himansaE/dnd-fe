import { useStoryStore } from "@/stores/storyStore";
import { Navigate } from "react-router";
import { useStoryStart } from "@/lib/hooks/useStartStory";
import { useEffect } from "react";
import { LoadingScene } from "../loading/loading";
import { PlayScene } from "./playScene";
import { normalizeSegmentsMap } from "@/lib/utils";
import { storyService } from "@/lib/storyStore";

export const PlayScenePage = () => {
  const selectedStory = useStoryStore((state) => state.selectedStory);
  const selectedCharacters = useStoryStore((state) => state.selectedCharacters);
  const setStoryStartData = useStoryStore((state) => state.setStoryStartData);
  // const currentScene = useStoryStore((state) => state.currentScene);
  // const characters = useStoryStore((state) => state.characters);

  const { data: storyStartData, isLoading: isStoryStartLoading } =
    useStoryStart({
      hidden_description: selectedStory?.hidden_description,
      title: selectedStory?.title,
      plot: selectedStory?.plot,
      characterIds: selectedCharacters.map((c) => c.id),
    });

  useEffect(() => {
    if (!storyStartData) return;

    setStoryStartData(storyStartData);

    // Normalize start scene segments (fix character keys, flatten if needed)
    const normalized = normalizeSegmentsMap(storyStartData.startScene.segments);
    storyService.addSegments(normalized);
    storyService.addApiMessage(
      "assistant",
      JSON.stringify(storyStartData.startScene)
    );

    return () => {
      storyService.reset();
    };
  }, [storyStartData, setStoryStartData]);

  if (!selectedStory) return <Navigate to="/story/start" />;
  if (selectedCharacters.length !== 10) return <Navigate to="/story/detail" />;

  if (isStoryStartLoading || !storyStartData) return <LoadingScene />;

  return <PlayScene story={storyStartData.startScene} />;
};
