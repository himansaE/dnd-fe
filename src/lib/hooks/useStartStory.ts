import { useQuery } from "@tanstack/react-query";
import { startScene } from "../endpoints/story";
import { storyGeneratorRes } from "../endpoints/storyGenarator";

type StoryStartRes = Partial<Omit<storyGeneratorRes, "card_background">> & {
  characterIds: string[];
};

export const useStoryStart = (req: StoryStartRes) => {
  return useQuery({
    queryKey: ["story-start", req],
    queryFn: () =>
      startScene(
        {
          title: req.title ?? "",
          plot: req.plot ?? "",
          hidden_description: req.hidden_description ?? "",
        },
        req.characterIds
      ),
    enabled:
      !!req.title &&
      !!req.plot &&
      !!req.hidden_description &&
      req.characterIds.length >= 10 &&
      req.characterIds.length <= 30,
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
