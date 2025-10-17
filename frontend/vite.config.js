import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // Ensure React 19 automatic JSX runtime is used everywhere
      jsxImportSource: "react",
      babel: {
        plugins: [],
      },
    }),
  ],
  // Critical: make sure every dependency shares the same React instance
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    esbuildOptions: {
      jsx: "automatic",
    },
  },
});
