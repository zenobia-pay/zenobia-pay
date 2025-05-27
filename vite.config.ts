import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import { cloudflare } from "@cloudflare/vite-plugin"

export default defineConfig({
  plugins: [solid(), cloudflare()],
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
})
