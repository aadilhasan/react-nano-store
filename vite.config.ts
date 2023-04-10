import react from "@vitejs/plugin-react";
import path from "node:path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: path.resolve(__dirname, "examples/lib"),
      insertTypesEntry: true,
      exclude: ["examples/vite-env.d.ts"],
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/index.ts"),
      name: "react-nano-store",
      formats: ["es", "umd", "cjs"],
      fileName: (format) => `react-nano-store.${format}.js`,
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
    minify: "esbuild",
  },
});
