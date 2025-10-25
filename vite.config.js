import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  base: "/", // important for preview/Vercel root
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
