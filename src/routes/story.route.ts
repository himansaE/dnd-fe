import { RouteObject } from "react-router";
import StoryGeneratorPage from "@/scenes/storyGenerator/storyGeneratorPage";
import StoryDetailPage from "@/scenes/storyGenerator/storyDetailPage";
import AdventurePage from "@/scenes/storyGenerator/adventurePage";

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
    path: "adventure",
    Component: AdventurePage,
  },
] satisfies RouteObject[];

export { routes as storyRoutes };
