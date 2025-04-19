import { createBrowserRouter, RouteObject } from "react-router";
import SignInPage from "../scenes/auth/sign-in";
import FallbackPage from "../scenes/fallback";
import { LoadingScene } from "../scenes/loading/loading";
import { storyRoutes } from "./story.route";

export const routes = [
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
    path: "/story",
    children: storyRoutes,
  },
  {
    path: "*",
    Component: FallbackPage,
  },
] satisfies RouteObject[];

export const Router = createBrowserRouter(routes);
