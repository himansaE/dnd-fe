import { useQuery } from "@tanstack/react-query";
import { startScene } from "../endpoints/storyStart";
import { storyGeneratorRes } from "../endpoints/storyGenarator";

type StoryStartRes = Partial<Omit<storyGeneratorRes, "card_background">>;

export const useStoryStart = (req: StoryStartRes) => {
  return useQuery({
    queryKey: ["story-start", req],
    queryFn: () =>
      startScene({
        title: req.title ?? "",
        plot: req.plot ?? "",
        hidden_description: req.hidden_description ?? "",
      }),
    enabled: !!req.title && !!req.plot && !!req.hidden_description,
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
