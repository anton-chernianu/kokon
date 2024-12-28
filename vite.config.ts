import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "src",
  base: "./",
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "../dist/frontend",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "./src/index.html",
      },
      external: ["worker_threads"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    modules: {
      scopeBehaviour: "local",
    },
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "@/assets/styles/core/_mixins.scss";`
      },
    },
  },
});
