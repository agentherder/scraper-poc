import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  imports: false,
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    permissions: ["tabs", "sidePanel"],
  },
});
