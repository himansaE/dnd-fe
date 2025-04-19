import { Router } from "./routes/route";
import { RouterProvider } from "react-router";

export default function App() {
  return (
    <div className="w-screen h-screen bg-gray-100">
      <RouterProvider router={Router} />
    </div>
  );
}
