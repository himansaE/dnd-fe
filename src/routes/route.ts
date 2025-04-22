import { createBrowserRouter, RouteObject } from "react-router";
import SignInPage from "../scenes/auth/sign-in";
import FallbackPage from "../scenes/fallback";
import { LoadingScene } from "../scenes/loading/loading";
import { storyRoutes } from "./story.route";
import { MainMenuPage } from "@/scenes/mainMenu/mainMenuPage";
import { SettingsPage } from "@/scenes/settings/settingsPage";

export const routes = [
  {
    index: true,
    Component: MainMenuPage,
  },
  {
    path: "/sign-in",
    Component: SignInPage,
    children: [],
  },
  {
    path: "/loading",
    Component: LoadingScene,
  },
  {
    path: "/settings",
    Component: SettingsPage,
  },
  {
    path: "/story",
    children: storyRoutes,
  },
  {
    path: "*",
    Component: FallbackPage,
  },
] satisfies RouteObject[];

export const Router = createBrowserRouter(routes);
