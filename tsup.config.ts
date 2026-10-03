import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/package/index.ts" },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  minify: true,
  target: "es2019",
});
