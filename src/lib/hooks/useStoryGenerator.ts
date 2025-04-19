import { useQuery } from "@tanstack/react-query";
import { storyGenerator } from "../endpoints/storyGenarator";

export const useStoryGenerator = () => {
  return useQuery({
    queryKey: ["story-generator"],
    queryFn: () => storyGenerator(),
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
