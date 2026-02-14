import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "./src/main.ts",
        "counter.worker": "./src/workers/counter.worker.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
