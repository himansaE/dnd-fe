import { RouteObject } from "react-router";
import StoryGeneratorPage from "@/scenes/storyGenerator/storyGeneratorPage";
import StoryDetailPage from "@/scenes/storyGenerator/storyDetailPage";
import { PlayScenePage } from "@/scenes/gamePlay/playPage";

const routes = [
  {
    path: "start",
    Component: StoryGeneratorPage,
  },
  {
    path: "detail",
    Component: StoryDetailPage,
  },
  {
    path: "play",
    Component: PlayScenePage,
  },
] satisfies RouteObject[];

export { routes as storyRoutes };
