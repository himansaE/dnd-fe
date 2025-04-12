import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import Unfonts from "unplugin-fonts/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Unfonts({
      google: {
        families: [
          "Ruslan Display",
          {
            name: "Poppins",
            styles: "wght@400;600",
            defer: true,
          },
        ],
      },
    }),
  ],
});
