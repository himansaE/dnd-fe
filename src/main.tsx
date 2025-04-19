import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./global.css";
import { RouterProvider } from "react-router";
import { Router } from "./routes/route.ts";
import { AuthProvider } from "./components/auth-provider.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.ts";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={Router} />
        </QueryClientProvider>
      </AuthProvider>
    </ClerkProvider>
  </StrictMode>
);
