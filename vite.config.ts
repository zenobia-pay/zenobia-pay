import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import { cloudflare } from "@cloudflare/vite-plugin"

export default defineConfig(({ mode }) => ({
  plugins: [
    solid(),
    cloudflare({
      environment: mode === "production" ? "production" : "beta",
    }),
  ],
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
}))
