import { RouteObject } from "react-router";
import StoryGeneratorPage from "@/scenes/storyGenerator/storyGeneratorPage";
const routes = [
  {
    path: "start",
    Component: StoryGeneratorPage,
  },
] satisfies RouteObject[];

export { routes as storyRoutes };
